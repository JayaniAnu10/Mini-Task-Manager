package com.taskmanager.backend.dtos;

import lombok.Data;
import org.springframework.data.domain.Page;

@Data
public class TaskListing {
    private Page<TaskResponse> taskList;
    private Long totalTasks;
}
