package com.bikerental.infrastructure.persistence.mappers;

import com.bikerental.core.domain.entities.Category;
import com.bikerental.infrastructure.persistence.entities.CategoryEntity;

public class CategoryPersistenceMapper {
    public static Category toDomain(CategoryEntity entity) {
        if (entity == null)
            return null;
        return Category.builder()
                .id(entity.getId())
                .name(entity.getName())
                .desp(entity.getDesp())
                .createdAt(entity.getCreatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedAt(entity.getUpdatedAt())
                .updatedBy(entity.getUpdatedBy())
                .build();
    }

    public static CategoryEntity toEntity(Category domain) {
        if (domain == null)
            return null;
        return CategoryEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .desp(domain.getDesp())
                .createdAt(domain.getCreatedAt())
                .createdBy(domain.getCreatedBy())
                .updatedAt(domain.getUpdatedAt())
                .updatedBy(domain.getUpdatedBy())
                .build();
    }
}
