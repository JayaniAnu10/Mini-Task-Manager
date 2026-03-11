export type Role = "ADMIN" | "USER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskFilters {
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  sortBy?: "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
  page: number;
  pageSize: number;
}
