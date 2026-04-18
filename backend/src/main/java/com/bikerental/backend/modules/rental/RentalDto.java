package com.bikerental.backend.modules.rental;

import com.bikerental.backend.domain.rental.Rental;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record RentalDto(
    Long id,
    Long userId,
    Long bikeId,
    String method,
    String status,
    String rentalType,
    OffsetDateTime startedAt,
    OffsetDateTime endedAt,
    Integer durationSeconds,
    BigDecimal distanceKm,
    BigDecimal totalCost
) {

    public static RentalDto from(Rental rental) {
        return new RentalDto(
            rental.getId(),
            rental.getUser().getId(),
            rental.getBike().getId(),
            rental.getMethod().name(),
            rental.getStatus().name(),
            rental.getRentalType().name(),
            rental.getStartedAt(),
            rental.getEndedAt(),
            rental.getDurationSeconds(),
            rental.getDistanceKm(),
            rental.getTotalCost()
        );
    }
}
