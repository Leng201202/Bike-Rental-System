package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.Rent;
import com.bikerental.infrastructure.persistence.entities.RentEntity;

public class RentPersistenceMapper {
    public static Rent toDomain(RentEntity entity) {
        if (entity == null)
            return null;
        return Rent.builder()
                .id(entity.getId())
                .user(UserPersistenceMapper.toDomain(entity.getUser()))
                .bike(BikePersistenceMapper.toDomain(entity.getBike()))
                .rentAt(entity.getRentAt())
                .doneAt(entity.getDoneAt())
                .isPaid(entity.isPaid())
                .payAt(entity.getPayAt())
                .build();
    }

    public static RentEntity toEntity(Rent domain) {
        if (domain == null)
            return null;
        return RentEntity.builder()
                .id(domain.getId())
                .user(UserPersistenceMapper.toEntity(domain.getUser()))
                .bike(BikePersistenceMapper.toEntity(domain.getBike()))
                .rentAt(domain.getRentAt())
                .doneAt(domain.getDoneAt())
                .isPaid(domain.isPaid())
                .payAt(domain.getPayAt())
                .build();
    }
}
