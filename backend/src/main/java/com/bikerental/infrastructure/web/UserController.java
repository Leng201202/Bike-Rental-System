package com.bikerental.infrastructure.web;

import com.bikerental.core.application.dto.UserResponseDTO;
import com.bikerental.core.application.usecases.User.GetAllUsersUseCase;
import com.bikerental.core.application.usecases.User.GetUserByIdUseCase;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final GetAllUsersUseCase getAllUsersUseCase;
    private final GetUserByIdUseCase getUserByIdUseCase;

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return getAllUsersUseCase.execute();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable UUID id) {
        return getUserByIdUseCase.execute(id);
    }
}
