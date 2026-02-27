package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.BikeResponseDTO;
import com.bikerental.core.domain.entities.Bike;

public class BikeMapper {
    public static BikeResponseDTO toResponseDTO(Bike bike) {
        if (bike == null)
            return null;
        return BikeResponseDTO.builder()
                .id(bike.getId())
                .name(bike.getName())
                .type(bike.getType())
                .status(StatusMapper.toResponseDTO(bike.getStatus()))
                .pricePerHour(bike.getPricePerHour())
                .imageUrl(bike.getImageUrl())
                .description(bike.getDescription())
                .location(bike.getLocation())
                .category(CategoryMapper.toResponseDTO(bike.getCategory()))
                .build();
    }
}
