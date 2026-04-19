package com.bikerental.backend.modules.auth;

import com.bikerental.backend.domain.user.User;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class AuthTokenStore {

    private static final Duration SESSION_TTL = Duration.ofHours(24);

    private final ConcurrentMap<String, AuthSession> sessions = new ConcurrentHashMap<>();

    public String issueToken(User user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        AuthSession session = new AuthSession(
            user.getId(),
            user.getUsername(),
            user.getRole(),
            Instant.now().plus(SESSION_TTL)
        );
        sessions.put(token, session);
        return token;
    }

    public Optional<AuthSession> resolve(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        AuthSession session = sessions.get(token);
        if (session == null) {
            return Optional.empty();
        }

        if (session.expiresAt().isBefore(Instant.now())) {
            sessions.remove(token);
            return Optional.empty();
        }

        return Optional.of(session);
    }
}
