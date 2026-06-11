"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarComponent, CalendarDayButton } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTasks } from "@/hooks/useTasks"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight, ListTodo, Calendar as CalendarIcon, Clock, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"

type Task = {
  task_id: number
  title: string
  content: string
  tag: string
  due_date: string
  created_date: string
}

export default function CalendarPage() {
  const router = useRouter()
  const { tasks, loading } = useTasks()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  // Group tasks by due date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.due_date) {
      const date = format(parseISO(task.due_date), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(task)
    }
    return acc
  }, {} as Record<string, Task[]>)

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return tasksByDate[dateKey] || []
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    const tasksForDate = getTasksForDate(date)
    setSelectedDate(date)
    setSelectedTasks(tasksForDate)
    setDialogOpen(true)
  }

  // Navigation functions
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  // Custom day rendering
  const renderDay = (date: Date) => {
    const tasksForDay = getTasksForDate(date)
    const hasTasks = tasksForDay.length > 0
    const isToday = isSameDay(date, new Date())
    
    return (
      <div className="relative w-full h-full min-h-[80px] p-1">
        <div className="flex justify-between items-start">
          <span className={`text-sm font-medium ${isToday ? 'bg-slate-900 text-white w-6 h-6 rounded-full inline-flex items-center justify-center' : ''}`}>
            {format(date, "d")}
          </span>
          {hasTasks && (
            <Badge variant="secondary" className="text-xs">
              {tasksForDay.length}
            </Badge>
          )}
        </div>
        <div className="mt-1 space-y-0.5">
          {tasksForDay.slice(0, 2).map((task) => (
            <div
              key={task.task_id}
              className="text-xs truncate rounded px-1 py-0.5 bg-slate-100 dark:bg-slate-800 cursor-pointer hover:bg-slate-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                handleDateClick(date)
              }}
            >
              {task.title}
            </div>
          ))}
          {tasksForDay.length > 2 && (
            <div className="text-xs text-muted-foreground pl-1">
              +{tasksForDay.length - 2} more
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Calendar</h1>
              <p className="text-muted-foreground mt-1">
                View and manage all your tasks by due date
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goToToday} className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[150px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </div>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-sm py-2 text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const start = startOfMonth(currentMonth)
                const end = endOfMonth(currentMonth)
                const days = eachDayOfInterval({ start, end })
                
                // Get the day of week for the first day (0 = Sunday)
                const firstDayOfWeek = start.getDay()
                const paddingDays = Array(firstDayOfWeek).fill(null)
                
                const allDays = [...paddingDays, ...days]
                
                return allDays.map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[100px] bg-muted/20 rounded-lg"
                      />
                    )
                  }
                  
                  const tasksForDay = getTasksForDate(day)
                  const hasTasks = tasksForDay.length > 0
                  const isToday = isSameDay(day, new Date())
                  
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                        hasTasks ? "bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100" : "hover:bg-muted/50"
                      } ${isToday ? "border-slate-500 border-2" : "border-border"}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                          isToday ? "text-slate-900 dark:text-white font-bold" : ""
                        }`}>
                          {format(day, "d")}
                        </span>
                        {hasTasks && (
                          <Badge variant="secondary" className="text-xs">
                            {tasksForDay.length}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        {tasksForDay.slice(0, 2).map((task) => (
                          <div
                            key={task.task_id}
                            className="text-xs truncate rounded px-1 py-0.5 bg-slate-200 dark:bg-slate-800 cursor-pointer hover:bg-slate-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/Dashboard/Task/Edit?task_id=${task.task_id}`)
                            }}
                          >
                            {task.title}
                          </div>
                        ))}
                        {tasksForDay.length > 2 && (
                          <div className="text-xs text-muted-foreground pl-1">
                            +{tasksForDay.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </CardContent>
        </Card>

        {/* Task Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Tasks for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks due on this day</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push("/Dashboard/Event")}
                  >
                    Create a task
                  </Button>
                </div>
              ) : (
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-3">
                    {selectedTasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/Dashboard/Task/Edit?task_id=${task.task_id}`)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-base">{task.title}</h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {task.tag || "No tag"}
                          </Badge>
                        </div>
                        {task.content && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {task.content}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {format(parseISO(task.due_date), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => router.push("/Dashboard/Event")}>
                Create New Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks with Due Date</p>
                  <p className="text-2xl font-bold">
                    {tasks.filter(t => t.due_date).length}
                  </p>
                </div>
                <CalendarIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks This Month</p>
                  <p className="text-2xl font-bold">
                    {tasks.filter(t => {
                      if (!t.due_date) return false
                      const taskDate = parseISO(t.due_date)
                      return taskDate.getMonth() === currentMonth.getMonth() &&
                             taskDate.getFullYear() === currentMonth.getFullYear()
                    }).length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Tags</p>
                  <p className="text-2xl font-bold">
                    {new Set(tasks.filter(t => t.tag).map(t => t.tag)).size}
                  </p>
                </div>
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}