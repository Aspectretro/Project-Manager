"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type InboxItem = {
  id: number
  user_id: number
  project_id: number | null
  message: string
  created_at: string
  is_read: number
}

export default function Inbox() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadInbox = async () => {
    try {
      const res = await fetch("http://localhost:5000/inbox", {
        credentials: "include",
      })
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error("Failed to load inbox:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/inbox/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      })
      await loadInbox()
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  useEffect(() => {
    loadInbox()
  }, [])

  if (loading) {
    return <div className="p-6">Loading inbox...</div>
  }

  if (items.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
          </CardHeader>
          <CardContent>Your inbox is empty.</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Inbox</h1>

      {items.map((item) => {
        const isRead = Boolean(item.is_read)

        return (
          <Card
            key={item.id}
            className={isRead ? "opacity-70" : "border-blue-500"}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-medium">
                {item.message}
              </CardTitle>

              {!isRead && (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button size="sm" variant="outline">
                        Mark as read
                      </Button>
                    }
                  />

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as read?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark this inbox item as read. You can still
                        see it here, but it will no longer be highlighted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => markAsRead(item.id)}>
                        Mark as read
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardHeader>

            <CardContent>
              <p className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
                {item.project_id && (
                  <span className="ml-2">· Project #{item.project_id}</span>
                )}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
