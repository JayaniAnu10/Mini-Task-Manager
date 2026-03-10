package com.taskmanager.backend.dtos;

import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AllTaskResponse {
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private String email;
}
