package com.bikerental.backend.modules.bike;

import com.bikerental.backend.common.api.ApiResponse;
import com.bikerental.backend.domain.bike.BikeStatus;
import com.bikerental.backend.domain.bike.BikeType;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bikes")
public class BikeController {

    private final BikeService bikeService;

    public BikeController(BikeService bikeService) {
        this.bikeService = bikeService;
    }

    @PostMapping
    public ApiResponse<BikeDto> createBike(@Valid @RequestBody CreateBikeRequest request) {
        return ApiResponse.ok(BikeDto.from(bikeService.createBike(request)));
    }

    @PutMapping("/{bikeId}")
    public ApiResponse<BikeDto> updateBike(
        @PathVariable Long bikeId,
        @Valid @RequestBody CreateBikeRequest request
    ) {
        return ApiResponse.ok(BikeDto.from(bikeService.updateBike(bikeId, request)));
    }

    @DeleteMapping("/{bikeId}")
    public ApiResponse<Void> deleteBike(@PathVariable Long bikeId) {
        bikeService.deleteBike(bikeId);
        return ApiResponse.ok(null);
    }

    @GetMapping
    public ApiResponse<List<BikeDto>> listBikes(
        @RequestParam(required = false) BikeStatus status,
        @RequestParam(required = false) BikeType type
    ) {
        List<BikeDto> result = bikeService.listBikes(status, type).stream()
            .map(BikeDto::from)
            .toList();
        return ApiResponse.ok(result);
    }

    @PatchMapping("/{bikeId}/maintenance")
    public ApiResponse<BikeDto> markMaintenance(@PathVariable Long bikeId) {
        return ApiResponse.ok(BikeDto.from(bikeService.markMaintenance(bikeId)));
    }
}
