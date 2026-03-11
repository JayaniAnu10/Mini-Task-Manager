"use client";
import { Task } from "@/types";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Calendar, Edit2, Trash2, CheckCircle } from "lucide-react";

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  viewOnly?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onMarkDone?: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dueDate: string, status: string) {
  return status !== "DONE" && new Date(dueDate) < new Date();
}

export default function TaskCard({
  task,
  isAdmin: _isAdmin,
  viewOnly = false,
  onEdit,
  onDelete,
  onMarkDone,
}: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="task-card bg-white rounded-2xl border border-slate-400/40 p-4 mx-2 flex flex-col gap-1 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h2
          className={`text-lg font-semibold text-slate-800 leading-snug flex-1 ${task.status === "DONE" ? "line-through text-slate-400" : ""}`}
        >
          {task.title}
        </h2>
        {!viewOnly && (
          <div className="flex items-center gap-2 shrink-0">
            {task.status !== "DONE" && onMarkDone && (
              <button
                onClick={() => onMarkDone(task.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-emerald-700 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 transition-colors"
                title="Mark as done"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-blue-700 bg-blue-100 border border-blue-200 hover:bg-blue-200 transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-red-700 bg-red-100 border border-red-200 hover:bg-red-200 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      {/* Badges + Due date */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-50">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <div
          className={`shrink-0 flex items-center gap-1.5 text-xs font-medium ${overdue ? "text-red-500" : "text-slate-400"}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {overdue && (
            <span className="text-red-500 font-bold">Overdue · </span>
          )}
          {formatDate(task.dueDate)}
        </div>
      </div>
    </div>
  );
}
