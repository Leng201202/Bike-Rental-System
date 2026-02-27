package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.AuditLog;
import com.bikerental.infrastructure.persistence.entities.AuditLogEntity;

public class AuditPersistenceMapper {
    public static AuditLog toDomain(AuditLogEntity entity) {
        if (entity == null)
            return null;
        return AuditLog.builder()
                .id(entity.getId())
                .actor(entity.getActor())
                .action(entity.getAction())
                .details(entity.getDetails())
                .timestamp(entity.getTimestamp())
                .build();
    }

    public static AuditLogEntity toEntity(AuditLog domain) {
        if (domain == null)
            return null;
        return AuditLogEntity.builder()
                .id(domain.getId())
                .actor(domain.getActor())
                .action(domain.getAction())
                .details(domain.getDetails())
                .timestamp(domain.getTimestamp())
                .build();
    }
}
