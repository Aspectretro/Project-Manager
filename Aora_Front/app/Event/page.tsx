"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import { type Daterange } from "react-day-picker"
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


export default function Event() {

  const [date, setDate] = React.useState<Date>()

  const [range, setRange] = React.useState<Daterange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10)
  })

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
                  <Input id="title" type="text" placeholder="Task Name..." />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="content">Task Description</Label>
                  <Textarea id="content" placeholder="Task Description" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tags">Tag</Label>
                  <Select>
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
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-700">
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
