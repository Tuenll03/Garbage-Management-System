package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.Admin;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    @Query("SELECT a FROM Admin a WHERE a.citizenId = :citizenId")
    Admin findByCitizenId(String citizenId);
}