package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.Status;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StatusRepository {
    List<Status> findAll();

    Optional<Status> findById(UUID id);

    Status save(Status status);

    void deleteById(UUID id);
}
