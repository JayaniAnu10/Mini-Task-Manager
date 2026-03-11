package com.taskmanager.backend.services;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.dtos.UserRegisterRequest;
import com.taskmanager.backend.dtos.UserRegisterResponse;
import com.taskmanager.backend.entities.User;
import com.taskmanager.backend.enums.Role;
import com.taskmanager.backend.exceptions.BadRequestException;
import com.taskmanager.backend.exceptions.NotFoundException;
import com.taskmanager.backend.exceptions.PasswordMismatchException;
import com.taskmanager.backend.mappers.UserMapper;
import com.taskmanager.backend.repositories.UserRepository;

import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserRegisterResponse registerUser(UserRegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new BadRequestException("Email already exists");
        }

        if(!request.getPassword().equals(request.getConfirmPassword())){
            throw new PasswordMismatchException("Passwords do not match");
        }

        var user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        user.setEmail(request.getEmail());
        userRepository.save(user);
        return userMapper.toResponse(user);
    }

    public User getUserById(UUID id){
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return user;
    }
}
