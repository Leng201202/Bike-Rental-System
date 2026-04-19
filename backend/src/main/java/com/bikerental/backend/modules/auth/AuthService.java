package com.bikerental.backend.modules.auth;

import com.bikerental.backend.common.exception.DomainException;
import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import com.bikerental.backend.domain.user.UserRole;
import com.bikerental.backend.modules.user.UserDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenStore authTokenStore;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthTokenStore authTokenStore
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authTokenStore = authTokenStore;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = resolveByIdentifier(request.identifier())
            .orElseThrow(() -> new DomainException("AUTH_FAILED", "Invalid credentials"));

        if (!user.isActive()) {
            throw new DomainException("USER_DISABLED", "This account is disabled");
        }

        String passwordHash = user.getPasswordHash();
        if (passwordHash == null || passwordHash.isBlank() || !passwordEncoder.matches(request.password(), passwordHash)) {
            throw new DomainException("AUTH_FAILED", "Invalid credentials");
        }

        String token = authTokenStore.issueToken(user);
        return new AuthResponse(token, UserDto.from(user));
    }

    @Transactional
    public AuthResponse registerRider(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        String normalizedStudentId = normalizeStudentId(request.studentId());
        String normalizedPhone = normalizePhone(request.phoneNumber());

        String resolvedUsername = resolveUsername(request.username(), normalizedEmail, request.fullName());

        if (userRepository.existsByUsernameIgnoreCase(resolvedUsername)) {
            throw new DomainException("USERNAME_EXISTS", "Username is already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DomainException("EMAIL_EXISTS", "Email is already registered");
        }
        if (userRepository.existsByStudentId(normalizedStudentId)) {
            throw new DomainException("STUDENT_ID_EXISTS", "Student ID is already registered");
        }

        User user = new User();
        user.setUsername(resolvedUsername);
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(normalizedPhone);
        user.setStudentId(normalizedStudentId);
        user.setRole(UserRole.RIDER);
        user.setActive(true);
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        User saved = userRepository.save(user);
        String token = authTokenStore.issueToken(saved);
        return new AuthResponse(token, UserDto.from(saved));
    }

    private Optional<User> resolveByIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return Optional.empty();
        }

        String trimmed = identifier.trim();
        Optional<User> byUsername = userRepository.findByUsernameIgnoreCase(trimmed);
        if (byUsername.isPresent()) {
            return byUsername;
        }

        String lower = trimmed.toLowerCase(Locale.ROOT);
        Optional<User> byEmail = userRepository.findByEmailIgnoreCase(lower);
        if (byEmail.isPresent()) {
            return byEmail;
        }

        return userRepository.findByStudentId(trimmed);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeStudentId(String studentId) {
        return studentId.trim();
    }

    private String normalizePhone(String phone) {
        return phone.trim();
    }

    private String resolveUsername(String requestedUsername, String email, String fullName) {
        String candidate = requestedUsername;
        if (candidate == null || candidate.isBlank()) {
            if (email != null && email.contains("@")) {
                candidate = email.substring(0, email.indexOf('@'));
            } else {
                candidate = fullName;
            }
        }

        String sanitized = candidate.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]", "");
        if (sanitized.isBlank()) {
            sanitized = "rider";
        }

        String unique = sanitized;
        int suffix = 1;
        while (userRepository.existsByUsernameIgnoreCase(unique)) {
            unique = sanitized + suffix;
            suffix++;
        }
        return unique;
    }
}
