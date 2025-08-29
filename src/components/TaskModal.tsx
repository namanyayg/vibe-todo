'use client'

import { Task, TaskPriority, TaskStatus } from '@/types/task'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TaskModalProps {
  task?: Task
  isOpen: boolean
  onClose: () => void
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  initialStatus?: TaskStatus
}

const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', color: '#6B7280' },
  { value: 'todo', label: 'To Do', color: '#EF4444' },
  { value: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { value: 'in-review', label: 'In Review', color: '#8B5CF6' },
  { value: 'done', label: 'Done', color: '#10B981' },
]

const priorityOptions: { value: TaskPriority; label: string; icon: string }[] = [
  { value: 'low', label: 'Low', icon: '⬇️' },
  { value: 'medium', label: 'Medium', icon: '➡️' },
  { value: 'high', label: 'High', icon: '⬆️' },
  { value: 'urgent', label: 'Urgent', icon: '🔥' },
]

export default function TaskModal({ task, isOpen, onClose, onSave, initialStatus = 'todo' }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'medium' as TaskPriority,
    assignee: '',
    estimatedHours: '',
    labels: [] as string[],
  })

  const [labelInput, setLabelInput] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || '',
        estimatedHours: task.estimatedHours?.toString() || '',
        labels: task.labels || [],
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: initialStatus,
        priority: 'medium',
        assignee: '',
        estimatedHours: '',
        labels: [],
      })
    }
  }, [task, initialStatus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSave({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee.trim() || undefined,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      labels: formData.labels.length > 0 ? formData.labels : undefined,
    })
  }

  const addLabel = () => {
    if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelInput.trim()]
      }))
      setLabelInput('')
    }
  }

  const removeLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-linear-card border border-linear-border rounded-xl w-full max-w-2xl max-h-90vh overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-linear-border">
          <h2 className="text-xl font-semibold text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-linear-border rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-linear-text mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-linear-text mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors resize-none"
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-linear-text mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-linear-text mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-linear-text mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
                placeholder="Assign to..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-linear-text mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.estimatedHours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                className="w-full bg-linear-bg border border-linear-border rounded-lg px-4 py-3 text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-linear-text mb-2">
              Labels
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                className="flex-1 bg-linear-bg border border-linear-border rounded-lg px-4 py-2 text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors"
                placeholder="Add a label..."
              />
              <button
                type="button"
                onClick={addLabel}
                className="px-4 py-2 bg-linear-purple hover:bg-linear-purple/80 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {formData.labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.labels.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-linear-purple/20 text-linear-purple text-sm rounded-full"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => removeLabel(label)}
                      className="hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-linear-purple hover:bg-linear-purple/80 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-linear-border hover:bg-linear-border text-linear-text hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}