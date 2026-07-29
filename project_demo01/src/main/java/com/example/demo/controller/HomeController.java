package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.LoginService;
import com.example.demo.dto.LoginRequest;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/login")
public class HomeController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public String login(@RequestBody @NonNull LoginRequest LoginRequest) {
        String citizenId = LoginRequest.getCitizenId();
        String password = LoginRequest.getPassword();
        if (citizenId == null || password == null) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }
        String result = loginService.login(citizenId, password);
        return result;
    }

}
