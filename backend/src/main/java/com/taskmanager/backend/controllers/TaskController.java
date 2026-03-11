package com.taskmanager.backend.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.dtos.UpdateTaskRequest;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.services.TaskService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RequestMapping("/tasks")
@RestController
@AllArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Void> createTask(@Valid @RequestBody TaskAddRequest task,
                                     Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();

        return taskService.createTask(task, userId);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();

        return ResponseEntity.ok(taskService.getTasks(status, priority, userId, page, size, sortBy, sortDir));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();
        return taskService.updateTask(id, request, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID userId = (UUID)authentication.getPrincipal();

        taskService.deleteTask(id, userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> completeTask(
            @PathVariable UUID id,
            Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();

        return taskService.markAsCompleted(id, userId);
    }


}
