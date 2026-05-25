"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/useTasks"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"

export default function EventEditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const taskId = searchParams.get("task_id")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [due_date, setDueDate] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Fetch the existing task data on load
  useEffect(() => {
    if (!taskId) return

    async function fetchTask() {
      const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        credentials: "include"
      })

      if (res.ok) {
        const data = await res.json()
        setTitle(data.title)
        setContent(data.content)
        setTag(data.tag)
        setDueDate(data.due_date ?? "")
      }
    }

    fetchTask()
  }, [taskId])

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
      body: JSON.stringify({ title, content, tag, due_date })
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
              ></Textarea>
            </div>

            {/* TODO: Add user customisable tag, then map them.
                In the profile page, there should be an alert dialogue to open all tag hence modifications
            */}
            <div className="grid gap-1.5">
              <Label htmlFor="tag">Tag</Label>
              <Select value={tag} onValueChange={(value) => setTag(value ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tag1">Tag 1</SelectItem>
                  <SelectItem value="tag2">Tag 2</SelectItem>
                  <SelectItem value="tag3">Tag 3</SelectItem>
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

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            <Button
              onClick={handleUpdate}
              className="w-full bg-slate-900 text-white hover:bg-slate-700"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/Dashboard")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}