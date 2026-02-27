package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.RentResponseDTO;
import com.bikerental.core.domain.entities.Rent;

public class RentMapper {
    public static RentResponseDTO toResponseDTO(Rent rent) {
        if (rent == null)
            return null;
        return RentResponseDTO.builder()
                .id(rent.getId())
                .user(UserMapper.toResponseDTO(rent.getUser()))
                .bike(BikeMapper.toResponseDTO(rent.getBike()))
                .rentAt(rent.getRentAt())
                .doneAt(rent.getDoneAt())
                .isPaid(rent.isPaid())
                .payAt(rent.getPayAt())
                .build();
    }
}
