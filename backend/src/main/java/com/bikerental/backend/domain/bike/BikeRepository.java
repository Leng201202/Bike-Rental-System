package com.bikerental.backend.domain.bike;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BikeRepository extends JpaRepository<Bike, Long> {

    List<Bike> findByStatus(BikeStatus status);

    List<Bike> findByType(BikeType type);

    List<Bike> findByStatusAndType(BikeStatus status, BikeType type);
}
