package com.taskmanager.backend.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taskmanager.backend.dtos.AllTaskResponse;
import com.taskmanager.backend.dtos.TaskResponse;
import com.taskmanager.backend.entities.Task;
import com.taskmanager.backend.enums.Priority;
import com.taskmanager.backend.enums.Status;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("""
       SELECT new com.taskmanager.backend.dtos.TaskResponse(
           t.id,
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
            SELECT new com.taskmanager.backend.dtos.AllTaskResponse(
           t.id,
           t.title,
           t.description,
           t.status,
           t.priority,
           t.dueDate,
           t.createdAt,
           t.user.email
       )
       FROM Task t
            WHERE (:status   IS NULL OR t.status   = :status)
              AND (:priority IS NULL OR t.priority = :priority)""")
    Page<AllTaskResponse> findAllWithFilters(
            @Param("status")   Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    @Query("""
       SELECT new com.taskmanager.backend.dtos.TaskResponse(
           t.id, t.title, t.description, t.status, t.priority, t.dueDate, t.createdAt
       )
       FROM Task t
       WHERE t.user.id = :userId
       AND (:status IS NULL OR t.status = :status)
       AND (:priority IS NULL OR t.priority = :priority)
       ORDER BY CASE t.priority WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HIGH' THEN 3 END ASC
       """)
    Page<TaskResponse> findByUserIdWithFiltersPriorityAsc(
            @Param("userId") UUID userId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    @Query("""
       SELECT new com.taskmanager.backend.dtos.TaskResponse(
           t.id, t.title, t.description, t.status, t.priority, t.dueDate, t.createdAt
       )
       FROM Task t
       WHERE t.user.id = :userId
       AND (:status IS NULL OR t.status = :status)
       AND (:priority IS NULL OR t.priority = :priority)
       ORDER BY CASE t.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END ASC
       """)
    Page<TaskResponse> findByUserIdWithFiltersPriorityDesc(
            @Param("userId") UUID userId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    @Query("""
       SELECT new com.taskmanager.backend.dtos.AllTaskResponse(
           t.id, t.title, t.description, t.status, t.priority, t.dueDate, t.createdAt, t.user.email
       )
       FROM Task t
       WHERE (:status IS NULL OR t.status = :status)
       AND (:priority IS NULL OR t.priority = :priority)
       ORDER BY CASE t.priority WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HIGH' THEN 3 END ASC
       """)
    Page<AllTaskResponse> findAllWithFiltersPriorityAsc(
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    @Query("""
       SELECT new com.taskmanager.backend.dtos.AllTaskResponse(
           t.id, t.title, t.description, t.status, t.priority, t.dueDate, t.createdAt, t.user.email
       )
       FROM Task t
       WHERE (:status IS NULL OR t.status = :status)
       AND (:priority IS NULL OR t.priority = :priority)
       ORDER BY CASE t.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END ASC
       """)
    Page<AllTaskResponse> findAllWithFiltersPriorityDesc(
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );
}