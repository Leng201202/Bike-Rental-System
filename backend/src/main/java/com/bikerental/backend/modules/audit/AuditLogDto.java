package com.bikerental.backend.modules.audit;

import com.bikerental.backend.domain.audit.AuditLog;

import java.time.OffsetDateTime;

public record AuditLogDto(
    Long id,
    Long actorUserId,
    String actorUsername,
    String action,
    String targetType,
    String targetId,
    String detail,
    OffsetDateTime createdAt
) {

    public static AuditLogDto from(AuditLog log) {
        Long actorUserId = log.getActorUser() == null ? null : log.getActorUser().getId();
        String actorUsername = log.getActorUser() == null ? "system" : log.getActorUser().getUsername();

        return new AuditLogDto(
            log.getId(),
            actorUserId,
            actorUsername,
            log.getAction(),
            log.getTargetType(),
            log.getTargetId(),
            log.getDetail(),
            log.getCreatedAt()
        );
    }
}
