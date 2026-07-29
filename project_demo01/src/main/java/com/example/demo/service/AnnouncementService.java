package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.entity.Announcement;
import org.springframework.lang.NonNull;
import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncement() {
        return announcementRepository.findAll();
    }

    public Announcement getAnnouncementById(@NonNull Integer id) {
        try {
            return announcementRepository.findById(id).orElse(null);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return null;
        }
    }

    public String createAnnouncement(@NonNull Announcement announcement) {
        try {
            announcementRepository.save(announcement);
            return "Announcement created successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String updateAnnouncement(@NonNull Integer id, @NonNull Announcement announcement) {
        try {
            Announcement existingAnnouncement = announcementRepository.findById(id).orElse(null);
            if (existingAnnouncement == null) {
                return "Announcement not found";
            }
            existingAnnouncement.setAnnouncementTopic(
                announcement.getAnnouncementTopic() != null ? announcement.getAnnouncementTopic() : existingAnnouncement.getAnnouncementTopic()
            );
            existingAnnouncement.setAnnouncementDetail(
                announcement.getAnnouncementDetail() != null ? announcement.getAnnouncementDetail() : existingAnnouncement.getAnnouncementDetail()
            );
            existingAnnouncement.setAnnouncementDate(
                announcement.getAnnouncementDate() != null ? announcement.getAnnouncementDate() : existingAnnouncement.getAnnouncementDate()
            );
            existingAnnouncement.setAnnouncementType(
                announcement.getAnnouncementType() != null ? announcement.getAnnouncementType() : existingAnnouncement.getAnnouncementType()
            );

            announcementRepository.save(existingAnnouncement);
            return "Announcement updated successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

    public String deleteAnnouncement(@NonNull Integer id) {
        try {
            announcementRepository.deleteById(id);
            return "Announcement deleted successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }

}
