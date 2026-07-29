package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.OfficerRepository;
import org.springframework.lang.NonNull;
import java.util.List;
import com.example.demo.entity.DocumentOfficer;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    public List<DocumentOfficer> getAllOfficer() {
        return officerRepository.findAll();
    }

    public DocumentOfficer getOfficerById(@NonNull Integer id) {
        return officerRepository.findById(id).orElse(null);
    }

    public String createOfficer(@NonNull DocumentOfficer officer) {
        try {
            officerRepository.save(officer);
            return "Officer created successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String updateOfficer(@NonNull DocumentOfficer officer, @NonNull Integer id) {
        try {
            // ดึงข้อมูลเดิมจาก DB มาเก็บใน mngofficer (มีข้อมูลครบถ้วนทุกฟิลด์)
            DocumentOfficer mngofficer = officerRepository.findById(id).orElse(null);
            if (mngofficer == null) {
                return "Officer not found";
            }

            // อัปเดตทับเฉพาะฟิลด์ที่ส่งมาจากหน้าบ้าน (ถ้าไม่ส่งมาให้ใช้ค่าเดิม)
            mngofficer
                    .setFirstName(officer.getFirstName() != null ? officer.getFirstName() : mngofficer.getFirstName());
            mngofficer.setLastName(officer.getLastName() != null ? officer.getLastName() : mngofficer.getLastName());

            // บันทึกตัว mngofficer (ที่มีฟิลด์อื่น ๆ เช่น password ครบถ้วนอยู่แล้ว)
            officerRepository.save(mngofficer);

            return "Officer updated successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String deleteOfficer(@NonNull Integer id) {
        try {
            officerRepository.deleteById(id);
            return "Officer deleted successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }
}
