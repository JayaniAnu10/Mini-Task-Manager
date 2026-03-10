package com.taskmanager.backend.mappers;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.dtos.UpdateTaskRequest;
import com.taskmanager.backend.entities.Task;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskAddRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(UpdateTaskRequest request,@MappingTarget Task task);

}
