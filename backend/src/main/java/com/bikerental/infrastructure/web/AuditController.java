package com.bikerental.infrastructure.web;

import com.bikerental.core.application.dto.AuditLogResponseDTO;
import com.bikerental.core.application.usecases.AuditLogs.GetAllAuditLogsUseCase;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {
    private final GetAllAuditLogsUseCase getAllAuditLogsUseCase;

    @GetMapping
    public List<AuditLogResponseDTO> getAllAuditLogs() {
        return getAllAuditLogsUseCase.execute();
    }
}
