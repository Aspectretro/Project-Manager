"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE (40%) */}
      <div className="relative flex w-full lg:w-[40%] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/Sidebox.jpg" alt="Background" className="h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-slate-50 -z-20" />
        </div>

        <div className="z-10 px-4">
          <Card className="w-[350px] shadow-2xl bg-white/90 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Log in to your account to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Login</Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account? <Link href="/Auth/Register" className="text-primary font-medium hover:underline">Register</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE (60%) - Login Specific Content */}
      <div className="hidden lg:flex lg:w-[60%] bg-blue-900 items-center justify-center p-12 text-white">
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-bold italic tracking-tight">Focus on what matters.</h2>
          <p className="text-blue-200 text-lg">Pick up exactly where you left off. Your tasks are waiting for you.</p>
          <div className="pt-6 border-t border-blue-800">
            <p className="italic text-sm text-blue-300">"This app helps me clear my head every morning." — Mark T.</p>
          </div>
        </div>
      </div>
    </div>
  );
}