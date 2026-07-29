package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.*;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.OfficerRepository;
import org.springframework.lang.NonNull;

@Service
public class LoginService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private OfficerRepository officerRepository;

    public String login(@NonNull String citizenId, @NonNull String password) {
        // 1. ค้นหาในกลุ่ม Admin ก่อน
        Admin admin = adminRepository.findByCitizenId(citizenId);
        if (admin != null) {
            if (admin.getPassword().equals(password)) {
                return "Admin"; // ส่งไปหน้าต่อไป
            }
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }

        // 2. ถ้าไม่พบใน Admin ให้ค้นหาในกลุ่ม Officer ต่อ
        DocumentOfficer officer = officerRepository.findByCitizenId(citizenId);
        if (officer != null) {
            if (officer.getPassword().equals(password)) {
                return "Officer";
            }
            return "Password not match";
        }

        // 3. ถ้าไม่พบใน Officer ให้ค้นหาในกลุ่ม Member ต่อ
        Member member = memberRepository.findByCitizenId(citizenId);
        if (member != null) {
            if (member.getPassword().equals(password)) {
                return "Member";
            }
            return "Password not match";
        }
        // 4. ไม่พบผู้ใช้งานรายนี้ในระบบเลย
        return "User not found";
    }

}
