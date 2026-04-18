package com.bikerental.backend.modules.rental;

import com.bikerental.backend.domain.rental.RentalMethod;
import com.bikerental.backend.domain.rental.RentalType;
import jakarta.validation.constraints.NotNull;

public record StartRentalRequest(
    @NotNull Long userId,
    @NotNull Long bikeId,
    @NotNull RentalMethod method,
    @NotNull RentalType rentalType
) {
}
