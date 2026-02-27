package com.bikerental.core.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;
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
public class RentResponseDTO {
    private UUID id;
    private UserResponseDTO user;
    private BikeResponseDTO bike;
    private LocalDateTime rentAt;
    private LocalDateTime doneAt;
    private boolean isPaid;
    private LocalDateTime payAt;
}
