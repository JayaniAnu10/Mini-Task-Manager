package com.taskmanager.backend.services;

import com.taskmanager.backend.dtos.TaskListing;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final TaskRepository taskRepository;

    public Page<TaskResponse> getAllTasks(
            Status status,
            Priority priority,
            int page, int size, Sort sort) {

        Pageable pageable = PageRequest.of(page, size,sort);

        var listing = taskRepository.findAllWithFilters(status, priority, pageable);
        return listing;
    }
}