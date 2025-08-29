'use client'

import { Task } from '@/types/task'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MoreHorizontal } from 'lucide-react'
import clsx from 'clsx'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
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
        'bg-linear-card border border-linear-border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-linear-purple/50 group',
        isDragging && 'opacity-50 shadow-2xl scale-105'
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget || (e.target as Element).tagName === 'H3' || (e.target as Element).tagName === 'P') {
          onEdit(task)
        }
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-linear-text/60">
          #{task.id.slice(-4).toUpperCase()}
        </span>
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

      <h3 className="font-medium text-white mb-2 leading-tight">
        {task.title}
      </h3>
      
      {task.description && (
        <p className="text-sm text-linear-text/70 line-clamp-3">
          {task.description}
        </p>
      )}
    </div>
  )
}