package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.Bike;
import java.util.List;
import java.util.Optional;

public interface BikeRepository {
    List<Bike> findAll();

    Optional<Bike> findById(Long id);

    Bike save(Bike bike);

    void deleteById(Long id);
}
