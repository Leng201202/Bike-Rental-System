package com.bikerental.user.services.impl;

import java.util.List;

import com.bikerental.user.models.User;
import com.bikerental.user.services.UserService;

public class UserServiceImpl implements UserService {
    
    @Override
    public List<User> getAllUsers() {
        return null;
    }
    @Override
    public User getUserById(Long id) {
        return null;
    }
    @Override
    public boolean agreePermission(User user) {
        return false;
    }
    @Override
    public boolean agreeLocationPermission(User user) {
        return false;
    }
    @Override
    public User updateUser(Long id, User user) {
        return null;
    }
    @Override
    public double getDebt(Long id) {
        return 0;
    }
}
