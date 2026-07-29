package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "document_officer")
public class DocumentOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "officer_id")
    private int officerId;

    @Column(name = "prefix", length = 6)
    private String prefix;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "password", nullable = false, length = 8)
    private String password;

    @Column(name = "position", length = 50)
    private String position;

    @Column(name = "citizen_id", unique = true, length = 13)
    private String citizenId;

    @Column(name = "status", length = 50)
    private String status;

    @OneToMany(mappedBy = "officer")
    @JsonIgnoreProperties("officer")
    private List<Service> service;

    public DocumentOfficer() {
    }

    public DocumentOfficer(int officerId, String prefix, String firstName,
            String lastName, String password, String position,
            String citizenId, String status, List<Service> service) {
        this.officerId = officerId;
        this.prefix = prefix;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.position = position;
        this.citizenId = citizenId;
        this.status = status;
        this.service = service;
    }

    public int getOfficerId() {
        return officerId;
    }

    public void setOfficerId(int officerId) {
        this.officerId = officerId;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Service> getService() {
        return service;
    }

    public void setService(List<Service> service) {
        this.service = service;
    }

}
