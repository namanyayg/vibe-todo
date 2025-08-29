export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
}

export interface Column {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}