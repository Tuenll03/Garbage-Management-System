package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private int adminId;

    @Column(name = "prefix", nullable = false, length = 6)
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

    @OneToMany
    @JoinColumn(name = "admin_id")
    private List<DocumentOfficer> documentOfficers;

    public Admin() {
    }

    public Admin(int adminId, String prefix, String firstName, String lastName,
            String password, String position, String citizenId) {
        this.adminId = adminId;
        this.prefix = prefix;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.position = position;
        this.citizenId = citizenId;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
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

}