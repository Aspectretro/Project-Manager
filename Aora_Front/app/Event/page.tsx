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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { se } from "date-fns/locale"


export default function Event() {

  const router = useRouter()
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [due_date, setDue_date] = useState("")
  const [date, setDate] = React.useState<Date>()

  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10)
  })

  async function insertEevent() {

    setError("");
    setSuccess("");

    if (!title) {
      setError("Title is required");
      return;
    }

    const res = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({title, content, tag, due_date})
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess("Task created");
    } else {
      setError(data.error);
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
                  placeholder="Task Name..." />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="content">Task Description/Content</Label>
                  <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Task Description" />
                </div>
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
                      <SelectItem value="tag1">tag 1</SelectItem>
                      <SelectItem value="tag2">tag 2</SelectItem>
                      <SelectItem value="tag3">tag 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant={"outline"}
                          data-empty={!date}
                          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                        >
                          {date ? (
                            format(date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate)
                          setDue_date(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "")
                        }}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-500">{success}</p>}
              <Button
              onClick={insertEevent}
              className="w-full bg-slate-900 text-white hover:bg-slate-700">
                Create
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex lg:[50%] ml-40 items-center justify-center p-12 text-white">
       <Card className="mx-auto w-fit p-0 scale-125">
        <CardContent className="p-5">
          <Calendar

           id="date"
           
           mode="range"
           defaultMonth={range?.from}
           selected={range}
           onSelect={setRange}
           numberOfMonths={1}
           captionLayout="dropdown"
           className="[--cell-size:--spacing(10)] md:[--cell-size--spacing(12)]"
           formatters={{
            formatMonthDropdown: (date) => {
              return date.toLocaleDateString("default", {month:"long"})
            },
           }}
           components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isWeekend = 
               day.date.getDay() === 0 || day.date.getDay() === 6
              
              return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                  {children}
                  {!modifiers.outside && (
                    <span></span>
                  )}
                </CalendarDayButton>
              )
            }
           }}
          />
        </CardContent>
       </Card>
      </div>
    </div>
  )
}
