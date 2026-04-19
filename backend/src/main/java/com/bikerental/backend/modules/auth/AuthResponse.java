package com.bikerental.backend.modules.auth;

import com.bikerental.backend.modules.user.UserDto;

public record AuthResponse(
    String token,
    UserDto user
) {
}
