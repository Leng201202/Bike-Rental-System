package com.bikerental.infrastructure.persistence.repositories;

import com.bikerental.infrastructure.persistence.entities.BikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaBikeRepository extends JpaRepository<BikeEntity, Long> {
}
