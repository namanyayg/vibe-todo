'use client'

import { Task, TaskPriority } from '@/types/task'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, User, Flag, MoreHorizontal } from 'lucide-react'
import clsx from 'clsx'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'text-gray-400 bg-gray-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  urgent: 'text-red-400 bg-red-400/10'
}

const priorityIcons: Record<TaskPriority, string> = {
  low: '⬇️',
  medium: '➡️',
  high: '⬆️',
  urgent: '🔥'
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'bg-linear-card border border-linear-border rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-linear-purple/50 group',
        isDragging && 'opacity-50 shadow-2xl scale-105'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-linear-text/60">
            {task.id.slice(-4).toUpperCase()}
          </span>
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            priorityColors[task.priority]
          )}>
            {priorityIcons[task.priority]} {task.priority}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-linear-border rounded"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h3 
        className="font-medium text-white mb-2 leading-tight cursor-pointer hover:text-linear-purple transition-colors"
        onClick={() => onEdit(task)}
      >
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-linear-text/70 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-linear-text/50">
        <div className="flex items-center gap-3">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{task.assignee}</span>
            </div>
          )}
          {task.estimatedHours && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
        </div>
        <div className="text-xs">
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-linear-purple/20 text-linear-purple text-xs rounded-full"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}