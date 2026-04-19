package com.bikerental.backend.modules.rental;

import com.bikerental.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping("/start")
    public ApiResponse<RentalDto> startRental(@Valid @RequestBody StartRentalRequest request) {
        return ApiResponse.ok(RentalDto.from(rentalService.startRental(request)));
    }

    @PostMapping("/{rentalId}/end")
    public ApiResponse<RentalDto> endRental(
        @PathVariable Long rentalId,
        @Valid @RequestBody EndRentalRequest request
    ) {
        return ApiResponse.ok(RentalDto.from(rentalService.endRental(rentalId, request)));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<List<RentalDto>> getUserRentals(@PathVariable Long userId) {
        List<RentalDto> result = rentalService.getUserRentals(userId).stream()
            .map(RentalDto::from)
            .toList();
        return ApiResponse.ok(result);
    }

    @GetMapping
    public ApiResponse<List<RentalDto>> listAllRentals() {
        List<RentalDto> result = rentalService.listAllRentals().stream()
            .map(RentalDto::from)
            .toList();
        return ApiResponse.ok(result);
    }
}
