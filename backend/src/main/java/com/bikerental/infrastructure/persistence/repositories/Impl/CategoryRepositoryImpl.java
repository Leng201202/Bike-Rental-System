package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.Category;
import com.bikerental.core.domain.repositories.CategoryRepository;
import com.bikerental.infrastructure.persistence.entities.CategoryEntity;
import com.bikerental.infrastructure.persistence.mappers.CategoryPersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaCategoryRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepository {
    private final JpaCategoryRepository jpaCategoryRepository;

    @Override
    public List<Category> findAll() {
        return jpaCategoryRepository.findAll().stream()
                .map(CategoryPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Category> findById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        return jpaCategoryRepository.findById(id)
                .map(CategoryPersistenceMapper::toDomain);
    }

    @Override
    public Category save(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        CategoryEntity entity = CategoryPersistenceMapper.toEntity(category);
        if (entity == null) {
            throw new IllegalArgumentException("Converted category entity cannot be null");
        }
        CategoryEntity savedEntity = jpaCategoryRepository.save(entity);
        return CategoryPersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        jpaCategoryRepository.deleteById(id);
    }
}
