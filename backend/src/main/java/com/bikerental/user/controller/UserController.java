package com.bikerental.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bikerental.user.models.User;
import com.bikerental.user.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/getUserById/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    @PostMapping("/agreeLocation")
    public boolean agreeLocationPermission(@RequestBody User user) {
        return userService.agreeLocationPermission(user);
    }
    @PostMapping("/agreePermission")    
    public boolean agreePermission(@RequestBody User user) {
        return userService.agreePermission(user);
    }
    @PatchMapping("/updateUser/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    @GetMapping("/{id}/debt")
    public double getDebt(@PathVariable Long id) {
        return userService.getDebt(id);
    }
    
    

}
