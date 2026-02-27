package com.bikerental.core.application.usecases.AuditLogs;

import com.bikerental.core.application.dto.AuditLogResponseDTO;
import com.bikerental.core.application.mappers.AuditLogMapper;
import com.bikerental.core.domain.repositories.AuditRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetAllAuditLogsUseCase {
    private final AuditRepository auditRepository;

    public List<AuditLogResponseDTO> execute() {
        return auditRepository.findAll().stream()
                .map(AuditLogMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
