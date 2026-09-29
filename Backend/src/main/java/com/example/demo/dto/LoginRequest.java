package com.example.demo.dto;

public class LoginRequest {
    private String citizenId;
    private String password;

    // Constructors
    public LoginRequest() {
    }

    public LoginRequest(String citizenId, String password) {
        this.citizenId = citizenId;
        this.password = password;
    }

    // Getters and Setters
    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
