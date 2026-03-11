package com.taskmanager.backend.controllers;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.backend.dtos.AllTaskResponse;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.services.AdminService;

import lombok.AllArgsConstructor;

@RequestMapping("/admin")
@RestController
@AllArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/tasks")
    public Page<AllTaskResponse> getAllTasks(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return adminService.getAllTasks(status, priority, page, size, sortBy, sortDir);

    }
}
