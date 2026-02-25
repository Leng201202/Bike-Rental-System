package com.bikerental.auth.services;

import com.bikerental.user.models.User;

public interface AuthService {
    User register(User user);
    User login(User user);
    User logout(User user);
}
