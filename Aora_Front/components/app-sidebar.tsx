"use client"

import { Calendar, Home, Inbox, Search, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Home", url: "/Dashboard", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
]

export function AppSidebar() {

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="rounded bg-slate-900 p-1 text-white">✔</div>
          <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
            Aora
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Pushed to bottom using mt-auto */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <a href="/Dashboard/Setting">
                  <Settings />
                  <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                    Settings
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton className="w-full justify-start gap-2">
          <a href="/Dashboard/Profile">
            <User className="h-4 w-4" />
            <span className="truncate text-xs font-medium transition-all duration-200 group-data-[collapsible=icon]:hidden">
              email
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
