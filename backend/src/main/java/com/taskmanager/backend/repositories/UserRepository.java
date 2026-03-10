package com.taskmanager.backend.repositories;

import com.taskmanager.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}