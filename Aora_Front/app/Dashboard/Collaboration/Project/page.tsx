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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/useProjects"
import ProjectCard from "@/components/Project/ProjectCard"  // import here
import { useState } from "react"

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