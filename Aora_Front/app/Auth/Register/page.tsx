"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const strength = password.length >= 8 ? (/[^A-Za-z0-9]/.test(password) ? 100 : 66) : (password.length > 0 ? 33 : 0);

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
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join our community today.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                  <Progress value={strength} className="h-1 mt-1" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input id="confirm" type="password" placeholder="••••••••" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Get Started</Button>
              <p className="text-sm text-muted-foreground text-center">
                Already a member? <Link href="/Auth/Login" className="text-primary font-medium hover:underline">Login</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE (60%) - Register Specific Content */}
      <div className="hidden lg:flex lg:w-[60%] bg-emerald-900 items-center justify-center p-12 text-white">
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-bold italic tracking-tight">The first step to success.</h2>
          <p className="text-emerald-200 text-lg">Create your free account and start organizing your life in seconds.</p>
          <div className="pt-6 border-t border-emerald-800">
            <p className="italic text-sm text-emerald-300">"The best decision I made for my productivity." — Sarah L.</p>
          </div>
        </div>
      </div>
    </div>
  );
}