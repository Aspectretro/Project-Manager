import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, LogIn, UserPlus, Settings, Home } from "lucide-react";

export default function DevLandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Home size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl">Project Dev Hub</CardTitle>
          <CardDescription>
            Quick access to all active routes in the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/Auth/Login">
                <LogIn size={20} />
                Login
              </Link>
            </Button>
            
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <Link href="/Auth/Register">
                <UserPlus size={20} />
                Register
              </Link>
            </Button>
          </div>

          <Button size="lg" className="w-full h-16 flex gap-3 text-lg">
            <Link href="/Dashboard">
              <LayoutDashboard size={24} />
              Go to Dashboard
            </Link>
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Internal Tools</span>
            </div>
          </div>

          <Button variant="ghost" className="w-full justify-start gap-2">
            <Link href="/dashboard/settings">
              <Settings size={18} />
              Settings Page
            </Link>
          </Button>

        </CardContent>
        <footer className="p-6 pt-0 text-center">
          <p className="text-xs text-slate-400">
            Current Environment: <span className="text-emerald-600 font-mono">Development</span>
          </p>
        </footer>
      </Card>
    </div>
  );
}