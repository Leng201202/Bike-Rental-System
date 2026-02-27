package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.AuditLog;
import java.util.List;

public interface AuditRepository {
    List<AuditLog> findAll();

    AuditLog save(AuditLog auditLog);
}
