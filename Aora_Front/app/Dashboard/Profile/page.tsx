"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/useUser"
import { useTasks } from "@/hooks/useTasks"
import { useState, useEffect } from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function profile() {
  const { user } = useUser()
  const { tasks, loading: Taskloading } = useTasks()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState()
  const [user_id, setUserId] = useState<number | null>(null)

  useEffect(() => {
    fetch("http://localhost:5000/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserId(data.user_id))
  }, [])

  async function handle_edit() {
    const res = await fetch("http://localhost:5000/users/${user?.user_id}", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      // Handle successful update
    } else {
      setError(data.message)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      {/* Cards for profile */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Personal Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">Email</div>
          <p className="mb-2 text-xs text-muted-foreground">{user?.email}</p>
          <div className="text-sm font-bold">Password</div>
          <p className="mb-2 text-xs text-muted-foreground">********</p>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Edit Details
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Edit Details</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="grid w-full items-center gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handle_edit}>
                  Save Changes
                </AlertDialogAction>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="felx-row flex items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Task Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">Total Tasks</div>
          <p className="text-xs text-muted-foreground">{tasks.length} tasks</p>
        </CardContent>
      </Card>

      {/* Complete this card display after completing the collaboration feature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            Project/Task Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">Project Count</div>
          <p className="text-xs text-muted-foreground">COLLABOARATION FEATURE CURRENTLY UNDER CONSTRUCTION</p>
        </CardContent>
      </Card>
    </div>
  )
}
