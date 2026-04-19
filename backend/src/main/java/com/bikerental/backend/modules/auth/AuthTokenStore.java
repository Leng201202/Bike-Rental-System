package com.bikerental.backend.modules.auth;

import com.bikerental.backend.domain.user.User;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Component
public class AuthTokenStore {

    private static final Duration SESSION_TTL = Duration.ofHours(24);

    private final AuthSessionRepository authSessionRepository;

    public AuthTokenStore(AuthSessionRepository authSessionRepository) {
        this.authSessionRepository = authSessionRepository;
    }

    @Transactional
    public String issueToken(User user) {
        cleanupExpired();

        String token = UUID.randomUUID().toString().replace("-", "");
        Instant now = Instant.now();

        AuthSessionEntity session = new AuthSessionEntity();
        session.setToken(token);
        session.setUserId(user.getId());
        session.setUsername(user.getUsername());
        session.setRole(user.getRole());
        session.setCreatedAt(now);
        session.setExpiresAt(now.plus(SESSION_TTL));

        authSessionRepository.save(session);
        return token;
    }

    @Transactional
    public Optional<AuthSession> resolve(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        Optional<AuthSessionEntity> stored = authSessionRepository.findById(token);
        if (stored.isEmpty()) {
            return Optional.empty();
        }

        AuthSessionEntity entity = stored.get();
        if (entity.getExpiresAt().isBefore(Instant.now())) {
            authSessionRepository.deleteById(token);
            return Optional.empty();
        }

        return Optional.of(new AuthSession(
            entity.getUserId(),
            entity.getUsername(),
            entity.getRole(),
            entity.getExpiresAt()
        ));
    }

    private void cleanupExpired() {
        authSessionRepository.deleteByExpiresAtBefore(Instant.now());
    }
}
