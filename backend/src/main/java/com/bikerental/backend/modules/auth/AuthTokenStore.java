package com.bikerental.backend.modules.auth;

import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Component
public class AuthTokenStore {

    private final Duration sessionTtl;
    private final SecretKey signingKey;
    private final JwtParser jwtParser;

    public AuthTokenStore(
        @Value("${app.auth.jwt-secret:change-this-in-production-with-a-long-random-secret}") String jwtSecret,
        @Value("${app.auth.jwt-ttl-hours:24}") long jwtTtlHours
    ) {
        this.sessionTtl = Duration.ofHours(Math.max(1, jwtTtlHours));
        this.signingKey = Keys.hmacShaKeyFor(sha256(jwtSecret));
        this.jwtParser = Jwts.parser().verifyWith(signingKey).build();
    }

    public String issueToken(User user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(sessionTtl);

        return Jwts.builder()
            .subject(user.getUsername())
            .claim("uid", user.getId())
            .claim("role", user.getRole().name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiresAt))
            .signWith(signingKey)
            .compact();
    }

    public Optional<AuthSession> resolve(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        try {
            Claims claims = jwtParser.parseSignedClaims(token).getPayload();
            String username = claims.getSubject();
            String roleValue = claims.get("role", String.class);
            Date expiresAt = claims.getExpiration();

            if (username == null || roleValue == null || expiresAt == null) {
                return Optional.empty();
            }

            UserRole role = UserRole.valueOf(roleValue);
            Long userId = readLongClaim(claims.get("uid"));
            if (userId == null) {
                return Optional.empty();
            }

            return Optional.of(new AuthSession(userId, username, role, expiresAt.toInstant()));
        } catch (IllegalArgumentException | JwtException ex) {
            return Optional.empty();
        }
    }

    private Long readLongClaim(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String str) {
            try {
                return Long.parseLong(str);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private byte[] sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available", e);
        }
    }
}
