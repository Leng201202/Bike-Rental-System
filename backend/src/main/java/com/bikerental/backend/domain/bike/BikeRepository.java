package com.bikerental.backend.domain.bike;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BikeRepository extends JpaRepository<Bike, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Bike b where b.id = :id")
    Optional<Bike> findByIdForUpdate(@Param("id") Long id);

    List<Bike> findByStatus(BikeStatus status);

    List<Bike> findByType(BikeType type);

    List<Bike> findByStatusAndType(BikeStatus status, BikeType type);
}
