package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.UserResponseDTO;
import com.bikerental.core.domain.entities.User;

public class UserMapper {
    public static UserResponseDTO toResponseDTO(User user) {
        if (user == null)
            return null;
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .studentId(user.getStudentId())
                .email(user.getEmail())
                .role(user.getRole())
                .debt(user.getDebt())
                .isAgreePermission(user.isAgreePermission())
                .isAgreeLocationPermission(user.isAgreeLocationPermission())
                .build();
    }
}
