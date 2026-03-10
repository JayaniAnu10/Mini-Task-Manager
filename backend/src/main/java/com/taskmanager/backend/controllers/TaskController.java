package com.taskmanager.backend.controllers;

import com.taskmanager.backend.dtos.TaskAddRequest;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.services.TaskService;
import lombok.AllArgsConstructor;
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
}
