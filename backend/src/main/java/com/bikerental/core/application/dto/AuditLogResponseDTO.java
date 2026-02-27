package com.bikerental.core.application.dto;

import com.bikerental.core.domain.entities.AuditAction;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponseDTO {
    private Long id;
    private String actor;
    private AuditAction action;
    private String details;
    private LocalDateTime timestamp;
}
