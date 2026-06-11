"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { useRouter } from "next/navigation"
import { useTasks } from "@/hooks/useTasks"
import { useTags } from "@/hooks/useTag"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Event() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [due_date, setDue_date] = useState("")
  const [selectedDate, setSelectedDate] = React.useState<Date>()

  // Fetch tags for dropdown
  const { tags, fetchTags } = useTags()
  const [newTag, setNewTag] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

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
    fetchTags()
  }

  const { tasks } = useTasks()
  const taskDates = tasks
    .filter((task) => task.due_date)
    .map((task) => new Date(task.due_date))

  // Remove the range state since we're using single date selection
  // const [range, setRange] = React.useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 11, 8),
  //   to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  // })

  async function insertEvent() {
    setError("")
    setSuccess("")

    if (!title || !selectedDate) {
      setError("Required fields are missing")
      return
    }

    const res = await fetch("http://localhost:5000/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content, tag, due_date }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("Task created")
      // Reset form after successful creation
      setTitle("")
      setContent("")
      setTag("")
      setSelectedDate(undefined)
      setDue_date("")
    } else {
      setError(data.error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setDue_date(format(date, "yyyy-MM-dd"))
    } else {
      setDue_date("")
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="overflow:hidden relative flex w-full items-center justify-center lg:w-[50%]">
        <div className="absolute inset-0 -z-10">
          <img
            src="/Event.jpg"
            alt="Card Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-20 bg-slate-50" />
        </div>

        <div className="z-10 px-4">
          <Card className="w-[350px] border-white/20 bg-white/90 shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">New Task</CardTitle>
              <CardDescription>Creating a new task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Name..."
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="content">Task Description/Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Task Description"
                  />
                </div>

                {/* Tag selection */}
                <div className="grid gap-1.5">
                  <Label htmlFor="tags">Tag</Label>

                  <Select
                    value={tag}
                    onValueChange={(value) => setTag(value ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tags" />
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

                {/* Date display - shows selected date from the calendar */}
                <div className="grid gap-1.5">
                  <Label>Due Date</Label>
                  <div className="rounded-md border p-2 text-sm">
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span className="text-muted-foreground">
                        Select a date from the calendar on the right
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={insertEvent}
                className="w-[80%] bg-slate-800 text-white hover:bg-slate-700"
              >
                Create Task
              </Button>

              <Button
                onClick={() => router.push("/Dashboard")}
                className="w-[80%] bg-mist-800 text-white hover:bg-mist-700"
              >
                Return to dashboard
              </Button>
            </CardFooter>

            {/* Success/Error Dialog */}
            {(error || success) && (
              <AlertDialog open={!!(error || success)}>
                <AlertDialogContent>
                  <AlertDialogTitle>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && (
                      <p className="text-sm text-green-500">{success}</p>
                    )}
                  </AlertDialogTitle>
                  <AlertDialogCancel onClick={() => {
                    setError("")
                    setSuccess("")
                  }}>
                    Close
                  </AlertDialogCancel>
                  {success && (
                    <AlertDialogAction onClick={() => router.push("/Dashboard")}>
                      Return to Dashboard
                    </AlertDialogAction>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            )}
          </Card>
        </div>
      </div>

      {/* Calendar on the right - now used as the date selector */}
      <div className="lg:w-[50%] hidden items-center justify-center p-12 text-white lg:flex">
        <Card className="mx-auto w-fit scale-125 p-0">
          <CardContent className="p-5">
            <Calendar
              id="date"
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              defaultMonth={selectedDate || new Date()}
              numberOfMonths={1}
              captionLayout="dropdown"
              modifiers={{ hasTask: taskDates }}
              modifiersClassNames={{
                hasTask: "bg-slate-900 text-white rounded-full",
                selected: "bg-slate-800 text-white",
              }}
              className="md:[--cell-size--spacing(12)] [--cell-size:--spacing(10)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleDateString("default", { month: "long" })
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const isWeekend =
                    day.date.getDay() === 0 || day.date.getDay() === 6

                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                    >
                      {children}
                      {!modifiers.outside && <span></span>}
                    </CalendarDayButton>
                  )
                },
              }}
            />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {selectedDate ? (
                <p>Selected: {format(selectedDate, "PPP")}</p>
              ) : (
                <p>Click on a date to select it</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}