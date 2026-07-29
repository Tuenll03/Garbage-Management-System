package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Invoice;
import org.springframework.lang.NonNull;
import java.util.List;
import java.time.LocalDate;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // public Payment getPaymentById(Integer id) {
    // try {
    // return paymentRepository.findById(id).orElse(null);
    // } catch (Exception e) {
    // System.err.println(e.getMessage());
    // return null;
    // }
    // }

    public List<Payment> getPaymentsByMemberId(@NonNull Integer memberId) {
        return paymentRepository.findByInvoice_Service_Member_MemberId(memberId);
    }

    // ยังต้องมีการปรับอีกหน่อย
    @Transactional
    public String createPayment(@NonNull Payment payment) {
        try {
            if (payment.getInvoice() == null) {
                return "Invoice is required";
            }
            Integer invoiceId = payment.getInvoice().getInvoiceId();
            Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
            if (invoice == null) {
                return "Invoice not found";
            }

            // 1. ตั้งค่าวันที่ชำระเงินเป็นปัจจุบัน
            payment.setPaymentDate(LocalDate.now());
            payment.setInvoice(invoice);

            // 2. บันทึกประวัติการจ่ายเงิน (Payment)
            paymentRepository.save(payment);

            // 3. อัปเดตสถานะใบแจ้งหนี้เป็น "ชำระเงินแล้ว"
            invoice.setStatus("ชำระเงินแล้ว");
            invoiceRepository.save(invoice);

            return "Payment created and Invoice status updated successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());

            // Error RuntimeException ออกไป เพื่อสั่งให้ @Transactional ทำการ Rollback
            // หยุดการบันทึกทั้งหมด
            throw new RuntimeException("ไม่สามารถบันทึกชำระเงินได้เนื่องจาก: " + e.getMessage());
        }
    }

}
