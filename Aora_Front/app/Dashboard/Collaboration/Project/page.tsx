"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Project() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-auto">Projects</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap">
        {/* TODO: Project Card. This will be mapped after  
            TODO: Member count constant, define with arrow function
            */}
        <Card className="m-3 w-68">
          <CardHeader>
            Project Title
            <hr />
          </CardHeader>
          <CardContent>
            <div>Project Description</div>
            <p className="mt-1 mb-3 text-muted-foreground">
              Project Desciption
            </p>
            <p className="mt-2 mb-2 tracking-wider">Due Date:</p>
            <p className="mb-2 tracking-wider">Member Count:</p>

            {/* Shove project-related task in here later, displayed as cards */}
            <AlertDialog>
              <div className="flex flex-col">
                <AlertDialogTrigger
                  className=""
                  render={<Button className="mb-1 ml-2" variant="outline" />}
                >
                  Project Task
                </AlertDialogTrigger>
              </div>
              <AlertDialogContent className="sm:max-w-2xl">
                <AlertDialogHeader>The Moola</AlertDialogHeader>
                <div className="flex flex-col gap-4 gap-6 md:flex-row">
                  <Card className="w-[200px]">
                    <CardHeader>
                      <CardTitle>Big dih</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="w-[200px]">
                    <CardHeader>
                      <CardTitle>Small dih</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
