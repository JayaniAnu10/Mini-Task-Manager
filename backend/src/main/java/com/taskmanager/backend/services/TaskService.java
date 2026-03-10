package com.taskmanager.backend.services;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskListing;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.entities.User;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.mappers.TaskMapper;
import com.taskmanager.backend.repositories.TaskRepository;
import com.taskmanager.backend.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Service
public class TaskService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public ResponseEntity createTask(TaskAddRequest task, UUID userId) {
        var user=userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var newTask= taskMapper.toEntity(task);
        newTask.setCreatedAt(LocalDateTime.now());
        newTask.setUser(user);
        taskRepository.save(newTask);
        return ResponseEntity.ok().build();
    }

    public TaskListing getTasks(Status status, Priority priority, UUID userId, int page, int size, Sort sort) {
        var user=userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size,sort);
        var listing = taskRepository.findByUserIdWithFilters(user.getId(), status, priority, pageable);
        var totalTasks= taskRepository.countByUser_Id(userId);
        var response = new TaskListing();
        response.setTotalTasks(totalTasks);
        response.setTaskList(listing);
        return response;

    }
}
