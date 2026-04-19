package com.bikerental.backend.modules.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface AuthSessionRepository extends JpaRepository<AuthSessionEntity, String> {
    void deleteByExpiresAtBefore(Instant threshold);
}