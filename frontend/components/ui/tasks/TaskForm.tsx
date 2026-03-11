"use client";
import { useState, useEffect } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/button";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  task?: Task | null;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

interface FormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
}

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  task,
  isLoading,
}: TaskFormProps) {
  const isEdit = !!task;

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate.split("T")[0],
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      });
    }
    setErrors({});
  }, [task, open]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Title is required";
    else if (form.title.length < 3)
      e.title = "Title must be at least 3 characters";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "Create New Task"}
      size="md"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="Enter task title..."
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          error={errors.title}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>
          <textarea
            placeholder="Describe the task..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 input-field resize-none ${errors.description ? "border-red-300" : "border-slate-200"}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))
            }
            options={STATUS_OPTIONS}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                priority: e.target.value as TaskPriority,
              }))
            }
            options={PRIORITY_OPTIONS}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          error={errors.dueDate}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            className="bg-blue-600"
          >
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
