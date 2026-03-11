package com.taskmanager.backend.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.taskmanager.backend.dtos.AllTaskResponse;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import com.taskmanager.backend.repositories.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final TaskRepository taskRepository;

    public Page<AllTaskResponse> getAllTasks(
            Status status,
            Priority priority,
            int page, int size, String sortBy, String sortDir) {

        if ("priority".equalsIgnoreCase(sortBy)) {
            Pageable pageable = PageRequest.of(page, size);
            return "desc".equalsIgnoreCase(sortDir)
                    ? taskRepository.findAllWithFiltersPriorityDesc(status, priority, pageable)
                    : taskRepository.findAllWithFiltersPriorityAsc(status, priority, pageable);
        }
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return taskRepository.findAllWithFilters(status, priority, pageable);
    }
}