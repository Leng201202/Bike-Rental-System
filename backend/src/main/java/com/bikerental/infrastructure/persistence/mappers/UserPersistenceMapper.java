package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.User;
import com.bikerental.infrastructure.persistence.entities.UserEntity;

public class UserPersistenceMapper {
    public static User toDomain(UserEntity entity) {
        if (entity == null)
            return null;
        return User.builder()
                .id(entity.getId())
                .name(entity.getName())
                .studentId(entity.getStudentId())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .isAgreePermission(entity.isAgreePermission())
                .isAgreeLocationPermission(entity.isAgreeLocationPermission())
                .debt(entity.getDebt())
                .phone(entity.getPhone())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public static UserEntity toEntity(User domain) {
        if (domain == null)
            return null;
        return UserEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .studentId(domain.getStudentId())
                .email(domain.getEmail())
                .password(domain.getPassword())
                .role(domain.getRole())
                .isAgreePermission(domain.isAgreePermission())
                .isAgreeLocationPermission(domain.isAgreeLocationPermission())
                .debt(domain.getDebt())
                .phone(domain.getPhone())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }
}
