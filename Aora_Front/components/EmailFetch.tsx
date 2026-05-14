import { useEffect, useState } from 'react'

interface user {
  id: string
  email: string
}

const getEmail = () => {
  const [email, setEmail] = useState<user | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEmail() {
      try {
        const response = await fetch("/Backend/user.db")
        const data = await response.json()
        setEmail(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchEmail()
  }, [])

  if (loading) return <div>Loading...</div>
  return <div>{email?.name}</div>
}

export default getEmail()