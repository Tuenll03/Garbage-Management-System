package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.demo.entity.Payment;
import com.example.demo.service.PaymentService;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // @GetMapping("/{id}")
    // public Payment getPaymentById(@PathVariable Integer id) {
    // return paymentService.getPaymentById(id);
    // }

    @GetMapping("/member/{memberId}")
    public List<Payment> getPaymentsByMemberId(@PathVariable @NonNull Integer memberId) {
        return paymentService.getPaymentsByMemberId(memberId);
    }

    @PostMapping
    public String createPayment(@RequestBody @NonNull Payment payment) {
        return paymentService.createPayment(payment);
    }

}
