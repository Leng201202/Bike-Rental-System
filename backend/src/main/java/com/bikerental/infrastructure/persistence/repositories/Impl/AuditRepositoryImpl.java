package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.AuditLog;
import com.bikerental.core.domain.repositories.AuditRepository;
import com.bikerental.infrastructure.persistence.entities.AuditLogEntity;
import com.bikerental.infrastructure.persistence.mappers.AuditPersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaAuditLogRepository;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditRepositoryImpl implements AuditRepository {
    private final JpaAuditLogRepository jpaAuditLogRepository;

    @Override
    public List<AuditLog> findAll() {
        return jpaAuditLogRepository.findAll().stream()
                .map(AuditPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public AuditLog save(AuditLog auditLog) {
        if (auditLog == null) {
            throw new IllegalArgumentException("Audit log cannot be null");
        }
        AuditLogEntity entity = AuditPersistenceMapper.toEntity(auditLog);
        if (entity == null) {
            throw new IllegalArgumentException("Converted audit log entity cannot be null");
        }
        AuditLogEntity savedEntity = jpaAuditLogRepository.save(entity);
        return AuditPersistenceMapper.toDomain(savedEntity);
    }

}
