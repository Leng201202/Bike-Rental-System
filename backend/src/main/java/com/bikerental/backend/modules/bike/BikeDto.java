package com.bikerental.backend.modules.bike;

import com.bikerental.backend.domain.bike.Bike;

import java.math.BigDecimal;

public record BikeDto(
    Long id,
    String name,
    String type,
    String status,
    BigDecimal pricePerHour,
    BigDecimal pricePerKm,
    String currentZone,
    BigDecimal currentLat,
    BigDecimal currentLng,
    String imageUrl,
    String description
) {

    public static BikeDto from(Bike bike) {
        return new BikeDto(
            bike.getId(),
            bike.getName(),
            bike.getType().name(),
            bike.getStatus().name(),
            bike.getPricePerHour(),
            bike.getPricePerKm(),
            bike.getCurrentZone(),
            bike.getCurrentLat(),
            bike.getCurrentLng(),
            bike.getImageUrl(),
            bike.getDescription()
        );
    }
}
