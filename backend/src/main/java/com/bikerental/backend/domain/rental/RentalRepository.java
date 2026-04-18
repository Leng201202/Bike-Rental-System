package com.bikerental.backend.domain.rental;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    Optional<Rental> findByBikeIdAndStatusIn(Long bikeId, List<RentalStatus> statuses);

    Optional<Rental> findByUserIdAndStatusIn(Long userId, List<RentalStatus> statuses);

    List<Rental> findByUserIdOrderByCreatedAtDesc(Long userId);
}
