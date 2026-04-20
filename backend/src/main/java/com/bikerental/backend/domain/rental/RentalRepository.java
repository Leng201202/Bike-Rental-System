package com.bikerental.backend.domain.rental;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Rental r where r.id = :id")
    Optional<Rental> findByIdForUpdate(@Param("id") Long id);

    Optional<Rental> findByBikeIdAndStatusIn(Long bikeId, List<RentalStatus> statuses);

    Optional<Rental> findByUserIdAndStatusIn(Long userId, List<RentalStatus> statuses);

    List<Rental> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Rental> findAllByOrderByCreatedAtDesc();
}
