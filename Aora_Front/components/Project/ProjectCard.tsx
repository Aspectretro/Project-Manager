"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useUser } from "@/hooks/useUser"

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

  const { members = [], refetch: refetchMembers } = useProjectMember(
    project.project_id
  )
  const { projectTasks = [], refetch: refetchProjectTasks } = useProjectTasks(
    project.project_id
  )
  const { tasks = [] } = useTasks()
  const { user } = useUser()

  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [taskViewOpen, setTaskViewOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [memberError, setMemberError] = useState("")
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("")
  const [assignedTo, setAssignedTo] = useState<string>("")

  // FIXED AUTHORIZATION EVALUATION
  const currentUserMembership = members.find(
    (m) => m.email?.toLowerCase() === user?.email?.toLowerCase()
  )
  const isOwner = currentUserMembership?.role === "owner"

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
      <CardHeader className="text-lg font-bold">
        {project.name}
        <hr className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm">{project.description}</div>
        <p className="text-xs text-muted-foreground">
          Created by: {project.created_by_email}
        </p>
        <p className="mt-1 mb-2 text-xs tracking-wider">
          Created at: {new Date(project.created_at).toLocaleDateString()}
        </p>
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Members: {members.length}
        </p>

        <div className="flex flex-col gap-2">
          {/* View Project Details Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setProjectDialogOpen(true)}
          >
            View Project Details
          </Button>

          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProjectDialogOpen(true)}
            >
              Manage Project
            </Button>
          )}
        </div>

        {/* Main Project Dialog with Sidebar Layout */}
        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 overflow-hidden gap-6">
              {/* Main Content Area - Tasks */}
              <div className="flex-1 overflow-y-auto pr-2">
                {/* Project Description Section */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p>Created by: {project.created_by_email}</p>
                    <p>Created at: {new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Tasks Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Tasks</h3>
                  </div>

                  {/* Add Task Form */}
                  <div className="flex flex-col gap-3 p-3 border rounded-lg">
                    <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                      Add Task to Project
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedTaskId}
                        onValueChange={(value) => {
                          setSelectedTaskId(value || "")
                          const found = tasks.find(
                            (t) => String(t.task_id) === value
                          )
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

                    <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                      Assign To (optional)
                    </Label>
                    <Select
                      value={assignedTo}
                      onValueChange={(value) => setAssignedTo(value || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member...">
                          {assignedTo
                            ? members.find((m) => String(m.user_id) === assignedTo)
                                ?.email
                            : "Select a member..."}
                        </SelectValue>
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

                  {/* Tasks List */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {projectTasks.length === 0 && (
                      <p className="py-2 text-sm text-muted-foreground text-center">
                        No tasks yet
                      </p>
                    )}
                    {projectTasks.map((t) => (
                      <div
                        key={t.task_id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.due_date || "No due date"}
                          </p>
                          {t.assigned_to && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Assigned to:{" "}
                              {members.find((m) => m.user_id === t.assigned_to)
                                ?.email || "Unknown"}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setViewTask(t as Task)
                              setTaskViewOpen(true)
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
                </div>
              </div>

              {/* Sidebar - Members Section */}
              <div className="w-80 border-l pl-4 overflow-y-auto">
                <div className="sticky top-0 bg-background pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Members</h3>
                    <p className="text-sm text-muted-foreground">
                      {members.length} total
                    </p>
                  </div>

                  {/* Add Member Section - Only for owners */}
                  {isOwner && (
                    <div className="mb-4 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter email..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handle_add_member()
                          }}
                        />
                        <Button onClick={handle_add_member} size="sm">
                          Add
                        </Button>
                      </div>
                      {memberError && (
                        <p className="text-sm font-medium text-red-500">
                          {memberError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  {members.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No members yet
                    </p>
                  )}
                  {members.map((m) => (
                    <div
                      key={m.user_id}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{m.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {m.role}
                        </p>
                      </div>
                      {isOwner && m.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handle_remove_member(m.user_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Task Dialog */}
        <Dialog open={taskViewOpen} onOpenChange={setTaskViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewTask?.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Task Description</p>
                <p className="text-sm font-medium">
                  {viewTask?.content || "No content provided."}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tag</p>
                <p className="text-sm font-medium">
                  {viewTask?.tag ?? "No tag"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="text-sm font-medium">
                  {viewTask?.due_date ?? "No due date"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="text-sm font-medium">
                  {viewTask?.assigned_to
                    ? (members.find((m) => m.user_id === viewTask.assigned_to)
                        ?.email ?? "Unknown User")
                    : "Unassigned"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setTaskViewOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}