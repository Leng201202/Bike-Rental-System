package com.bikerental.infrastructure.web;

import com.bikerental.core.application.dto.BikeResponseDTO;
import com.bikerental.core.application.usecases.Bike.GetAllBikesUseCase;
import com.bikerental.core.application.usecases.Bike.GetBikeByIdUseCase;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bikes")
@RequiredArgsConstructor
public class BikeController {
    private final GetAllBikesUseCase getAllBikesUseCase;
    private final GetBikeByIdUseCase getBikeByIdUseCase;

    @GetMapping
    public List<BikeResponseDTO> getAllBikes() {
        return getAllBikesUseCase.execute();
    }

    @GetMapping("/{id}")
    public BikeResponseDTO getBikeById(@PathVariable Long id) {
        return getBikeByIdUseCase.execute(id);
    }
}
