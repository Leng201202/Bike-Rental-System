package com.bikerental.infrastructure.persistence.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bikes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private StatusEntity status;

    private double pricePerHour;
    private String imageUrl;
    private String description;

    private String location;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryEntity category;
}
