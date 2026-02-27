package com.bikerental.core.application.dto;

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
public class BikeResponseDTO {
    private Long id;
    private String name;
    private String type;
    private StatusResponseDTO status;
    private double pricePerHour;
    private String imageUrl;
    private String description;
    private String location;
    private CategoryResponseDTO category;
}
