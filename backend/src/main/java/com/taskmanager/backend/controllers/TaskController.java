package com.taskmanager.backend.controllers;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskListing;
import com.taskmanager.backend.dtos.UpdateTaskRequest;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.services.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/tasks")
@RestController
@AllArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity createTask(@RequestBody TaskAddRequest task,
                                     Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();

        return taskService.createTask(task, userId);
    }

    @GetMapping
    public ResponseEntity<TaskListing> getTasks(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        TaskListing response = taskService.getTasks(
                status, priority, userId,page, size, sort);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity updateTask(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {

        UUID userId = (UUID)authentication.getPrincipal();
        return taskService.updateTask(id, request, userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteTask(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID userId = (UUID)authentication.getPrincipal();

        taskService.deleteTask(id, userId);
        return ResponseEntity.ok().build();
    }




}
