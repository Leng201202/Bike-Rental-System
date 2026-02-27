package com.bikerental.core.application.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private UUID id;
    private String name;
    private String studentId;
    private String email;
    private String role;
    private double debt;
    private boolean isAgreePermission;
    private boolean isAgreeLocationPermission;
}
