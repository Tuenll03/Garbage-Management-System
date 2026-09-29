package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.demo.entity.Announcement;
import com.example.demo.service.AnnouncementService;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public List<Announcement> listAnnouncement() {
        return announcementService.listAnnouncement();
    }

    @GetMapping("/{id}")
    public Announcement getAnnouncement(@PathVariable @NonNull Integer id) {
        return announcementService.getAnnouncement(id);
    }

    @PostMapping
    public String addAnnouncement(@RequestBody @NonNull Announcement announcement) {
        String result = announcementService.addAnnouncement(announcement);
        return result;
    }

    @PutMapping("/{id}")
    public String updateAnnouncement(@PathVariable @NonNull Integer id,
            @RequestBody @NonNull Announcement announcement) {
        String result = announcementService.updateAnnouncement(id, announcement);
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteAnnouncement(@PathVariable @NonNull Integer id) {
        String result = announcementService.deleteAnnouncement(id);
        return result;
    }

}
