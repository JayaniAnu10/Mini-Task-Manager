package com.taskmanager.backend.dtos;

import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskAddRequest {
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate dueDate;
}
