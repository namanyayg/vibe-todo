'use client'

import { Task, TaskStatus } from '@/types/task'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TaskModalProps {
  task?: Task
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<Task, 'id'>) => void
  initialStatus?: TaskStatus
}

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: '#EF4444' },
  { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { value: 'in-review', label: 'In Review', color: '#8B5CF6' },
  { value: 'done', label: 'Done', color: '#10B981' },
]

export default function TaskModal({ task, isOpen, onClose, onSave, initialStatus = 'todo' }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>(initialStatus)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setStatus(task.status)
    } else {
      setTitle('')
      setDescription('')
      setStatus(initialStatus)
    }
  }, [task, initialStatus])

  const handleSave = () => {
    if (!title.trim()) return
    
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
      <div className="bg-linear-card border border-linear-border rounded-xl w-full max-w-3xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-linear-border">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-linear-text/60">
              #{task?.id.slice(-4).toUpperCase() || 'NEW'}
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="bg-linear-bg border border-linear-border rounded-lg px-3 py-1 text-sm text-white focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-linear-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-white placeholder-linear-text/50 focus:outline-none"
              placeholder="Untitled"
              autoFocus
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-linear-text placeholder-linear-text/50 focus:outline-none resize-none min-h-[200px] leading-relaxed"
              placeholder="Add a description..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-linear-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-linear-text hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2 bg-linear-purple hover:bg-linear-purple/80 disabled:bg-linear-purple/30 text-white font-medium rounded-lg transition-colors"
          >
            {task ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}