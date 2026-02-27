package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.AuditLogResponseDTO;
import com.bikerental.core.domain.entities.AuditLog;

public class AuditLogMapper {
    public static AuditLogResponseDTO toResponseDTO(AuditLog auditLog) {
        if (auditLog == null)
            return null;
        return AuditLogResponseDTO.builder()
                .id(auditLog.getId())
                .actor(auditLog.getActor())
                .action(auditLog.getAction())
                .details(auditLog.getDetails())
                .timestamp(auditLog.getTimestamp())
                .build();
    }
}
