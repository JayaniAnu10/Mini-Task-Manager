"use client";
import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Task, PaginatedResponse, TaskFilters } from "@/types";
import TaskCard from "@/components/ui/tasks/TaskCard";
import TaskFiltersBar from "@/components/ui/tasks/TaskFiltersBar";
import Pagination from "@/components/ui/tasks/Pagination";
import { AlertTriangle, Shield, User } from "lucide-react";

const ADMIN_USER = {
  id: "local-user",
  name: "Admin User",
  role: "ADMIN" as const,
};

export default function DashboardPage() {
  const user = ADMIN_USER;
  const { fetchTasks, filters, setFilters } = useTaskStore();

  const [paged, setPaged] = useState<PaginatedResponse<Task>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const load = useCallback(
    async (f: TaskFilters) => {
      if (!user) return;
      setIsLoading(true);
      const result = await fetchTasks(user.id, isAdmin, f);
      setPaged(result);
      setIsLoading(false);
    },
    [user, isAdmin, fetchTasks],
  );

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                <Shield className="w-3 h-3" /> Admin View
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wide">
                <User className="w-3 h-3" /> My Tasks
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Good to see you, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isAdmin
              ? "Viewing all tasks across the system"
              : "Here are your assigned tasks"}
          </p>
          <p className="text-sm font-semibold text-slate-700 mt-2">
            Total tasks: {paged.total}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100">
        <div className="mb-4">
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Filters & Sorting
          </h2>
        </div>
        <TaskFiltersBar
          filters={filters}
          onChange={(f) => setFilters({ ...f, page: 1 })}
        />
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3"
            >
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : paged.data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">No tasks found</h3>
          <p className="text-slate-400 text-sm mb-4">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paged.data.map((task, i) => (
            <div
              key={task.id}
              className={`animate-fade-in stagger-${Math.min(i + 1, 4)}`}
            >
              <TaskCard task={task} isAdmin={isAdmin} viewOnly />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && paged.totalPages > 1 && (
        <Pagination
          page={paged.page}
          totalPages={paged.totalPages}
          total={paged.total}
          pageSize={paged.pageSize}
          onChange={(p) => setFilters({ page: p })}
        />
      )}
    </div>
  );
}
