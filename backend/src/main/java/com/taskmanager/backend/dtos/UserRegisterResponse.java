package com.taskmanager.backend.dtos;

import lombok.Data;

import java.util.UUID;

@Data
public class UserRegisterResponse {
    private UUID id;
    private String email;
}
