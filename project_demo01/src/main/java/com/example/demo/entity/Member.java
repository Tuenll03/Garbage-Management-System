package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private int memberId;

    @Column(name = "password", nullable = false, length = 8)
    private String password;

    @Column(name = "citizen_id", unique = true, length = 13)
    private String citizenId;

    @Column(name = "prefix", length = 6)
    private String prefix;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(name = "birth_date")
    private LocalDate birth;

    @Column(name = "registered_house_number", length = 10)
    private String registeredHouseNumber;

    @Column(name = "registered_village_no", length = 10)
    private String registeredVillageNo;

    @Column(name = "registered_subdistrict", length = 50)
    private String registeredSubdistrict;

    @Column(name = "registered_district", length = 50)
    private String registeredDistrict;

    @Column(name = "registered_province", length = 50)
    private String registeredProvince;

    @Column(name = "registered_postal_code", length = 5)
    private String registeredPostalCode;

    @Column(name = "phoneNumber", length = 10)
    private String phone;

    @OneToMany(mappedBy = "member")
    @JsonIgnoreProperties("member")
    private List<Service> service;

    public Member() {
    }

    public Member(int memberId, String password, String citizenId, String prefix, String firstName, String lastName,
            LocalDate birth, String registeredHouseNumber, String registeredVillageNo, String registeredSubdistrict,
            String registeredDistrict, String registeredProvince, String registeredPostalCode, String phone) {
        super();
        this.memberId = memberId;
        this.password = password;
        this.citizenId = citizenId;
        this.prefix = prefix;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birth = birth;
        this.registeredHouseNumber = registeredHouseNumber;
        this.registeredVillageNo = registeredVillageNo;
        this.registeredSubdistrict = registeredSubdistrict;
        this.registeredDistrict = registeredDistrict;
        this.registeredProvince = registeredProvince;
        this.registeredPostalCode = registeredPostalCode;
        this.phone = phone;
    }

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
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

    public LocalDate getBirth() {
        return birth;
    }

    public void setBirth(LocalDate birth) {
        this.birth = birth;
    }

    public String getRegisteredHouseNumber() {
        return registeredHouseNumber;
    }

    public void setRegisteredHouseNumber(String registeredHouseNumber) {
        this.registeredHouseNumber = registeredHouseNumber;
    }

    public String getRegisteredVillageNo() {
        return registeredVillageNo;
    }

    public void setRegisteredVillageNo(String registeredVillageNo) {
        this.registeredVillageNo = registeredVillageNo;
    }

    public String getRegisteredSubdistrict() {
        return registeredSubdistrict;
    }

    public void setRegisteredSubdistrict(String registeredSubdistrict) {
        this.registeredSubdistrict = registeredSubdistrict;
    }

    public String getRegisteredDistrict() {
        return registeredDistrict;
    }

    public void setRegisteredDistrict(String registeredDistrict) {
        this.registeredDistrict = registeredDistrict;
    }

    public String getRegisteredProvince() {
        return registeredProvince;
    }

    public void setRegisteredProvince(String registeredProvince) {
        this.registeredProvince = registeredProvince;
    }

    public String getRegisteredPostalCode() {
        return registeredPostalCode;
    }

    public void setRegisteredPostalCode(String registeredPostalCode) {
        this.registeredPostalCode = registeredPostalCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<Service> getService() {
        return service;
    }

    public void setService(List<Service> service) {
        this.service = service;
    }

}
