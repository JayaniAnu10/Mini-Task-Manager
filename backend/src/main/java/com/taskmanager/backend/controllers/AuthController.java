package com.taskmanager.backend.controllers;

import com.taskmanager.backend.dtos.UserRegisterRequest;
import com.taskmanager.backend.dtos.UserRegisterResponse;
import com.taskmanager.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@AllArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public UserRegisterResponse registerUser(@Valid @RequestBody UserRegisterRequest request) {
        return userService.registerUser(request);
    }

}
