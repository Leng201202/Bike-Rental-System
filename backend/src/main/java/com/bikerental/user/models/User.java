package com.bikerental.user.models;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDateTime;


@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String name;
    private String std_id;
    private String email;
    private String password;
    private String role;
    private boolean isAgreePermission;
    private boolean isAgreeLocationPermission;
    private double debt;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    private List<String> history; //String need to be Rent entity
    
}
