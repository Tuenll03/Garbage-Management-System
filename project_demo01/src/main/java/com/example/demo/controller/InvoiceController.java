package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.entity.Invoice;
import com.example.demo.service.InvoiceService;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAllInvoice() {
        return invoiceService.getAllInvoice();
    }

    // @GetMapping("/{id}")
    // public Invoice getInvoiceById(@PathVariable Integer id) {
    // return invoiceService.getInvoiceById(id);
    // }

    @GetMapping("/member/{memberId}")
    public List<Invoice> getInvoicesByMemberId(@PathVariable @NonNull Integer memberId) {
        return invoiceService.getInvoicesByMemberId(memberId);
    }

    // @PutMapping("/{id}")
    // public String updateInvoice(@PathVariable Integer id, @RequestBody Invoice
    // invoice) {
    // return invoiceService.updateInvoice(id, invoice);
    // }

}
