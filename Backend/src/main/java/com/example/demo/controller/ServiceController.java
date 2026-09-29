package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*; // ตัวเดียวจบเลย ได้ทั้ง @RequestMapping, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @CrossOrigin
import com.example.demo.service.ServiceService;
import com.example.demo.entity.Service;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public List<Service> getAllService() {
        return serviceService.getAllService();
    }

    @GetMapping("/member/{id}")
    public List<Service> getServiceByMemberId(@PathVariable @NonNull Integer id) {
        return serviceService.getServiceByMemberId(id);
    }

    @GetMapping("/{id}")
    public Service getServiceById(@PathVariable @NonNull Integer id) {
        return serviceService.getServiceById(id);
    }

    // method pass
    @PostMapping
    public String requestService(@RequestBody @NonNull Service service) {
        String result = serviceService.requestService(service);
        return result;
    }

    @PutMapping("/{id}")
    public String updateService(@RequestBody @NonNull Service service, @PathVariable @NonNull Integer id) {
        String result = serviceService.updateService(service, id);
        return result;
    }

    @PutMapping("/{id}/approve")
    public String approveService(@RequestBody @NonNull Service service, @PathVariable @NonNull Integer id) {
        String result = serviceService.approveService(service, id);
        return result;
    }

    @PutMapping("/{id}/reject")
    public String rejectService(@RequestBody @NonNull Service service, @PathVariable @NonNull Integer id) {
        String result = serviceService.rejectService(service, id);
        return result;
    }

    @PutMapping("/{id}/cancel")
    public String cancelService(@PathVariable @NonNull Integer id) {
        String result = serviceService.cancelService(id);
        return result;
    }

    @PutMapping("/{id}/reapply")
    public String reapplyService(@PathVariable @NonNull Integer id) {
        String result = serviceService.reapplyService(id);
        return result;
    }

}
