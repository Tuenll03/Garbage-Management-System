package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "service")
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private int serviceId;

    @Column(name = "service_type")
    private String serviceType;

    @Column(name = "building_type", length = 50)
    private String buildingType;

    @Column(name = "garbage_weight", length = 50)
    private int garbageWeight;

    @Column(name = "price")
    private int price;

    @Column(name = "request_date")
    private LocalDate requestDate;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "location_house_number", length = 10)
    private String houseNumber;

    @Column(name = "location_village_no", length = 10)
    private String villageNo;

    @Column(name = "location_village_name", length = 50)
    private String villageName;

    @Column(name = "additional_detail")
    private String detail;

    @ManyToOne
    @JoinColumn(name = "member_id")
    @JsonIgnoreProperties("service")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    @JsonIgnoreProperties("service")
    private DocumentOfficer officer;

    public Service() {
    }

    public Service(int serviceId, String serviceType, String buildingType, int garbageWeight, int price,
            LocalDate requestDate, String status, LocalDate startDate, LocalDate endDate, String houseNumber,
            String villageNo, String villageName, String detail, Member member, DocumentOfficer officer) {
        super();
        this.serviceId = serviceId;
        this.serviceType = serviceType;
        this.buildingType = buildingType;
        this.garbageWeight = garbageWeight;
        this.price = price;
        this.requestDate = requestDate;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.houseNumber = houseNumber;
        this.villageNo = villageNo;
        this.villageName = villageName;
        this.detail = detail;
        this.member = member;
        this.officer = officer;
    }

    public int getServiceId() {
        return serviceId;
    }

    public void setServiceId(int serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(String buildingType) {
        this.buildingType = buildingType;
    }

    public int getGarbageWeight() {
        return garbageWeight;
    }

    public void setGarbageWeight(int garbageWeight) {
        this.garbageWeight = garbageWeight;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getVillageNo() {
        return villageNo;
    }

    public void setVillageNo(String villageNo) {
        this.villageNo = villageNo;
    }

    public String getVillageName() {
        return villageName;
    }

    public void setVillageName(String villageName) {
        this.villageName = villageName;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public DocumentOfficer getOfficer() {
        return officer;
    }

    public void setOfficer(DocumentOfficer officer) {
        this.officer = officer;
    }

}
