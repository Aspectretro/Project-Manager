"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/useTasks"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { tasks, loading, error } = useTasks()
  const router = useRouter()

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
                <Card className="m-3">
                  <CardHeader>
                    {task.title}
                    <hr />
                  </CardHeader>
                  <CardContent>
                    <p>{task.content}</p>
                    <p className="mb-[2px] text-xs text-muted-foreground">
                      Task Due Date
                    </p>
                    <p>{task.due_date}</p>
                    <AlertDialog>
                      <AlertDialogTrigger render={<Button variant="outline" />}>
                        Show Task Detail
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg">
                            {task.title}
                          </AlertDialogTitle>
                          <div className="text-muted-foreground text-xs">
                            Task Description
                          </div>
                          <span className="text-base text-zinc-900">
                            {task.content}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            Task Category
                          </div>
                          <span className="text-base text-zinc-900">
                            {task.tag}
                          </span>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Resolve</AlertDialogAction>
                          <AlertDialogAction
                            onClick={() =>
                              router.push(
                                `/Dashboard/EventEdit?task_id=${task.task_id}`
                              )
                            }
                          >
                            Edit
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
