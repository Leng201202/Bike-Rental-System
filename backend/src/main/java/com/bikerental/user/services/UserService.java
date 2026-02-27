package com.bikerental.user.services;

import java.util.List;

import com.bikerental.user.models.User;

public interface UserService{
    List<User> getAllUsers();
    User getUserById(Long id);
    boolean agreePermission(User user);
    boolean agreeLocationPermission(User user);
    User updateUser(Long id, User user);
    double getDebt(Long id);

}
