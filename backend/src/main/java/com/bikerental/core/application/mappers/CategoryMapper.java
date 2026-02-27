package com.bikerental.core.application.mappers;

import com.bikerental.core.application.dto.CategoryResponseDTO;
import com.bikerental.core.domain.entities.Category;

public class CategoryMapper {
    public static CategoryResponseDTO toResponseDTO(Category category) {
        if (category == null)
            return null;
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .desp(category.getDesp())
                .createdAt(category.getCreatedAt())
                .createdBy(category.getCreatedBy())
                .updatedAt(category.getUpdatedAt())
                .updatedBy(category.getUpdatedBy())
                .build();
    }
}
