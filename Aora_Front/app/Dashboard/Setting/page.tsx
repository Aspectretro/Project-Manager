"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace preferences and application behavior.</p>
      </div>

      <Separator />

      {/* --- WORKSPACE PREFERENCES --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Workspace</h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Default View</Label>
                <p className="text-sm text-muted-foreground">Choose which screen appears when you first log in.</p>
              </div>
              <Select defaultValue="dashboard">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="tasks">My Tasks</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Week Starts On</Label>
                <p className="text-sm text-muted-foreground">Adjust your calendar and productivity charts.</p>
              </div>
              <Select defaultValue="monday">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- APPEARANCE --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Sidebar Style</Label>
                <p className="text-sm text-muted-foreground">Minimize the sidebar to just icons by default.</p>
              </div>
              <Switch />
            </div>
            
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Show more tasks on the screen at once.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- NOTIFICATIONS --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">App Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="reminders" defaultChecked />
              <Label htmlFor="reminders">Task Reminders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="marketing" />
              <Label htmlFor="marketing">Product Updates & News</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sounds" defaultChecked />
              <Label htmlFor="sounds">Enable Sound Effects</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- DATA MANAGEMENT --- */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-destructive">Purge Data</Label>
              <p className="text-sm text-destructive/80">Permanently delete all tasks and workspace history.</p>
            </div>
            <Button variant="destructive">Clear Everything</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}