'use client'

import { Column, Task } from '@/types/task'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'
import clsx from 'clsx'

interface KanbanColumnProps {
  column: Column
  onAddTask: (status: Column['id']) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export default function KanbanColumn({ 
  column, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const taskIds = column.tasks.map(task => task.id)

  return (
    <div className="flex flex-col h-full min-w-80 max-w-80">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h2 className="font-semibold text-white text-sm uppercase tracking-wide">
            {column.title}
          </h2>
          <span className="bg-linear-border text-linear-text text-xs px-2 py-1 rounded-full font-medium">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-2 hover:bg-linear-border rounded-lg transition-colors group"
          title="Add task"
        >
          <Plus className="w-4 h-4 text-linear-text group-hover:text-white transition-colors" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={clsx(
          'flex-1 space-y-3 p-1 rounded-lg transition-all duration-200 min-h-20',
          isOver && 'bg-linear-purple/5 border-2 border-dashed border-linear-purple/30'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
        
        {column.tasks.length === 0 && (
          <div className="text-center py-8 text-linear-text/50">
            <div className="w-12 h-12 rounded-full bg-linear-border/50 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm">No tasks yet</p>
            <p className="text-xs mt-1">Drop tasks here or click + to add</p>
          </div>
        )}
      </div>
    </div>
  )
}