"use client";
import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Task, PaginatedResponse, TaskFilters } from "@/types";
import TaskForm from "@/components/ui/tasks/TaskForm";
import TaskCard from "@/components/ui/tasks/TaskCard";
import TaskFiltersBar from "@/components/ui/tasks/TaskFiltersBar";
import Pagination from "@/components/ui/tasks/Pagination";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { Plus, AlertTriangle, Shield } from "lucide-react";

export default function TaskPage() {
  const {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markDone,
    filters,
    setFilters,
  } = useTaskStore();

  const [paged, setPaged] = useState<PaginatedResponse<Task>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = true;

  const load = useCallback(
    async (f: TaskFilters) => {
      setIsLoading(true);
      try {
        const result = await fetchTasks("local-user", isAdmin, f);
        setPaged(result);
      } finally {
        setIsLoading(false);
      }
    },
    [isAdmin, fetchTasks],
  );

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const taskCountLabel = `${paged.total} ${paged.total === 1 ? "task" : "tasks"}`;

  const handleCreate = async (data: Partial<Task>) => {
    setSaving(true);
    await createTask({
      ...data,
      userId: "local-user",
      userName: "Task User",
    } as Omit<Task, "id" | "createdAt" | "updatedAt">);
    await load(filters);
    setSaving(false);
  };

  const handleEdit = async (data: Partial<Task>) => {
    if (!editTask) return;
    setSaving(true);
    await updateTask(editTask.id, data);
    await load(filters);
    setSaving(false);
    setEditTask(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteTask(deleteId);
    await load(filters);
    setDeleteId(null);
  };

  const handleMarkDone = async (id: string) => {
    await markDone(id);
    await load(filters);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Tasks
          </h1>
          <p className="text-slate-500 text-base mt-1">{taskCountLabel}</p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          size="lg"
          className="h-11 px-5 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm ring-1 ring-blue-300"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200">
        <TaskFiltersBar
          filters={filters}
          onChange={(f) => setFilters({ ...f, page: 1 })}
        />
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-blue-300" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">No tasks found</h3>
          <p className="text-slate-400 text-sm mb-4">
            Try adjusting your filters or create a new task
          </p>
        </div>
      ) : (
        <div className="rounded-2xl  bg-white">
          {paged.data.map((task, i) => (
            <div key={task.id} className="py-2">
              <TaskCard
                task={task}
                isAdmin={isAdmin}
                onEdit={(t) => setEditTask(t)}
                onDelete={(id) => setDeleteId(id)}
                onMarkDone={handleMarkDone}
              />
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

      {/* Modals */}
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        isLoading={saving}
      />
      <TaskForm
        open={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleEdit}
        task={editTask}
        isLoading={saving}
      />
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
