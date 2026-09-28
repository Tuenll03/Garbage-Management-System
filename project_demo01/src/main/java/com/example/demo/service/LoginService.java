package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.*;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.OfficerRepository;

@Service
public class LoginService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private OfficerRepository officerRepository;

    public String login(String citizenId, String password) {

        // Find Admin
        Admin admin = adminRepository.findByCitizenId(citizenId);
        if (admin != null) {
            return admin.getPassword().equals(password) ? "Admin" : "Password not match";
        }

        // Find Officer
        DocumentOfficer officer = officerRepository.findByCitizenId(citizenId);
        if (officer != null) {
            return officer.getPassword().equals(password) ? "Officer" : "Password not match";
        }

        // Find Member
        Member member = memberRepository.findByCitizenId(citizenId);
        if (member != null) {
            return member.getPassword().equals(password) ? "Member" : "Password not match";
        }

        return "User not found";
    }

}
