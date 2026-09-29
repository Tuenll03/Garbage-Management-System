package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ServiceRepository;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;

import com.example.demo.entity.Invoice;
import com.example.demo.entity.Service;
import org.springframework.lang.NonNull;

import java.util.HashMap;
import java.util.List;
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.temporal.TemporalAdjusters;

import java.sql.Connection;
import javax.sql.DataSource;
import java.util.Map;
import java.io.InputStream;

@org.springframework.stereotype.Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private DataSource dataSource;

    public List<Invoice> getAllInvoice() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(@NonNull Integer id) {
        try {
            return invoiceRepository.findById(id).orElse(null);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return null;
        }
    }

    public List<Invoice> getInvoicesByMemberId(@NonNull Integer memberId) {
        return invoiceRepository.findByService_Member_MemberId(memberId);
    }

    // ทำงานอัตโนมัติ ทุกๆ 10 วินาที เพื่อสำหรับการทดสอบ (ย้ายกลับเป็น "0 0 0 1 * ?"
    // เมื่อรันโปรดักชันจริง)
    @Scheduled(cron = "*/10 * * * * ?")
    public void autoGenerateMonthlyInvoices() {
        try {
            List<Service> services = serviceRepository.findAll();
            LocalDate now = LocalDate.now();

            // ย้ายมาตรงนี้ เพื่อดึงข้อมูลจาก DB แค่ครั้งเดียวพอ
            List<Invoice> existingInvoices = invoiceRepository.findAll();

            for (Service service : services) {
                // หากบริการได้รับการ "อนุมัติ" แล้ว ให้สร้างใบแจ้งหนี้รายเดือนอัตโนมัติ
                if ("อนุมัติ".equals(service.getStatus())) {

                    // ป้องกันการสร้างใบแจ้งหนี้ซ้ำ เช็คว่าเคยมี Invoice
                    // ของบริการนี้ในระบบแล้วหรือยัง
                    boolean alreadyExists = false;

                    // ตรวจสอบว่าเป็นรายปีหรือรายเดือน
                    boolean isYearly = "ชำระรายปี".equals(service.getServiceType());

                    for (Invoice inv : existingInvoices) {

                        LocalDate invoiceDate = inv.getInvoiceDate();

                        // เช็คว่าไม่เป็น null และบริการของบ้านหลังนี้ ได้ออกบิลไปยัง
                        if (invoiceDate != null && inv.getService() != null
                                && inv.getService().getServiceId() == service.getServiceId()) {

                            int month = invoiceDate.getMonthValue();
                            int year = invoiceDate.getYear();

                            if (isYearly) {

                                // เช็คว่าตรงกับปีปัจจุบันของตัวแปร now หรือไม่
                                if (year == now.getYear()) {
                                    alreadyExists = true;
                                    break;
                                }

                            } else {

                                // เช็คว่าตรงกับเดือนและปีปัจจุบันของตัวแปร now หรือไม่
                                if (year == now.getYear() && month == now.getMonthValue()) {
                                    alreadyExists = true;
                                    break;
                                }

                            }

                        }
                    }

                    if (!alreadyExists) {
                        Invoice invoice = new Invoice();
                        invoice.setService(service);
                        invoice.setInvoiceDate(now);

                        // เช็คว่าเป็นรายปีหรือรายเดือนและออกตามกำหนด
                        if (isYearly) {
                            invoice.setDueDate(now.with(TemporalAdjusters.lastDayOfYear()));
                            invoice.setTotalAmount(invoice.getService().getPrice() * 12);
                        } else {
                            invoice.setDueDate(now.with(TemporalAdjusters.lastDayOfMonth()));
                            invoice.setTotalAmount(invoice.getService().getPrice());
                        }
                        String dateStr = now.toString().replace("-", "");
                        invoice.setInvoiceNumber(String.format("INV-%s-%04d", dateStr, service.getServiceId()));

                        invoice.setStatus("ค้างชำระ");

                        invoiceRepository.save(invoice);
                        System.out.println("Auto-generated invoice for Service ID: " + service.getServiceId());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error running auto-generate monthly invoices: " + e.getMessage());
        }
    }

    public byte[] generateInvoicePdf(int invoiceId) throws Exception {

        // 1. อ่านไฟล์แบบฟอร์มสำเร็จรูปจาก resources/reports/
        InputStream reportStream = getClass().getResourceAsStream("/reports/Invoice.jrxml");

        // ตรวจสอบแบบฟอร์มให้ระบบพร้อมใช้งาน
        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

        // 2. นำไอดีบิลใส่เป็นพารามิเตอร์ส่งไปให้ SQL ใน Jasper
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("BILL_ID", invoiceId);

        // 3. ใช้คำสั่ง try-with-resources เพื่อขอสายต่อ DB
        // และปิดสายคืนให้อัตโนมัติเมื่อทำเสร็จ
        try (Connection conn = dataSource.getConnection()) {

            // สั่งกรอกข้อมูลลงไปในไฟล์แบบฟอร์ม
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, conn);

            // 4. แปลงข้อมูลที่กรอกแล้วให้กลายเป็น "ไฟล์ PDF" จริงๆ
            return JasperExportManager.exportReportToPdf(jasperPrint);
        }
    }

}
