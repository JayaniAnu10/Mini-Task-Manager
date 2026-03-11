'use client';
import { TaskFilters, TaskStatus, TaskPriority } from '@/types';
import Select from '@/components/ui/Select';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: Partial<TaskFilters>) => void;
}

const STATUS_OPTS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

const PRIORITY_OPTS = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const SORT_OPTS = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-32">
        <Select
          label="Status"
          value={filters.status || 'ALL'}
          onChange={(e) => onChange({ status: e.target.value as TaskStatus | 'ALL', page: 1 })}
          options={STATUS_OPTS}
        />
      </div>
      <div className="flex-1 min-w-32">
        <Select
          label="Priority"
          value={filters.priority || 'ALL'}
          onChange={(e) => onChange({ priority: e.target.value as TaskPriority | 'ALL', page: 1 })}
          options={PRIORITY_OPTS}
        />
      </div>
      <div className="flex-1 min-w-32">
        <Select
          label="Sort by"
          value={filters.sortBy || 'dueDate'}
          onChange={(e) => onChange({ sortBy: e.target.value as 'dueDate' | 'priority' })}
          options={SORT_OPTS}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Order</label>
        <button
          onClick={() => onChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className="h-[42px] px-3.5 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          {filters.sortOrder === 'asc' ? (
            <><SortAsc className="w-4 h-4" /> Ascending</>
          ) : (
            <><SortDesc className="w-4 h-4" /> Descending</>
          )}
        </button>
      </div>
    </div>
  );
}
