package com.bikerental.backend.modules.payment;

import java.math.BigDecimal;

public record UserBalanceDto(
    Long userId,
    BigDecimal outstandingBalance
) {
}
