package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.LoginService;
import com.example.demo.dto.LoginRequest;

@RestController
@RequestMapping("/login")
public class HomeController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public String login(@RequestBody LoginRequest LoginRequest) {
        String citizenId = LoginRequest.getCitizenId();
        String password = LoginRequest.getPassword();
        String result = loginService.login(citizenId, password);
        return result;
    }

}
