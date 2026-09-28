package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Invoice;
import org.springframework.lang.NonNull;
import java.util.List;
import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

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
    public String verifyPayment(@NonNull Payment payment) {
        try {

            if (payment.getInvoice() == null) {
                return "Invoice is required";
            }
            Integer invoiceId = payment.getInvoice().getInvoiceId();
            Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
            if (invoice == null) {
                return "Invoice not found";
            }

            if (payment.getSlipImage() == null || payment.getSlipImage().isEmpty()) {
                return "Slip image is required";
            }

            String base64Image = payment.getSlipImage();
            base64Image = base64Image.substring(base64Image.indexOf(",") + 1);

            Map<String, Object> data = new HashMap<>();
            data.put("img", base64Image);
            data.put("tos", true);
            data.put("privacy", true);
            data.put("eula", true);

            // 1. กำหนดหัวใหม่ว่าเป็น JSON และปลอมเป็น Browser
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            // 2. เอากล่องข้อมูล data มาประกบเข้ากับหัว headers
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(data, headers);

            // 3. สั่งยิงออกไป (ส่ง requestEntity แทน data)
            RestTemplate restTemplate = new RestTemplate();
            String slipApiUrl = "https://slip-c.oiio.download/api/slip";
            Map<?, ?> response = restTemplate.postForObject(slipApiUrl, requestEntity, Map.class);

            if (response != null && "Slip processed successfully.".equals(response.get("message"))) {

                Map<?, ?> dataslip = (Map<?, ?>) response.get("data");

                Number amount = (Number) dataslip.get("amount");

                String receiverId = (String) dataslip.get("receiver_id");

                if (receiverId != null) {
                    // 2. ลบอักขระพิเศษที่ไม่ใช่ตัวเลขและไม่ใช่ x ออก
                    String cleanMasked = receiverId.replaceAll("[^0-9xX]", "");
                    // 3. แปลง x และ X เป็นเครื่องหมายจุด (.) สำหรับ Regex Wildcard
                    String pattern = cleanMasked.replaceAll("[xX]", ".");
                    // 4. นำเลขบัญชีจริง 10 หลักมาตรวจสอบเทียบกับ Pattern
                    if (!"6606244978".matches(pattern)) {
                        return "Receiver ID is not match";
                    }
                }

                if (amount.doubleValue() < invoice.getTotalAmount()) {
                    return "Amount is not match";
                }

                // ตรวจธนาคารกับยอดเงินเสร็จแล้วส่วนต่อตรวจสอบสลิปว่าใครมีการใช้สลิปนี้แล้วหรือยัง

                if (paymentRepository.existsBySlipImage(payment.getSlipImage())) {
                    return "Slip image already exists";
                }

                // 1. ตั้งค่าวันที่ชำระเงินเป็นปัจจุบัน
                if (payment.getPaymentDate() == null) {
                    payment.setPaymentDate(LocalDate.now());
                }

                payment.setInvoice(invoice);

                // 2. บันทึกประวัติการจ่ายเงิน (Payment)
                payment.setAmountPaid(amount.intValue());
                payment.setPaymentMethod("โอนผ่านธนาคาร");
                paymentRepository.save(payment);

                // 3. อัปเดตสถานะใบแจ้งหนี้เป็น "ชำระเงินแล้ว"
                invoice.setStatus("ชำระเงินแล้ว");
                invoiceRepository.save(invoice);

                return "successfully";

            }
            return "error";

        } catch (Exception e) {
            System.err.println(e.getMessage());

            // Error RuntimeException ออกไป เพื่อสั่งให้ @Transactional ทำการ Rollback
            // หยุดการบันทึกทั้งหมด
            throw new RuntimeException("ไม่สามารถบันทึกชำระเงินได้เนื่องจาก: " + e.getMessage());
        }
    }

    public String makeCustomerPayment(@NonNull Payment payment) {
        try {

            if (payment.getInvoice() == null) {
                return "Invoice is required";
            }
            Integer invoiceId = payment.getInvoice().getInvoiceId();
            Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
            if (invoice == null) {
                return "Invoice not found";
            }

            payment.setInvoice(invoice);

            // 2. บันทึกประวัติการจ่ายเงิน (Payment)
            paymentRepository.save(payment);

            // 3. อัปเดตสถานะใบแจ้งหนี้เป็น "ชำระเงินแล้ว"
            invoice.setStatus("ชำระเงินแล้ว");
            invoiceRepository.save(invoice);

            return "successfully";

        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

}
