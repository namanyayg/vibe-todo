export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'in-review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  createdAt: Date
  updatedAt: Date
  labels?: string[]
  estimatedHours?: number
}

export interface Column {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}