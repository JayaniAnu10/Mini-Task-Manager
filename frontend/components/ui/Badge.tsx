"use client";
import { TaskStatus, TaskPriority } from "@/types";

const statusConfig: Record<
  TaskStatus,
  { label: string; bg: string; text: string }
> = {
  TODO: { label: "To Do", bg: "bg-blue-100", text: "text-blue-700" },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  DONE: { label: "Done", bg: "bg-emerald-100", text: "text-emerald-700" },
};

const priorityConfig: Record<
  TaskPriority,
  { label: string; bg: string; text: string }
> = {
  LOW: { label: "LOW", bg: "bg-slate-100", text: "text-slate-600" },
  MEDIUM: { label: "MEDIUM", bg: "bg-amber-100", text: "text-amber-700" },
  HIGH: { label: "HIGH", bg: "bg-red-100", text: "text-red-600" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = priorityConfig[priority];
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-bold tracking-wide ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}
