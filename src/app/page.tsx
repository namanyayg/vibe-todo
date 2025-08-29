'use client'

import { useState, useCallback, useMemo } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task, TaskStatus, Column } from '@/types/task'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import KanbanColumn from '@/components/KanbanColumn'
import TaskModal from '@/components/TaskModal'
import { Search, Filter, Plus, Settings } from 'lucide-react'

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#6B7280',
    tasks: [],
  },
  {
    id: 'todo',
    title: 'To Do',
    color: '#EF4444',
    tasks: [],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#F59E0B',
    tasks: [],
  },
  {
    id: 'in-review',
    title: 'In Review',
    color: '#8B5CF6',
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10B981',
    tasks: [],
  },
]

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design new user onboarding flow',
    description: 'Create wireframes and mockups for the improved user onboarding experience',
    status: 'todo',
    priority: 'high',
    assignee: 'Sarah Chen',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    labels: ['design', 'ux'],
    estimatedHours: 8,
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up JWT-based authentication with refresh tokens and proper security measures',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'Alex Rodriguez',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-16'),
    labels: ['backend', 'security'],
    estimatedHours: 12,
  },
  {
    id: '3',
    title: 'Fix mobile responsiveness issues',
    description: 'Address layout problems on mobile devices across all main pages',
    status: 'in-review',
    priority: 'medium',
    assignee: 'Jordan Kim',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
    labels: ['frontend', 'mobile'],
    estimatedHours: 4,
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline using GitHub Actions',
    status: 'done',
    priority: 'medium',
    assignee: 'Morgan Taylor',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
    labels: ['devops', 'automation'],
    estimatedHours: 6,
  },
]

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('kanban-tasks', sampleTasks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [initialStatus, setInitialStatus] = useState<TaskStatus>('todo')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const columns = useMemo(() => {
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return initialColumns.map(column => ({
      ...column,
      tasks: filteredTasks.filter(task => task.status === column.id)
    }))
  }, [tasks, searchQuery])

  const handleAddTask = useCallback((status: TaskStatus) => {
    setEditingTask(undefined)
    setInitialStatus(status)
    setIsModalOpen(true)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }, [])

  const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date()
    
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, updatedAt: now }
          : task
      ))
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      }
      setTasks(prev => [...prev, newTask])
    }
    
    setIsModalOpen(false)
    setEditingTask(undefined)
  }, [editingTask, setTasks])

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [setTasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(task => task.id === activeId)
    if (!activeTask) return

    const isOverColumn = initialColumns.some(col => col.id === overId)
    const newStatus = isOverColumn ? overId as TaskStatus : 
      tasks.find(task => task.id === overId)?.status

    if (newStatus && activeTask.status !== newStatus) {
      setTasks(prev => prev.map(task =>
        task.id === activeId 
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      ))
    }
  }, [tasks, setTasks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    
    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(task => task.id === activeId)
    const overTask = tasks.find(task => task.id === overId)

    if (activeTask && overTask && activeTask.status === overTask.status) {
      setTasks(prev => {
        const columnTasks = prev.filter(task => task.status === activeTask.status)
        const activeIndex = columnTasks.findIndex(task => task.id === activeId)
        const overIndex = columnTasks.findIndex(task => task.id === overId)

        if (activeIndex !== -1 && overIndex !== -1) {
          const reorderedTasks = arrayMove(columnTasks, activeIndex, overIndex)
          return prev.map(task => {
            const reorderedTask = reorderedTasks.find(t => t.id === task.id)
            return reorderedTask || task
          })
        }
        return prev
      })
    }
  }, [tasks, setTasks])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'done').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-linear-bg">
      <div className="border-b border-linear-border bg-linear-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-linear-purple to-linear-green flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Project Tasks</h1>
                  <p className="text-sm text-linear-text">
                    {completedTasks} of {totalTasks} tasks completed ({completionRate}%)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-linear-text/50" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-linear-bg border border-linear-border rounded-lg text-white placeholder-linear-text/50 focus:border-linear-purple focus:ring-1 focus:ring-linear-purple focus:outline-none transition-colors w-64"
                />
              </div>
              
              <button
                onClick={() => handleAddTask('todo')}
                className="flex items-center gap-2 bg-linear-purple hover:bg-linear-purple/80 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(undefined)
        }}
        onSave={handleSaveTask}
        initialStatus={initialStatus}
      />
    </div>
  )
}