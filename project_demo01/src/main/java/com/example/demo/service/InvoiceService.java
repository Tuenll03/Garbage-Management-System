package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.entity.Invoice;
import com.example.demo.entity.Service;
import org.springframework.lang.NonNull;
import java.util.List;
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import java.time.temporal.TemporalAdjusters;

@org.springframework.stereotype.Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public List<Invoice> getAllInvoice() {
        return invoiceRepository.findAll();
    }

    // public Invoice getInvoiceById(Integer id) {
    // try {
    // return invoiceRepository.findById(id).orElse(null);
    // } catch (Exception e) {
    // System.err.println(e.getMessage());
    // return null;
    // }
    // }

    public List<Invoice> getInvoicesByMemberId(@NonNull Integer memberId) {
        return invoiceRepository.findByService_Member_MemberId(memberId);
    }

    // ทำงานอัตโนมัติ ทุกๆ 10 วินาที เพื่อสำหรับการทดสอบ (ย้ายกลับเป็น "0 0 0 1 * ?"
    // เมื่อรันโปรดักชันจริง)
    @Scheduled(cron = "*/10 * * * * *")
    public void autoGenerateMonthlyInvoices() {
        try {
            List<Service> services = serviceRepository.findAll();
            LocalDate now = LocalDate.now();

            // ⭐️ ย้ายมาตรงนี้ เพื่อดึงข้อมูลจาก DB แค่ครั้งเดียวพอ
            List<Invoice> existingInvoices = invoiceRepository.findAll();

            for (Service service : services) {
                // หากบริการได้รับการ "อนุมัติ" แล้ว ให้สร้างใบแจ้งหนี้รายเดือนอัตโนมัติ
                if ("อนุมัติ".equals(service.getStatus())) {

                    // ป้องกันการสร้างใบแจ้งหนี้ซ้ำ (เช็คว่าเคยมี Invoice
                    // ของบริการนี้ในระบบแล้วหรือยัง)
                    boolean alreadyExists = false;

                    for (Invoice inv : existingInvoices) {

                        LocalDate invoiceDate = inv.getInvoiceDate();
                        if (invoiceDate != null) {
                            int month = invoiceDate.getMonthValue();
                            int year = invoiceDate.getYear();

                            // เช็คว่าตรงกับเดือนและปีปัจจุบันของตัวแปร now หรือไม่
                            if (inv.getService() != null && inv.getService().getServiceId() == service.getServiceId() &&
                                    month == now.getMonthValue() &&
                                    year == now.getYear()) {
                                alreadyExists = true;
                                break;
                            }
                        }
                    }

                    if (!alreadyExists) {
                        Invoice invoice = new Invoice();
                        invoice.setService(service);
                        invoice.setInvoiceDate(now);
                        invoice.setDueDate(now.with(TemporalAdjusters.lastDayOfMonth()));

                        String dateStr = now.toString().replace("-", "");
                        int randomNum = (int) (Math.random() * 9000) + 1000;
                        invoice.setInvoiceNumber("INV-" + dateStr + "-" + randomNum);
                        invoice.setTotalAmount(service.getPrice() * service.getGarbageWeight());
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

    // public String updateInvoice(Integer id, Invoice invoice) {
    // try {
    // Invoice existingInvoice = invoiceRepository.findById(id).orElse(null);
    // if (existingInvoice == null) {
    // return "Invoice not found";
    // }

    // existingInvoice.setInvoiceNumber(
    // invoice.getInvoiceNumber() != null ? invoice.getInvoiceNumber()
    // : existingInvoice.getInvoiceNumber());
    // existingInvoice.setInvoiceDate(
    // invoice.getInvoiceDate() != null ? invoice.getInvoiceDate() :
    // existingInvoice.getInvoiceDate());
    // existingInvoice.setDueDate(
    // invoice.getDueDate() != null ? invoice.getDueDate() :
    // existingInvoice.getDueDate());
    // existingInvoice.setStatus(
    // invoice.getStatus() != null ? invoice.getStatus() :
    // existingInvoice.getStatus());
    // existingInvoice.setTotalAmount(
    // invoice.getTotalAmount() > 0 ? invoice.getTotalAmount() :
    // existingInvoice.getTotalAmount());

    // invoiceRepository.save(existingInvoice);
    // return "Invoice updated successfully";
    // } catch (Exception e) {
    // System.err.println(e.getMessage());
    // return "error";
    // }
    // }

}
