package com.bikerental.backend.modules.bike;

import com.bikerental.backend.domain.bike.BikeType;
import com.bikerental.backend.domain.bike.BikeStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateBikeRequest(
    @NotBlank @Size(max = 200) String name,
    @NotNull BikeType type,
    @NotNull @DecimalMin("0.0") BigDecimal pricePerHour,
    @NotNull @DecimalMin("0.0") BigDecimal pricePerKm,
    BikeStatus status,
    @Size(max = 200) String currentZone,
    @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal currentLat,
    @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal currentLng,
    String imageUrl,
    String description
) {
}
