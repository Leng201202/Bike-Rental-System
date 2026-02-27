package com.bikerental.core.application.usecases.User;

import com.bikerental.core.application.dto.UserResponseDTO;
import com.bikerental.core.application.mappers.UserMapper;
import com.bikerental.core.domain.repositories.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetUserByIdUseCase {
    private final UserRepository userRepository;

    public UserResponseDTO execute(UUID id) {
        return userRepository.findById(id)
                .map(UserMapper::toResponseDTO)
                .orElse(null);
    }
}
