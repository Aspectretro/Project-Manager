"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const features = [
  {
    title: "Task Management",
    description:
      "Create, organise, and track tasks with due dates, tags, and descriptions — all in one place.",
  },
  {
    title: "Clean Dashboard",
    description:
      "See everything at a glance. Your tasks, progress, and deadlines without the noise.",
  },
  {
    title: "Built for Focus",
    description:
      "No clutter. No distractions. Just you and what needs to get done.",
  },
]

const steps = [
  {
    number: "01",
    title: "Create an account",
    description: "Sign up in seconds with just your email.",
  },
  {
    number: "02",
    title: "Add your tasks",
    description: "Fill in a title, description, tag, and due date.",
  },
  {
    number: "03",
    title: "Stay on track",
    description: "View and manage everything from your dashboard.",
  },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.style.opacity = "0"
    el.style.transform = "translateY(24px)"
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease"
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center">
            <img src="/Aora.png" className="border-2 border-solid" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Aora</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Link href="/Auth/Login">Login</Link>
          </Button>
          <Button size="sm">
            <Link href="/Auth/Register">Sign up</Link>
          </Button>
        </div>
      </nav>

      {/* HERO */}
      {/* TODO: add a banner image as background */}
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-20 text-center">
        <div ref={heroRef}>
          <Badge className="mb-8 text-xs tracking-widest uppercase">
            Task & Project Management
          </Badge>

          <h1 className="mb-6 text-5xl leading-tight font-normal tracking-tight sm:text-6xl">
            Everything you need
            <br />
            <em className="text-muted-foreground italic">
              to get things done.
            </em>
          </h1>

          <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-muted-foreground">
            Aora helps you capture tasks, set deadlines, and stay focused —
            without the complexity of tools you&apos;ll never fully use.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg">
              <Link href="/Auth/Register">Get started</Link>
            </Button>
            <Button size="lg" variant="outline">
              <Link href="/Auth/Login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        <Separator />
      </div>

      {/* FEATURES */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-10 text-xs tracking-widest text-muted-foreground uppercase">
          What you get
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Separator className="mb-5 w-8" />
                <h3 className="mb-2 text-base font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6">
        <Separator />
      </div>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="mb-10 text-xs tracking-widest text-muted-foreground uppercase">
          How it works
        </p>
        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="grid grid-cols-[60px_1fr] items-start gap-4 py-6">
                <span className="pt-1 text-xs tracking-widest text-muted-foreground">
                  {s.number}
                </span>
                <div>
                  <h3 className="mb-1 text-base font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-foreground px-6 py-24 text-center text-background">
        <h2 className="mb-4 text-4xl font-normal tracking-tight">
          Ready to get organised?
        </h2>
        <p className="mb-8 text-base leading-relaxed opacity-60">
          Sign up in seconds. No credit card required.
        </p>
        <Button size="lg" variant="secondary">
          <Link href="/Auth/Register">Create your account</Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-background px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-xs text-background">
            ✔
          </div>
          <span className="text-sm font-semibold">Aora</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aora. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
