package com.bikerental.backend.modules.rental;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.List;

public record EndRentalRequest(
    @NotNull @DecimalMin("0.0") BigDecimal distanceKm,
    @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal endLat,
    @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal endLng,
    @Valid List<GpsPointRequest> routePoints
) {

    public record GpsPointRequest(
        @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal lat,
        @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal lng
    ) {
    }
}
