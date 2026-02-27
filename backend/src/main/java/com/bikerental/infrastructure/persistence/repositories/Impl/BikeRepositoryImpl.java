package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.Bike;
import com.bikerental.core.domain.repositories.BikeRepository;
import com.bikerental.infrastructure.persistence.entities.BikeEntity;
import com.bikerental.infrastructure.persistence.mappers.BikePersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaBikeRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BikeRepositoryImpl implements BikeRepository {
    private final JpaBikeRepository jpaBikeRepository;

    @Override
    public List<Bike> findAll() {
        return jpaBikeRepository.findAll().stream()
                .map(BikePersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Bike> findById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Bike ID cannot be null");
        }
        return jpaBikeRepository.findById(id)
                .map(BikePersistenceMapper::toDomain);
    }

    @Override
    public Bike save(Bike bike) {
        if (bike == null) {
            throw new IllegalArgumentException("Bike cannot be null");
        }
        BikeEntity entity = BikePersistenceMapper.toEntity(bike);
        if (entity == null) {
            throw new IllegalArgumentException("Converted bike entity cannot be null");
        }
        BikeEntity savedEntity = jpaBikeRepository.save(entity);
        return BikePersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Bike ID cannot be null");
        }
        jpaBikeRepository.deleteById(id);
    }
}
