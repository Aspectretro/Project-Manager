import { useEffect, useState } from "react"

type Project = {
  project_id: number
  name: string
  description: string
  created_by: number
  created_at: string
  created_by_email: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProjects() {
    try {
      const res = await fetch("http://localhost:5000/projects", {
        credentials: "include",
      })

      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      } else {
        setError("Failed to fetch projects")
      }
    } catch {
      setError("No Projects Found")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return { projects, loading, error, refetch: fetchProjects }
}
