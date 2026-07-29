package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.OfficerService;
import com.example.demo.entity.DocumentOfficer;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/officers")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @GetMapping
    public List<DocumentOfficer> getAllOfficer() {
        return officerService.getAllOfficer();
    }

    @GetMapping("/{id}")
    public DocumentOfficer getOfficerById(@PathVariable @NonNull Integer id) {
        return officerService.getOfficerById(id);
    }

    @PostMapping
    public String createOfficer(@RequestBody @NonNull DocumentOfficer officer) {
        String result = officerService.createOfficer(officer);
        return result;
    }

    @PutMapping("/{id}")
    public String updateOfficer(@RequestBody @NonNull DocumentOfficer officer, @PathVariable @NonNull Integer id) {
        String result = officerService.updateOfficer(officer, id);
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteOfficer(@PathVariable @NonNull Integer id) {
        String result = officerService.deleteOfficer(id);
        return result;
    }

}
