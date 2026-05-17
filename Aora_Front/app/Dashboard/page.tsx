"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/useTasks"


export default function DashboardPage() {
  const { tasks, loading, error } = useTasks();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      {/* Grid of Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Tasks To Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {loading && <p>Loading tasks...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {tasks.map((task) => (
              <div key={task.task_id}>
                <p>{task.title}</p>
                <p>{task.tag}</p>
                <p>{task.due_date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
