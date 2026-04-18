package com.bikerental.backend.modules.user;

import com.bikerental.backend.domain.user.User;
import com.bikerental.backend.domain.user.UserRepository;
import com.bikerental.backend.domain.user.UserRole;
import com.bikerental.backend.common.exception.DomainException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createRider(CreateUserRequest request) {
        String resolvedEmail = normalizeEmail(request.email());
        String resolvedFullName = normalizeFullName(request.fullName(), resolvedEmail);
        String resolvedUsername = resolveUsername(request.username(), resolvedEmail, resolvedFullName);

        User user = new User();
        user.setUsername(resolvedUsername);
        user.setFullName(resolvedFullName);
        user.setEmail(resolvedEmail);
        user.setPhoneNumber(request.phoneNumber());
        user.setStudentId(request.studentId());
        user.setRole(UserRole.RIDER);
        user.setActive(true);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
            .orElseThrow(() -> new DomainException("USER_NOT_FOUND", "User not found: " + username));
    }

    @Transactional
    public User getOrCreateRider(CreateUserRequest request) {
        String studentId = normalizeStudentId(request.studentId());
        if (studentId != null) {
            return userRepository.findByStudentId(studentId)
                .orElseGet(() -> createRider(request));
        }

        String normalizedEmail = normalizeEmail(request.email());

        if (normalizedEmail != null) {
            return userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> createRider(request));
        }

        String username = request.username();
        if (username != null && !username.isBlank()) {
            return userRepository.findByUsernameIgnoreCase(username)
                .orElseGet(() -> createRider(request));
        }

        return createRider(request);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeStudentId(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            return null;
        }
        return studentId.trim();
    }

    private String normalizeFullName(String fullName, String email) {
        if (fullName != null && !fullName.isBlank()) {
            return fullName.trim();
        }
        if (email != null && email.contains("@")) {
            return email.substring(0, email.indexOf('@'));
        }
        return "Rider";
    }

    private String resolveUsername(String requestedUsername, String email, String fullName) {
        String candidate = requestedUsername;
        if (candidate == null || candidate.isBlank()) {
            candidate = deriveBaseUsername(email, fullName);
        }

        candidate = sanitizeUsername(candidate);
        if (candidate.isBlank()) {
            candidate = "rider";
        }

        String unique = candidate;
        int suffix = 1;
        while (userRepository.existsByUsernameIgnoreCase(unique)) {
            unique = candidate + suffix;
            suffix++;
        }
        return unique;
    }

    private String deriveBaseUsername(String email, String fullName) {
        if (email != null && email.contains("@")) {
            return email.substring(0, email.indexOf('@'));
        }
        if (fullName != null && !fullName.isBlank()) {
            return fullName;
        }
        return "rider";
    }

    private String sanitizeUsername(String value) {
        return value.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9._-]", "");
    }
}
