package com.bikerental.rent.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class RentType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID rent_type_id;
    private String name;
    private String desp;
    private double cost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
}
