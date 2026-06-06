import { useState, useEffect } from "react"

type Tag = {
  tag_id: number
  user_id: number
  name: string
  created_at: string
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [err, setError] = useState<string | null>(null)

  async function fetchTags() {
    try {
      const res = await fetch("http://localhost:5000/tags", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setTags(data)
      } else {
        setError("Failed to fetch tags")
      }
    } catch (err) {
      setError("An error occurred while fetching tags")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  
  return { tags, loading, err, fetchTags }
}
