package com.bikerental.backend.modules.user;

import com.bikerental.backend.common.api.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ApiResponse<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.ok(UserDto.from(userService.createRider(request)));
    }

    @PostMapping("/sync")
    public ApiResponse<UserDto> syncUser(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.ok(UserDto.from(userService.getOrCreateRider(request)));
    }

    @GetMapping("/by-username/{username}")
    public ApiResponse<UserDto> getByUsername(@PathVariable String username) {
        return ApiResponse.ok(UserDto.from(userService.getByUsername(username)));
    }

    @GetMapping
    public ApiResponse<List<UserDto>> listUsers() {
        List<UserDto> result = userService.listUsers().stream()
            .map(UserDto::from)
            .toList();
        return ApiResponse.ok(result);
    }
}
