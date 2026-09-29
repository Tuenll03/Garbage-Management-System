package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.entity.Invoice;
import com.example.demo.service.InvoiceService;
import org.springframework.lang.NonNull;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAllInvoice() {
        return invoiceService.getAllInvoice();
    }

    @GetMapping("/{id}")
    public Invoice getInvoiceById(@PathVariable @NonNull Integer id) {
        return invoiceService.getInvoiceById(id);
    }

    @GetMapping("/member/{memberId}")
    public List<Invoice> getInvoicesByMemberId(@PathVariable @NonNull Integer memberId) {
        return invoiceService.getInvoicesByMemberId(memberId);
    }

    // @PutMapping("/{id}")
    // public String updateInvoice(@PathVariable Integer id, @RequestBody Invoice
    // invoice) {
    // return invoiceService.updateInvoice(id, invoice);
    // }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable int id) {
        try {
            // 1. ขอไฟล์ PDF จาก service
            byte[] pdfBytes = invoiceService.generateInvoicePdf(id);

            // 2. ส่งป้ายปะหน้าบอกบราวเซอร์ว่านี่คือไฟล์ PDF (application/pdf)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            // "inline" สั่งให้บราวเซอร์เปิดแสดงผลพรีวิวบนเว็บโดยไม่ดาวน์โหลดอัตโนมัติ
            headers.add("Content-Disposition", "inline; filename=\"invoice-" + id + ".pdf\"");

            // 3. ส่งข้อมูลทั้งหมดตอบกลับไปหาผู้ใช้
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
