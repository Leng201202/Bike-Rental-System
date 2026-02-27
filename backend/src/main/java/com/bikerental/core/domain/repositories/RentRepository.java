package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.Rent;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RentRepository {
    List<Rent> findAll();

    Optional<Rent> findById(UUID id);

    Rent save(Rent rent);

    void deleteById(UUID id);
}
