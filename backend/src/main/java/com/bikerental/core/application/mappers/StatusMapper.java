package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.StatusResponseDTO;
import com.bikerental.core.domain.entities.Status;

public class StatusMapper {
    public static StatusResponseDTO toResponseDTO(Status status) {
        if (status == null)
            return null;
        return StatusResponseDTO.builder()
                .id(status.getId())
                .name(status.getName())
                .desp(status.getDesp())
                .createdAt(status.getCreatedAt())
                .createdBy(status.getCreatedBy())
                .updatedAt(status.getUpdatedAt())
                .updatedBy(status.getUpdatedBy())
                .build();
    }
}
