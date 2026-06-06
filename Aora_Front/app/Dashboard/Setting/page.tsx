"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTags } from "@/hooks/useTag"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  // Handle Logout
  const router = useRouter()

  async function handleLogout() {
    const res = await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    })

    if (res.ok) {
      router.push("/Auth/Login")
    }
  }

  // Tag Management
  const { tags, fetchTags } = useTags()
  const [newTag, setNewTag] = useState("")
  const [editTag, setEditTag] = useState<{
    tag_id: number
    name: string
  } | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  async function handle_create_tag() {
    if (!newTag.trim()) return
    await fetch("http://localhost:5000/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newTag }),
    })
    setNewTag("")
    setCreateOpen(false)
    fetchTags()
  }

  async function handle_edit_tag() {
    if (!editTag || !editTag.name.trim()) return
    await fetch(`http://localhost:5000/tags/${editTag.tag_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: editTag.name }),
    })
    setEditOpen(false)
    setEditTag(null)
    fetchTags()
  }

  async function handle_delete_tag(tag_id: number) {
    await fetch(`http://localhost:5000/tags/${tag_id}`, {
      method: "DELETE",
      credentials: "include",
    })
    fetchTags()
  }

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your workspace preferences and application behavior.
        </p>
      </div>

      <Separator />

      {/* --- WORKSPACE PREFERENCES --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Default View</Label>
                <p className="text-sm text-muted-foreground">
                  Choose which screen appears when you first log in.
                </p>
              </div>
              <Select defaultValue="dashboard">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="tasks">My Tasks</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Week Starts On</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust your calendar and productivity charts.
                </p>
              </div>
              <Select defaultValue="monday">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- APPEARANCE --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sidebar Style</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize the sidebar to just icons by default.
                </p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show more tasks on the screen at once.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- TAGS --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Tags</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manage Tags</CardTitle>
            <CardDescription>
              Create, rename, or delete your tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tags.map((t) => (
              <div key={t.tag_id} className="flex items-center justify-between">
                <span className="text-sm">{t.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditTag({ tag_id: t.tag_id, name: t.name })
                      setEditOpen(true)
                    }}
                  >
                    Rename
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handle_delete_tag(t.tag_id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              + New Tag
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Create Tag Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Tag name..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handle_create_tag()
            }}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewTag("")
                setCreateOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handle_create_tag}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            value={editTag?.name ?? ""}
            onChange={(e) =>
              setEditTag(editTag ? { ...editTag, name: e.target.value } : null)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handle_edit_tag()
            }}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false)
                setEditTag(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handle_edit_tag}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- NOTIFICATIONS --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">App Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="reminders" defaultChecked />
              <Label htmlFor="reminders">Task Reminders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="marketing" />
              <Label htmlFor="marketing">Product Updates & News</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sounds" defaultChecked />
              <Label htmlFor="sounds">Enable Sound Effects</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- DATA MANAGEMENT --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Clear Zone</h2>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent>
            <div className="m-2 flex items-center">
              <div className="flex-1">
                <Label className="text-base text-destructive">Purge Data</Label>
                <p className="text-sm text-destructive/80">
                  Permanently delete all tasks and workspace history.
                </p>
              </div>
              <Button variant="destructive">Clear Everything</Button>
            </div>
            <div className="m-2 flex items-center">
              <div className="flex-1">
                <Label className="text-base text-destructive">Logout</Label>
                <p className="text-sm text-destructive/80">
                  Log out of the account
                </p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
