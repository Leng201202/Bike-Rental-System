package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.Bike;
import com.bikerental.infrastructure.persistence.entities.BikeEntity;

public class BikePersistenceMapper {
    public static Bike toDomain(BikeEntity entity) {
        if (entity == null)
            return null;
        return Bike.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .status(StatusPersistenceMapper.toDomain(entity.getStatus()))
                .pricePerHour(entity.getPricePerHour())
                .imageUrl(entity.getImageUrl())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .category(CategoryPersistenceMapper.toDomain(entity.getCategory()))
                .build();
    }

    public static BikeEntity toEntity(Bike domain) {
        if (domain == null)
            return null;
        return BikeEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .type(domain.getType())
                .status(StatusPersistenceMapper.toEntity(domain.getStatus()))
                .pricePerHour(domain.getPricePerHour())
                .imageUrl(domain.getImageUrl())
                .description(domain.getDescription())
                .location(domain.getLocation())
                .category(CategoryPersistenceMapper.toEntity(domain.getCategory()))
                .build();
    }
}
