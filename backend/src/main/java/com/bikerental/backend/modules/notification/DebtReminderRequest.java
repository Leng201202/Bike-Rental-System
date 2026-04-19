package com.bikerental.backend.modules.notification;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DebtReminderRequest(
    @NotNull Long userId,
    @Size(max = 500) String message
) {
}
