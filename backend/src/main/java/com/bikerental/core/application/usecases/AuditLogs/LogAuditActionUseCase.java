package com.bikerental.core.application.usecases.AuditLogs;

import com.bikerental.core.domain.entities.AuditAction;
import com.bikerental.core.domain.entities.AuditLog;
import com.bikerental.core.domain.repositories.AuditRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogAuditActionUseCase {
    private final AuditRepository auditRepository;

    public void execute(String actor, AuditAction action, String details) {
        AuditLog auditLog = AuditLog.builder()
                .actor(actor)
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        auditRepository.save(auditLog);
    }
}
