"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTags } from "@/hooks/useTag"

export default function EventEditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get("task_id")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")  // Changed from tags to tag for selected value
  const [due_date, setDueDate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [newTag, setNewTag] = useState("")

  // Fetch tags from your tag hook
  const { tags, fetchTags } = useTags()

  // Fetch the existing task data on load
  useEffect(() => {
    if (!taskId) return

    async function fetchTask() {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setTitle(data.title || "")
        setContent(data.content || "")
        setTag(data.tag || "")  // Set the selected tag
        setDueDate(data.due_date ?? "")
      }
    }

    fetchTask()
    fetchTags() // Fetch available tags
  }, [taskId, fetchTags])

  async function createTag() {
    if (!newTag.trim()) return
    await fetch("http://localhost:5000/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newTag }),
    })
    setNewTag("")
    setCreateOpen(false)
    fetchTags() // Refresh tags list
  }

  async function handleUpdate() {
    setError("")
    setSuccess("")

    if (!title) {
      setError("Title is required")
      return
    }

    const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, tag, due_date }), // Send single tag, not array
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("Task updated!")
      setTimeout(() => router.push("/Dashboard"), 1500)
    } else {
      setError(data.error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title ?? ""}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-1.5">
              <Label htmlFor="content">Description</Label>
              <Textarea
                id="content"
                value={content ?? ""}
                placeholder="Task description"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Fixed Tag Section */}
            <div className="grid gap-1.5">
              <Label htmlFor="tags">Tag</Label>
              <Select
                value={tag}
                onValueChange={(value) => setTag(value ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((t) => (
                    <SelectItem key={t.tag_id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                  <hr className="my-1 border-t" />
                  <div
                    className="flex cursor-pointer items-center justify-center p-2 text-sm text-slate-500 hover:bg-slate-100"
                    onClick={() => setCreateOpen(true)}
                  >
                    + Create New Tag
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={due_date ?? ""}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-500">{error}</p>
            )}
            {success && (
              <p className="text-center text-sm text-green-600">{success}</p>
            )}

            <Button
              onClick={handleUpdate}
              className="w-full bg-slate-900 text-white hover:bg-slate-700"
            >
              Save Changes
            </Button>
            
            <Button variant="outline" onClick={() => router.push("/Dashboard")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create New Tag Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createTag()
              }
            }}
            placeholder="Enter tag name"
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={createTag}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}