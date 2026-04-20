package com.bikerental.backend.modules.rental;

import jakarta.validation.constraints.NotBlank;

public record ActivateReservationRequest(
    @NotBlank String bikeCode
) {
}
