import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Event() {
    return(
        <div className="flex min-h-screen w-full">
            <div className="relative flex w-full lg:w-[40%] items-center justify-center overflow:hidden">
                <div className="absolute inset-0 -z-10">
                    <img src="/Event.jpg" alt="Card Background" className="h-full w-full object-cover"/>
                    <div className="absolute inset-0 bg-slate-50 -z-20" />
                </div>

                <div className="z-10 px-4">
                    <Card className="w-[350px] shadow-2xl bg-white/90 backdrop-blur-md border-white/20">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">New Event</CardTitle>
                            <CardDescription>Creating a new event</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" placeholder="Event Name..." />
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}