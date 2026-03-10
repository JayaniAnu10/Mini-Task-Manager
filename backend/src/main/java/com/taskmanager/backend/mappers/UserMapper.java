package com.taskmanager.backend.mappers;

import com.taskmanager.backend.dtos.UserDto;
import com.taskmanager.backend.dtos.UserRegisterRequest;
import com.taskmanager.backend.dtos.UserRegisterResponse;
import com.taskmanager.backend.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserRegisterResponse toResponse(User user);

    UserDto toDto(User user);

    User toEntity(UserRegisterRequest request);
}
