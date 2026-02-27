package com.bikerental.core.application.usecases.User;

import com.bikerental.core.application.dto.UserResponseDTO;
import com.bikerental.core.application.mappers.UserMapper;
import com.bikerental.core.application.usecases.AuditLogs.LogAuditActionUseCase;
import com.bikerental.core.domain.repositories.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.bikerental.core.domain.entities.AuditAction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetAllUsersUseCase {
    private final UserRepository userRepository;
    private final LogAuditActionUseCase logAuditActionUseCase;

    public List<UserResponseDTO> execute() {
        logAuditActionUseCase.execute("SYSTEM", AuditAction.FETCH_USERS, "Fetching all users");
        return userRepository.findAll().stream()
                .map(UserMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
