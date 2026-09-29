package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.DocumentOfficer;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface OfficerRepository extends JpaRepository<DocumentOfficer, Integer> {

    @Query("SELECT o FROM DocumentOfficer o WHERE o.citizenId = :citizenId")
    DocumentOfficer findByCitizenId(String citizenId);

}
