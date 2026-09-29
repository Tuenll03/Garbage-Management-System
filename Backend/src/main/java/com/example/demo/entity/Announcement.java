package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "announcement")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "announcement_id")
    private int announcementId;

    @Column(name = "announcement_topic", length = 50)
    private String announcementTopic;

    @Column(name = "announcement_detail", length = 255)
    private String announcementDetail;

    @Column(name = "announcement_date")
    private LocalDate announcementDate;

    @Column(name = "announcement_type", length = 50)
    private String announcementType;

    public Announcement() {
    }

    public Announcement(int announcementId, String announcementTopic,
            String announcementDetail, LocalDate announcementDate,
            String announcementType) {

        this.announcementId = announcementId;
        this.announcementTopic = announcementTopic;
        this.announcementDetail = announcementDetail;
        this.announcementDate = announcementDate;
        this.announcementType = announcementType;
    }

    public int getAnnouncementId() {
        return announcementId;
    }

    public void setAnnouncementId(int announcementId) {
        this.announcementId = announcementId;
    }

    public String getAnnouncementTopic() {
        return announcementTopic;
    }

    public void setAnnouncementTopic(String announcementTopic) {
        this.announcementTopic = announcementTopic;
    }

    public String getAnnouncementDetail() {
        return announcementDetail;
    }

    public void setAnnouncementDetail(String announcementDetail) {
        this.announcementDetail = announcementDetail;
    }

    public LocalDate getAnnouncementDate() {
        return announcementDate;
    }

    public void setAnnouncementDate(LocalDate announcementDate) {
        this.announcementDate = announcementDate;
    }

    public String getAnnouncementType() {
        return announcementType;
    }

    public void setAnnouncementType(String announcementType) {
        this.announcementType = announcementType;
    }

}
