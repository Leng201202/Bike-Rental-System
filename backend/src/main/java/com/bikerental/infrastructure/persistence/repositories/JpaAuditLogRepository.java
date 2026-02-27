package com.bikerental.infrastructure.persistence.repositories;

import com.bikerental.infrastructure.persistence.entities.AuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaAuditLogRepository extends JpaRepository<AuditLogEntity, Long> {
}
