package com.bikerental.backend.modules.user;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @Size(max = 100) String username,
    @Size(max = 200) String fullName,
    @Email @Size(max = 200) String email,
    @Size(max = 50) String phoneNumber,
    @JsonProperty("student_id")
    @JsonAlias({"studentId", "campusId"})
    @Size(max = 100) String studentId
) {
}
