"use client";

import { useCallback, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { PaginatedResponse, Task, TaskFilters } from "@/types";

const DEFAULT_FILTERS: Required<
  Pick<TaskFilters, "page" | "pageSize" | "sortBy" | "sortOrder">
> = {
  page: 1,
  pageSize: 6,
  sortBy: "dueDate",
  sortOrder: "asc",
};

const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Finalize sprint board",
    description: "Review and close completed tickets for this sprint.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    userId: "local-user",
    userName: "Admin User",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t2",
    title: "Prepare weekly report",
    description: "Collect task metrics and publish the progress report.",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    userId: "local-user",
    userName: "Admin User",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface AdminTaskResponse {
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  dueDate: string;
  createdAt: string;
  email: string;
}

interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}

function mapAdminTaskToTask(task: AdminTaskResponse, index: number): Task {
  const createdAt = new Date(task.createdAt).toISOString();
  const dueDate = new Date(task.dueDate).toISOString();

  return {
    id: `${task.createdAt}-${index}-${task.title}`,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate,
    createdAt,
    updatedAt: createdAt,
    userId: task.email,
    userName: task.email,
  };
}

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback((next: Partial<TaskFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const fetchTasks = useCallback(
    async (
      _userId: string,
      _isAdmin: boolean,
      f: TaskFilters,
    ): Promise<PaginatedResponse<Task>> => {
      const uiPage = f.page ?? DEFAULT_FILTERS.page;
      const pageSize = f.pageSize ?? DEFAULT_FILTERS.pageSize;
      const sortBy = f.sortBy ?? DEFAULT_FILTERS.sortBy;
      const sortOrder = f.sortOrder ?? DEFAULT_FILTERS.sortOrder;

      const params: Record<string, string | number> = {
        page: Math.max(0, uiPage - 1),
        size: pageSize,
        sortBy,
        sortDir: sortOrder,
      };

      if (f.status && f.status !== "ALL") {
        params.status = f.status;
      }

      if (f.priority && f.priority !== "ALL") {
        params.priority = f.priority;
      }

      const { data: response } = await apiClient.get<
        SpringPageResponse<AdminTaskResponse>
      >("/admin/tasks", { params });

      const mappedTasks = response.content.map(mapAdminTaskToTask);
      setTasks(mappedTasks);

      return {
        data: mappedTasks,
        total: response.totalElements,
        page: response.number + 1,
        pageSize: response.size,
        totalPages: response.totalPages,
      };
    },
    [],
  );

  const createTask = useCallback(
    async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const task: Task = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [task, ...prev]);
    },
    [],
  );

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markDone = useCallback(async (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "DONE", updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  }, []);

  return {
    tasks,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markDone,
  };
}
