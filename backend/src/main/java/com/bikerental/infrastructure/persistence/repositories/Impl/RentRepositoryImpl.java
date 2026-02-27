package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.Rent;
import com.bikerental.core.domain.repositories.RentRepository;
import com.bikerental.infrastructure.persistence.entities.RentEntity;
import com.bikerental.infrastructure.persistence.mappers.RentPersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaRentRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RentRepositoryImpl implements RentRepository {
    private final JpaRentRepository jpaRentRepository;

    @Override
    public List<Rent> findAll() {
        return jpaRentRepository.findAll().stream()
                .map(RentPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Rent> findById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Rent ID cannot be null");
        }
        return jpaRentRepository.findById(id)
                .map(RentPersistenceMapper::toDomain);
    }

    @Override
    public Rent save(Rent rent) {
        if (rent == null) {
            throw new IllegalArgumentException("Rent cannot be null");
        }
        RentEntity entity = RentPersistenceMapper.toEntity(rent);
        if (entity == null) {
            throw new IllegalArgumentException("Converted rent entity cannot be null");
        }
        RentEntity savedEntity = jpaRentRepository.save(entity);
        return RentPersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Rent ID cannot be null");
        }
        jpaRentRepository.deleteById(id);
    }
}
// Note: Renamed from UserRepositoryImpl to RentRepositoryImpl in my thought but
// tool call says RentRepositoryImpl below
