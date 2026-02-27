package com.bikerental.infrastructure.persistence.repositories;

import com.bikerental.infrastructure.persistence.entities.StatusEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaStatusRepository extends JpaRepository<StatusEntity, UUID> {
}
