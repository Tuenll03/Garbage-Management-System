package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import com.example.demo.entity.Admin;
import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api/admins")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping
    public List<Admin> getAllAdmin() {
        return adminService.getAllAdmin();
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable @NonNull Integer id) {
        return adminService.getAdminById(id);
    }

    @PostMapping
    public String createAdmin(@RequestBody @NonNull Admin admin) {
        String result = adminService.createAdmin(admin);
        return result;
    }

    @PutMapping("/{id}")
    public String updateAdmin(@PathVariable @NonNull Integer id, @RequestBody @NonNull Admin admin) {
        String result = adminService.updateAdmin(id, admin);
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable @NonNull Integer id) {
        String result = adminService.deleteAdmin(id);
        return result;
    }

}