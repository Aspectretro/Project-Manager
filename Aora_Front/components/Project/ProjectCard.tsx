"use client"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProjectMember } from "@/hooks/useProjectMember"
import { useProjectTasks } from "@/hooks/useProjectTasks"
import { useTasks } from "@/hooks/useTasks"
import { useState } from "react"

export type ProjectType = {
  project_id: number
  name: string
  description: string
  created_by: number
  created_by_email: string
  created_at: string
}

type Task = {
  task_id: number
  title: string
  content: string
  tag: string
  due_date: string
  assigned_to: number | null
}

export default function ProjectCard({ project }: { project: ProjectType }) {
  const { members = [], refetch: refetchMembers } = useProjectMember(project.project_id)
  const { projectTasks = [], refetch: refetchProjectTasks } = useProjectTasks(project.project_id)
  const { tasks = [] } = useTasks()

  const [memberOpen, setMemberOpen] = useState(false)
  const [viewMembersOpen, setViewMembersOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [email, setEmail] = useState("")
  const [memberError, setMemberError] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("")
  const [assignedTo, setAssignedTo] = useState<string>("")

  async function handle_add_member() {
    if (!email.trim()) return
    const res = await fetch(
      `http://localhost:5000/projects/${project.project_id}/members`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      }
    )
    const data = await res.json()
    if (res.ok) {
      setEmail("")
      setMemberError("")
      refetchMembers()
    } else {
      setMemberError(data.error || "An error occurred")
    }
  }

  async function handle_remove_member(user_id: number) {
    await fetch(
      `http://localhost:5000/projects/${project.project_id}/members/${user_id}`,
      { method: "DELETE", credentials: "include" }
    )
    refetchMembers()
  }

  async function handle_assign_task() {
    if (!selectedTaskId) return
    await fetch(`http://localhost:5000/projects/${project.project_id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        task_id: Number(selectedTaskId),
        assigned_to: assignedTo ? Number(assignedTo) : null,
      }),
    })
    setSelectedTaskId("")
    setSelectedTaskTitle("")
    setAssignedTo("")
    refetchProjectTasks()
  }

  async function handle_remove_task(task_id: number) {
    await fetch(
      `http://localhost:5000/projects/${project.project_id}/tasks/${task_id}`,
      { method: "DELETE", credentials: "include" }
    )
    refetchProjectTasks()
  }

  return (
    <Card className="m-3 w-72">
      <CardHeader className="font-bold text-lg">
        {project.name}
        <hr className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-2">{project.description}</div>
        <p className="text-xs text-muted-foreground">
          Created by: {project.created_by_email}
        </p>
        <p className="text-xs tracking-wider mt-1 mb-2">
          Created at: {new Date(project.created_at).toLocaleDateString()}
        </p>
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Members: {members.length}
        </p>

        <div className="flex flex-col gap-2">
          {/* View Members Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMembersOpen(true)}
          >
            View Members
          </Button>

          {/* Project Tasks Dialog */}
          <AlertDialog>
            {/* Base UI Triggers wrap text or styles directly, rather than cloning node elements via asChild */}
            <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3">
              Project Tasks
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{project.name} — Tasks</AlertDialogTitle>
              </AlertDialogHeader>

              <div className="flex flex-col gap-3">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Add Task to Project</Label>
                <div className="flex gap-2">
                  <Select
                    value={selectedTaskId}
                    onValueChange={(value) => {
                      setSelectedTaskId(value || "")
                      const found = tasks.find((t) => String(t.task_id) === value)
                      setSelectedTaskTitle(found ? found.title : "")
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a task...">
                        {selectedTaskTitle || "Select a task..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tasks.map((t) => (
                        <SelectItem key={t.task_id} value={String(t.task_id)}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handle_assign_task}>Add</Button>
                </div>

                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Assign To (optional)</Label>
                <Select
                  value={assignedTo}
                  onValueChange={(value) => setAssignedTo(value || "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={String(m.user_id)}>
                        {m.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {projectTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">No tasks yet</p>
                )}
                {projectTasks.map((t) => (
                  <div
                    key={t.task_id}
                    className="flex items-center justify-between rounded border p-2"
                  >
                    <div>
                      <p className="text-sm font-medium">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.due_date || "No due date"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setViewTask(t as Task)
                          setViewOpen(true)
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handle_remove_task(t.task_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <AlertDialogCancel className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-3">
                  Close
                </AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Manage Members Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMemberOpen(true)}
          >
            Manage Members
          </Button>
        </div>

        {/* View Task Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewTask?.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Task Description</p>
                <p className="text-sm font-medium">{viewTask?.content || "No content provided."}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tag</p>
                <p className="text-sm font-medium">{viewTask?.tag ?? "No tag"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="text-sm font-medium">{viewTask?.due_date ?? "No due date"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">
                  {viewTask?.assigned_to
                    ? members.find((m) => m.user_id === viewTask.assigned_to)?.email ?? "Unknown User"
                    : "Unassigned"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Members Dialog */}
        <Dialog open={viewMembersOpen} onOpenChange={setViewMembersOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Members — {project.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.length === 0 && (
                <p className="text-sm text-muted-foreground">No members yet</p>
              )}
              {members.map((m) => (
                <div
                  key={m.user_id}
                  className="flex items-center justify-between rounded border p-2"
                >
                  <div>
                    <p className="text-sm font-medium">{m.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewMembersOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Members Dialog */}
        <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Members — {project.name}</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handle_add_member()
                }}
              />
              <Button onClick={handle_add_member}>Add</Button>
            </div>
            {memberError && (
              <p className="text-sm text-red-500 font-medium">{memberError}</p>
            )}
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {members.map((m) => (
                <div key={m.user_id} className="flex items-center justify-between border-b pb-2 last:border-none">
                  <div>
                    <p className="text-sm font-medium">{m.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{m.role}</p>
                  </div>
                  {m.role !== "owner" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handle_remove_member(m.user_id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setMemberOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}