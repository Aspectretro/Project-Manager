"use client"

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTasks } from "@/hooks/useTasks"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Task() {
  const { tasks, loading, error, refetch } = useTasks()
  const router = useRouter()

  async function handle_resolve(task_id: number) {
    const res = await fetch(`http://localhost:5000/tasks/${task_id}/resolve`, {
      method: "DELETE",
      credentials: "include",
    })
    refetch()
  }

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle>Tasks To Complete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap">
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {tasks.map((task) => (
            <div key={task.task_id}>
              <Card className="m-3 h-50 w-68">
                <CardHeader>
                  {task.title}
                  <hr />
                </CardHeader>
                <CardContent>
                  <p>{task.content}</p>
                  <p className="mt-2 mb-[2px] text-xs tracking-wider text-muted-foreground">
                    Task Due Date
                  </p>
                  <p className="mt-1">{task.due_date}</p>
                  <AlertDialog>
                    <AlertDialogTrigger render={<Button variant="outline" />}>
                      Show Task Detail
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg">
                          {task.title}
                        </AlertDialogTitle>
                        <div className="text-xs text-muted-foreground">
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
                        <AlertDialogAction
                          onClick={() => handle_resolve(task.task_id)}
                        >
                          Resolve
                        </AlertDialogAction>
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
  )
}
