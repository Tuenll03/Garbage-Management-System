package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.entity.Service;

import java.util.List;
import com.example.demo.repository.MemberRepository;
import com.example.demo.entity.DocumentOfficer;
import com.example.demo.entity.Member;
import com.example.demo.repository.OfficerRepository;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private OfficerRepository officerRepository;

    public List<Service> getAllService() {
        return serviceRepository.findAll();
    }

    public List<Service> getServiceByMemberId(@NonNull Integer id) {
        return serviceRepository.findByMemberMemberId(id);
    }

    // add member service success
    public String createService(@NonNull Service service) {
        try {
            if (service.getMember() == null) {
                return "Member ID is required";
            }
            Integer memberId = service.getMember().getMemberId(); // ดึง ID ตรงนี้

            Member member = memberRepository.findById(memberId).orElse(null);
            if (member == null) {
                return "Member not found";
            }
            service.setMember(member); // ผูกความสัมพันธ์กับข้อมูลจริงใน DB
            serviceRepository.save(service);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String updateService(@NonNull Service service, @NonNull Integer id) {
        try {
            Service existingService = serviceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return "Service not found";
            }
            existingService.setDetail(service.getDetail() == null ? existingService.getDetail() : service.getDetail());
            serviceRepository.save(existingService);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    // officer approve service
    public String approveService(@NonNull Service service, @NonNull Integer id) {
        try {
            // 1. ดึงข้อมูลบริการเดิมที่มีอยู่แล้วในฐานข้อมูลขึ้นมา
            Service existingService = serviceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return "Service not found";
            }
            // 2. ตรวจสอบข้อมูล Officer ที่ส่งเข้ามาอนุมัติ
            if (service.getOfficer() == null) {
                return "Officer is required";
            }
            Integer officerId = service.getOfficer().getOfficerId();
            DocumentOfficer officer = officerRepository.findById(officerId).orElse(null);
            if (officer == null) {
                return "Officer not found";
            }
            // 3. ทำการอัปเดตเฉพาะฟิลด์ที่ต้องการ
            existingService.setOfficer(officer);
            existingService.setStatus("อนุมัติ");
            // 4. บันทึกตัวเดิมที่ถูกอัปเดตเรียบร้อยแล้ว
            serviceRepository.save(existingService);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void sendServiceNotification() {

    }
}
