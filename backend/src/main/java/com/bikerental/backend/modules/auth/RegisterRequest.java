package com.bikerental.backend.modules.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @Size(max = 100) String username,
    @NotBlank @Size(max = 200) String fullName,
    @NotBlank @Email @Size(max = 200) String email,
    @NotBlank @Size(max = 50) String phoneNumber,
    @JsonProperty("student_id")
    @JsonAlias({"studentId", "campusId"})
    @NotBlank @Size(max = 100) String studentId,
    @NotBlank @Size(min = 6, max = 120) String password
) {
}
