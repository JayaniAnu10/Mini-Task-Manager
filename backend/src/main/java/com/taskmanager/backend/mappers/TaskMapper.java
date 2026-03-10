package com.taskmanager.backend.mappers;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.entities.Task;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskAddRequest request);
}
