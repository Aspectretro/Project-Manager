"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/useProjects"
import { useProjectMember } from "@/hooks/useProjectMember"
import { useState } from "react"

type Project = {
  project_id: number
  name: string
  description: string
  created_by: number
  created_by_email: string
  created_at: string
}

// ─── Separate ProjectCard component so each card has its own state ───
function ProjectCard({ project }: { project: Project }) {
  const { members, refetch: refetchMembers } = useProjectMember(project.project_id)
  const [memberOpen, setMemberOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [memberError, setMemberError] = useState("")

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
      setMemberError(data.error)
    }
  }

  async function handle_remove_member(user_id: number) {
    await fetch(
      `http://localhost:5000/projects/${project.project_id}/members/${user_id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
    refetchMembers()
  }

  return (
    <Card className="m-3 w-68">
      <CardHeader>
        {project.name}
        <hr />
      </CardHeader>
      <CardContent>
        <div>{project.description}</div>
        <p className="mt-1 mb-3 text-muted-foreground">
          Created by: {project.created_by_email}
        </p>
        <p className="mt-2 mb-2 tracking-wider">
          Created at: {new Date(project.created_at).toLocaleDateString()}
        </p>
        <p className="mb-2 text-sm text-muted-foreground">
          Members: {members.length}
        </p>

        {/* Project Tasks Dialog */}
        <AlertDialog>
          <div className="flex flex-col">
            <AlertDialogTrigger
              render={<Button className="mb-1 ml-2" variant="outline" />}
            >
              Project Tasks
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent className="sm:max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{project.name}</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Project tasks will be mapped here once wired up */}
            </div>
            <div className="flex justify-end">
              <AlertDialogCancel>Close</AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Manage Members Button */}
        <div className="flex flex-col">
          <Button
            className="mb-1 ml-2"
            variant="outline"
            onClick={() => setMemberOpen(true)}
          >
            Manage Members
          </Button>
        </div>

        {/* Members Dialog */}
        <Dialog open={memberOpen} onOpenChange={setMemberOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Members — {project.name}</DialogTitle>
            </DialogHeader>

            {/* Add member input */}
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
              <p className="text-sm text-red-500">{memberError}</p>
            )}

            {/* Member list */}
            <div className="mt-2 space-y-2">
              {members.map((m) => (
                <div
                  key={m.user_id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm">{m.email}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
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

            <div className="mt-2 flex justify-end">
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

// ─── Main Project Page ───────────────────────────────────────
export default function Project() {
  const { projects, loading, error, refetch } = useProjects()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  async function handle_create_project() {
    if (!name.trim()) return

    await fetch("http://localhost:5000/projects", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })

    setName("")
    setDescription("")
    refetch()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="mt-auto">Projects</CardTitle>

        {/* Create Project Button */}
        <AlertDialog>
          <AlertDialogTrigger render={<Button />}>
            New Project
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Project</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <Label>Project Name</Label>
                <Input
                  placeholder="Project name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label>Description</Label>
                <Input
                  placeholder="Project description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <AlertDialogCancel
                onClick={() => {
                  setName("")
                  setDescription("")
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handle_create_project}>
                Create
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="flex flex-wrap">
        {loading && <p>Loading projects...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {projects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </CardContent>
    </Card>
  )
}