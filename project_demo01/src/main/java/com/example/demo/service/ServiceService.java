package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.ServiceRepository;
import com.example.demo.entity.Service;

import java.util.List;
import com.example.demo.repository.MemberRepository;
import com.example.demo.entity.DocumentOfficer;
import com.example.demo.entity.Member;
import com.example.demo.repository.OfficerRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.entity.Invoice;
import org.springframework.lang.NonNull;
import java.time.LocalDate;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private OfficerRepository officerRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Service> getAllService() {
        return serviceRepository.findAll();
    }

    public List<Service> getServiceByMemberId(@NonNull Integer id) {
        return serviceRepository.findByMemberMemberId(id);
    }

    public Service getServiceById(@NonNull Integer id) {
        return serviceRepository.findById(id).orElse(null);
    }

    // add member service success
    public String requestService(@NonNull Service service) {
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

    // officer reject service
    public String rejectService(@NonNull Service service, @NonNull Integer id) {
        try {
            Service existingService = serviceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return "Service not found";
            }
            if (service.getOfficer() == null) {
                return "Officer is required";
            }
            Integer officerId = service.getOfficer().getOfficerId();
            DocumentOfficer officer = officerRepository.findById(officerId).orElse(null);
            if (officer == null) {
                return "Officer not found";
            }
            existingService.setOfficer(officer);
            existingService.setStatus("ไม่ผ่านการอนุมัติ"); // 🔴 เซ็ตสถานะเป็นไม่ผ่าน
            serviceRepository.save(existingService);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    // check unpaid invoice before cancel service
    public String cancelService(@NonNull Integer id) {
        try {
            Service existingService = serviceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return "Service not found";
            }

            List<Invoice> invoices = invoiceRepository
                    .findByService_ServiceId(existingService.getServiceId());

            boolean hasUnpaid = invoices != null && invoices.stream()
                    .anyMatch(inv -> "ค้างชำระ".equals(inv.getStatus()));

            if (hasUnpaid) {
                return "Member has unpaid invoice";
            } else {
                LocalDate today = LocalDate.now();

                existingService.setStatus("ยกเลิก");
                existingService.setEndDate(today);
                serviceRepository.save(existingService);
                return "success";
            }

        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    // reapply cancelled service
    public String reapplyService(@NonNull Integer id) {
        try {
            Service existingService = serviceRepository.findById(id).orElse(null);
            if (existingService == null) {
                return "Service not found";
            }
            existingService.setStatus("รอดำเนินการ");
            existingService.setRequestDate(LocalDate.now());
            existingService.setEndDate(null);
            serviceRepository.save(existingService);
            return "success";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

}

