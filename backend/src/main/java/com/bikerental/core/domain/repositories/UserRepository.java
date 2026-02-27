package com.bikerental.core.domain.repositories;

import com.bikerental.core.domain.entities.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    List<User> findAll();

    Optional<User> findById(UUID id);

    User save(User user);

    void deleteById(UUID id);
}
