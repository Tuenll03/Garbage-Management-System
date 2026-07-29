package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import com.example.demo.repository.AdminRepository;
import com.example.demo.entity.Admin;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmin() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(@NonNull Integer id) {
        try {
            return adminRepository.findById(id).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    public String createAdmin(@NonNull Admin admin) {
        try {
            adminRepository.save(admin);
            return "success";
        } catch (Exception e) {

            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String updateAdmin(@NonNull Integer id, @NonNull Admin admin) {
        try {
            Admin mngadmin = adminRepository.findById(id).orElse(null);
            if (mngadmin == null) {
                return "Admin not found";
            }

            mngadmin.setFirstName(admin.getFirstName() != null ? admin.getFirstName() : mngadmin.getFirstName());
            mngadmin.setLastName(admin.getLastName() != null ? admin.getLastName() : mngadmin.getLastName());
            mngadmin.setPassword(admin.getPassword() != null ? admin.getPassword() : mngadmin.getPassword());
            mngadmin.setPosition(admin.getPosition() != null ? admin.getPosition() : mngadmin.getPosition());
            mngadmin.setPrefix(admin.getPrefix() != null ? admin.getPrefix() : mngadmin.getPrefix());
            adminRepository.save(mngadmin);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String deleteAdmin(@NonNull Integer id) {
        try {
            adminRepository.deleteById(id);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

}
