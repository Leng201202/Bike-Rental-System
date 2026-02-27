package com.bikerental.core.domain.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bike {
    private Long id;
    private String name;
    private String type;
    private Status status; // Changed from String to Status
    private double pricePerHour;
    private String imageUrl;
    private String description;
    private String location; // Added
    private Category category; // Added
}
