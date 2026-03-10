package com.taskmanager.backend.repositories;

import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("""
       SELECT new com.taskmanager.backend.dtos.TaskResponse(
           t.title,
           t.description,
           t.status,
           t.priority,
           t.dueDate,
           t.createdAt
       )
       FROM Task t
       WHERE t.user.id = :userId
       AND (:status IS NULL OR t.status = :status)
       AND (:priority IS NULL OR t.priority = :priority)
       """)
    Page<TaskResponse> findByUserIdWithFilters(
            @Param("userId") UUID userId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    Long countByUser_Id(UUID userId);

    @Query("""
            SELECT new com.taskmanager.backend.dtos.TaskResponse(
           t.title,
           t.description,
           t.status,
           t.priority,
           t.dueDate,
           t.createdAt
       )
       FROM Task t
            WHERE (:status   IS NULL OR t.status   = :status)
              AND (:priority IS NULL OR t.priority = :priority)""")
    Page<TaskResponse> findAllWithFilters(
            @Param("status")   Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );
}