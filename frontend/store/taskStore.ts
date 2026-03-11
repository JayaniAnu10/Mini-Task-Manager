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

interface UserTaskResponse {
  id: string;
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  dueDate: string;
  createdAt: string;
}

interface AdminTaskResponse {
  id: string;
  title: string;
  description: string;
  status: Task["status"];
  priority: Task["priority"];
  dueDate: string;
  createdAt: string;
  email: string;
}

interface TaskListingResponse {
  taskList: {
    content: UserTaskResponse[];
    totalElements: number;
    number: number;
    size: number;
    totalPages: number;
  };
  totalTasks: number;
}

interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
  totalPages: number;
}

function mapUserTaskToTask(task: UserTaskResponse): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: new Date(task.dueDate).toISOString(),
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.createdAt).toISOString(),
    userId: "",
  };
}

function mapAdminTaskToTask(task: AdminTaskResponse): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: new Date(task.dueDate).toISOString(),
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.createdAt).toISOString(),
    userId: task.email,
    userName: task.email,
  };
}

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback((next: Partial<TaskFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const fetchTasks = useCallback(
    async (
      _userId: string,
      isAdmin: boolean,
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

      if (isAdmin) {
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
      } else {
        const { data: response } = await apiClient.get<TaskListingResponse>(
          "/tasks",
          { params },
        );

        const mappedTasks = response.taskList.content.map(mapUserTaskToTask);
        setTasks(mappedTasks);

        return {
          data: mappedTasks,
          total: response.taskList.totalElements,
          page: response.taskList.number + 1,
          pageSize: response.taskList.size,
          totalPages: response.taskList.totalPages,
        };
      }
    },
    [],
  );

  const createTask = useCallback(
    async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      await apiClient.post("/tasks", {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.split("T")[0] : null,
      });
    },
    [],
  );

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    await apiClient.patch(`/tasks/${id}`, {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? data.dueDate.split("T")[0] : undefined,
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  }, []);

  const markDone = useCallback(async (id: string) => {
    await apiClient.patch(`/tasks/${id}/complete`);
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
