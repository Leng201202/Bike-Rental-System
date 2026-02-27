package com.bikerental.core.application.usecases.Bike;

import com.bikerental.core.application.dto.BikeResponseDTO;
import com.bikerental.core.application.mappers.BikeMapper;
import com.bikerental.core.application.usecases.AuditLogs.LogAuditActionUseCase;
import com.bikerental.core.domain.repositories.BikeRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.bikerental.core.domain.entities.AuditAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetAllBikesUseCase {
    private final BikeRepository bikeRepository;
    private final LogAuditActionUseCase logAuditActionUseCase;

    public List<BikeResponseDTO> execute() {
        logAuditActionUseCase.execute("SYSTEM", AuditAction.FETCH_BIKES, "Fetching all bikes");
        return bikeRepository.findAll().stream()
                .map(BikeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
