package com.taskmanager.backend.controllers;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.dtos.TaskListing;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.services.TaskService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequestMapping("/tasks")
@RestController
@AllArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity createTask(@RequestBody TaskAddRequest task,
                                     @RequestParam UUID userId) {

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
            @RequestParam UUID userId) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        TaskListing response = taskService.getTasks(
                status, priority, userId,page, size, sort);

        return ResponseEntity.ok(response);
    }


}
