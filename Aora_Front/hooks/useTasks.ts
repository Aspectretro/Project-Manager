import { useEffect, useState } from "react"

type Task = {
  task_id: number
  title: string
  content: string
  tag: string
  due_date: string
  created_date: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchTasks() {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      } else {
        setError("Failed to fetch tasks")
      }
    } catch (error) {
      setError("Could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, loading, error, refetch: fetchTasks };
}