package com.bikerental.infrastructure.persistence.repositories.Impl;

import com.bikerental.core.domain.entities.User;
import com.bikerental.core.domain.repositories.UserRepository;
import com.bikerental.infrastructure.persistence.entities.UserEntity;
import com.bikerental.infrastructure.persistence.mappers.UserPersistenceMapper;
import com.bikerental.infrastructure.persistence.repositories.JpaUserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final JpaUserRepository jpaUserRepository;

    @Override
    public List<User> findAll() {
        return jpaUserRepository.findAll().stream()
                .map(UserPersistenceMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<User> findById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return jpaUserRepository.findById(id)
                .map(UserPersistenceMapper::toDomain);
    }

    @Override
    public User save(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        UserEntity entity = UserPersistenceMapper.toEntity(user);
        if (entity == null) {
            throw new IllegalArgumentException("Converted user entity cannot be null");
        }
        UserEntity savedEntity = jpaUserRepository.save(entity);
        return UserPersistenceMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteById(UUID id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        jpaUserRepository.deleteById(id);
    }
}
