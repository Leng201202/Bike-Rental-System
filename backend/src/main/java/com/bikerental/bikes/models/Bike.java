package com.bikerental.bikes.models;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Bike {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID bike_id;

    private String bike_name;
    private Category category;
    private double price_per_hr;
    private double price_per_km;
    private Status status;
    private String img_url;
    private Location location;
    private String desp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID createdBy;
    private UUID updatedBy;
    
}
