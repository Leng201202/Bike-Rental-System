package com.bikerental.backend.modules.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.bikerental.backend.domain.user.User;

public record UserDto(
    Long id,
    String username,
    String fullName,
    String email,
    String phoneNumber,
    @JsonProperty("student_id") String studentId,
    String role,
    @JsonProperty("is_active") boolean active
) {

    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getEmail(),
            user.getPhoneNumber(),
            user.getStudentId(),
            user.getRole().name(),
            user.isActive()
        );
    }
}
