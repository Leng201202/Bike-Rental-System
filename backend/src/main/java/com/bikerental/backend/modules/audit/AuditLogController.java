package com.bikerental.backend.modules.audit;

import com.bikerental.backend.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ApiResponse<List<AuditLogDto>> listAuditLogs(@RequestParam(defaultValue = "200") int limit) {
        List<AuditLogDto> result = auditLogService.listRecent(limit).stream()
            .map(AuditLogDto::from)
            .toList();
        return ApiResponse.ok(result);
    }
}
