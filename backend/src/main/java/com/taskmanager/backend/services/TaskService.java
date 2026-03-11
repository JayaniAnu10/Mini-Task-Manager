package com.taskmanager.backend.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.dtos.UpdateTaskRequest;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.entities.User;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.exceptions.BadRequestException;
import com.taskmanager.backend.exceptions.NotFoundException;
import com.taskmanager.backend.mappers.TaskMapper;
import com.taskmanager.backend.repositories.TaskRepository;
import com.taskmanager.backend.repositories.UserRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class TaskService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public ResponseEntity<Void> createTask(TaskAddRequest task, UUID userId) {
        User user = findUserById(userId);
        var newTask= taskMapper.toEntity(task);
        newTask.setCreatedAt(LocalDateTime.now());
        newTask.setUser(user);
        taskRepository.save(newTask);
        return ResponseEntity.ok().build();
    }

    public Page<TaskResponse> getTasks(Status status, Priority priority, UUID userId, int page, int size, Sort sort) {
        User user = findUserById(userId);
        Pageable pageable = PageRequest.of(page, size,sort);
        return taskRepository.findByUserIdWithFilters(user.getId(), status, priority, pageable);
    }

    public ResponseEntity<Void> updateTask(UUID taskId, UpdateTaskRequest request, UUID userId) {
        User user = findUserById(userId);
        Task task = findTaskById(taskId);
        assertCanModify(user, task);

        taskMapper.updateFromRequest(request, task);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);
        return ResponseEntity.ok().build();
    }

    public void deleteTask(UUID taskId, UUID userId) {
        User user = findUserById(userId);
        Task task = findTaskById(taskId);
        assertCanModify(user, task);

        taskRepository.delete(task);
    }

    public ResponseEntity<Void> markAsCompleted(UUID taskId, UUID userId) {
        User user = findUserById(userId);
        Task task = findTaskById(taskId);
        assertCanModify(user, task);

        task.setStatus(Status.DONE);
        taskRepository.save(task);
        return ResponseEntity.ok().build();
    }

    private void assertCanModify(User user, Task task) {
        if (!task.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to modify this task");
        }
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: " + id));
    }

    private Task findTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found: " + id));
    }

}
