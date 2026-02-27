package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.Status;
import com.bikerental.infrastructure.persistence.entities.StatusEntity;

public class StatusPersistenceMapper {
    public static Status toDomain(StatusEntity entity) {
        if (entity == null)
            return null;
        return Status.builder()
                .id(entity.getId())
                .name(entity.getName())
                .desp(entity.getDesp())
                .createdAt(entity.getCreatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedAt(entity.getUpdatedAt())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public static StatusEntity toEntity(Status domain) {
        if (domain == null)
            return null;
        return StatusEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .desp(domain.getDesp())
                .createdAt(domain.getCreatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedAt(domain.getUpdatedAt())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }
}
