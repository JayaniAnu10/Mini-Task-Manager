# Mini Task Manager

## Project Overview

Mini Task Manager is a full-stack task management application with role-based access.

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Spring Boot + Spring Security + JWT + JPA + Flyway
- Database: MySQL
- API docs: Swagger UI

### Backend Architecture

The backend follows a layered architecture:

- Controller layer: handles HTTP requests/responses
- Service layer: contains business logic
- Repository layer: handles database access using Spring Data JPA
- DTO + Mapper layer: request/response models and entity mapping
- Config + Security layer: JWT, CORS, and Spring Security setup

Key features:

- User registration and login
- JWT-based authentication with refresh flow
- User task CRUD (create, list, update, delete)
- Task filtering, sorting, and pagination
- Admin view for all tasks

## Repository Structure

This single repository contains both frontend and backend files:

- `frontend/` Next.js application
- `backend/` Spring Boot REST API

## Environment Variables

Create an environment file in `backend/.env` with the following keys:

```env
JWT_SECRET=your_jwt_secret_key
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

## Database Configuration

Backend datasource is configured in `backend/src/main/resources/application.yml` and reads from env vars.

Default connection URL:

```text
jdbc:mysql://localhost:3306/task_manager?createDatabaseIfNotExist=true
```

## Database Schema

Flyway migration file: `backend/src/main/resources/db/migration/V1__initial_migration.sql`

Tables:

1. `users`

- `id` BINARY(16), PK (UUID)
- `email` VARCHAR(150), UNIQUE, NOT NULL
- `password` VARCHAR(255), NOT NULL
- `role` VARCHAR(20), NOT NULL

2. `tasks`

- `id` BINARY(16), PK (UUID)
- `title` VARCHAR(255), NOT NULL
- `description` TEXT
- `status` VARCHAR(20)
- `priority` VARCHAR(20)
- `due_date` DATE
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP
- `user_id` BINARY(16), FK -> `users.id`

Seed data:

- One admin user is inserted by the initial migration.

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm 10+
- Java 21
- Maven (or use Maven wrapper)
- MySQL 8+

### 1. Backend Setup

```powershell
cd backend
```

Create `backend/.env` manually if it does not exist, then set:

- `JWT_SECRET`
- `DB_USERNAME`
- `DB_PASSWORD`

Run backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs at:

- `http://localhost:8080`

### 2. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at:

- `http://localhost:3000`

## Steps to Run the Application

1. Start MySQL.
2. Configure `backend/.env` with required variables.
3. Start backend (`.\mvnw.cmd spring-boot:run`).
4. Start frontend (`npm run dev`).
5. Open `http://localhost:3000`.

## API Documentation

Swagger UI is enabled in the backend.

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Main API groups:

- Auth APIs: register, login, refresh, logout, me
- Task APIs: create, list, update, delete, mark complete
- Admin APIs: list all tasks with filters and pagination
