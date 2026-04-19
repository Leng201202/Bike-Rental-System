package com.bikerental.backend.modules.payment;

import com.bikerental.backend.domain.payment.Payment;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record PaymentDto(
    Long id,
    String transactionCode,
    Long userId,
    Long rentalId,
    BigDecimal amount,
    String method,
    String status,
    OffsetDateTime paidAt
) {

    public static PaymentDto from(Payment payment) {
        Long rentalId = payment.getRental() == null ? null : payment.getRental().getId();
        return new PaymentDto(
            payment.getId(),
            payment.getTransactionCode(),
            payment.getUser().getId(),
            rentalId,
            payment.getAmount(),
            payment.getMethod().name(),
            payment.getStatus().name(),
            payment.getPaidAt()
        );
    }
}
