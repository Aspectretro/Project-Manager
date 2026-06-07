import { useState, useEffect } from "react"

type Task = {
  task_id: number
  title: string
  content: string
  tag: string
  due_date: string
  assigned_to: number
}

export function useProjectTasks(project_id: number) {
  const [projectTasks, setProjectTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [ProjectError, setError] = useState<string | null>(null)

  async function fetchProjectTasks() {
    try {
      const res = await fetch(
        `http://localhost:5000/projects/${project_id}/tasks`,
        { credentials: "include" }
      )
      if (res.ok) {
        const data = await res.json()
        setProjectTasks(data)
      } else {
        setError("Could not fetch project tasks")
      }
    } catch {
      setError("Could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (project_id) fetchProjectTasks()
  }, [project_id])

  return { projectTasks, loading, ProjectError, refetch: fetchProjectTasks }
}