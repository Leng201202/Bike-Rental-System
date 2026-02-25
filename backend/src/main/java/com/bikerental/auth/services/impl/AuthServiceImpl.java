package com.bikerental.auth.services.impl;

import com.bikerental.auth.services.AuthService;
import com.bikerental.user.models.User;

public class AuthServiceImpl implements AuthService{

    
    
    @Override
    public User register(User user) {
        return user;
    }
    @Override
    public User login(User user) {
        return user;
    }
    @Override
    public User logout(User user) {
        return user;
    }
}
