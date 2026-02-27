package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {
    List<Category> findAll();

    Optional<Category> findById(UUID id);

    Category save(Category category);

    void deleteById(UUID id);
}
