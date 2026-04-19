package com.bikerental.backend.modules.auth;

import com.bikerental.backend.domain.user.UserRole;

import java.time.Instant;

public record AuthSession(
    Long userId,
    String username,
    UserRole role,
    Instant expiresAt
) {
}
