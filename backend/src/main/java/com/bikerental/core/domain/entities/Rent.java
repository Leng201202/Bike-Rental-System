package com.bikerental.core.domain.entities;

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
public class Rent {
    private UUID id;
    private User user;
    private Bike bike;
    private LocalDateTime rentAt;
    private LocalDateTime doneAt;
    private boolean isPaid;
    private LocalDateTime payAt;
}
