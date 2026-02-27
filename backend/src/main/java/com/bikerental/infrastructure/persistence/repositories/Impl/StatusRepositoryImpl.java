package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.Status;
import com.bikerental.core.domain.repositories.StatusRepository;
import com.bikerental.infrastructure.persistence.entities.StatusEntity;
import com.bikerental.infrastructure.persistence.mappers.StatusPersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaStatusRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StatusRepositoryImpl implements StatusRepository {
    private final JpaStatusRepository jpaStatusRepository;

    @Override
    public List<Status> findAll() {
        return jpaStatusRepository.findAll().stream()
                .map(StatusPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Status> findById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Status ID cannot be null");
        }
        return jpaStatusRepository.findById(id)
                .map(StatusPersistenceMapper::toDomain);
    }

    @Override
    public Status save(Status status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        StatusEntity entity = StatusPersistenceMapper.toEntity(status);
        if (entity == null) {
            throw new IllegalArgumentException("Converted status entity cannot be null");
        }
        StatusEntity savedEntity = jpaStatusRepository.save(entity);
        return StatusPersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Status ID cannot be null");
        }
        jpaStatusRepository.deleteById(id);
    }
}
