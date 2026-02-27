package com.bikerental.core.application.usecases.Bike;

import com.bikerental.core.application.dto.BikeResponseDTO;
import com.bikerental.core.application.mappers.BikeMapper;
import com.bikerental.core.domain.repositories.BikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBikeByIdUseCase {
    private final BikeRepository bikeRepository;

    public BikeResponseDTO execute(Long id) {
        return bikeRepository.findById(id)
                .map(BikeMapper::toResponseDTO)
                .orElse(null);
    }
}
