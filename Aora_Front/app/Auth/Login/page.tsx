"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassowrd] = useState("")
  const [error, setError] = useState("")

  async function handle_login() {
    setError("")

    if (!email || !password) {
      setError("Both fields are required")
      return
    }

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push("/Dashboard")
    } else {
      setError(data.error)
      setEmail("")
      setPassowrd("")
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE (40%) */}
      <div className="relative flex w-full items-center justify-center overflow-hidden lg:w-[40%]">
        <div className="absolute inset-0 -z-10">
          <img
            src="/Sidebox.jpg"
            alt="Background"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 -z-20 bg-slate-50" />
        </div>

        <div className="z-10 px-4">
          <Card className="w-[350px] border-white/20 bg-white/90 shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Log in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email ?? ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password ?? ""}
                    onChange={(e) => setPassowrd(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handle_login()
                      }
                    }}
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={handle_login}
                className="w-full bg-slate-900 text-white hover:bg-slate-800"
              >
                Login
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/Auth/Register"
                  className="font-medium text-primary hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE (60%) - Login Specific Content */}
      <div className="hidden items-center justify-center bg-emerald-800 p-12 text-white lg:flex lg:w-[60%]">
        <div className="max-w-md space-y-4">
          <div className="justify-ceter flex flex-col items-center gap-4">
            <img src="/Login.jpg" className="w-[50%] rounded-[20px]" />
          </div>
          <div className="ml-[1.5rem]">
            <h2 className="text-4xl font-bold tracking-tight italic">
              Focus on what's hard.
            </h2>
            <p className="text-lg text-emerald-200">
              Pick up exactly where you left off.{" "}
            </p>
            <div className="border-t border-emerald-800 pt-6">
              <p className="text-sm text-emerald-300 italic">
                "What's due tomorrow, do tommorow." — Array U.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
