package com.bikerental.backend.modules.payment;

import com.bikerental.backend.domain.payment.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PayRentalRequest(
    @NotNull Long userId,
    @NotNull PaymentMethod method
) {
}
