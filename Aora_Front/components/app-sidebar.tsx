"use client"

import { Calendar, Home, Inbox, Settings, User } from "lucide-react"
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
import { useUser } from "@/hooks/useUser"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTasks } from "@/hooks/useTasks"

const items = [
  { title: "Home", url: "/Dashboard", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
]

export function AppSidebar() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { tasks } = useTasks()

  function profileClick(e: React.MouseEvent) {
    e.preventDefault()
    if (!user) {
      router.push("/Auth/Login")
    } else {
      router.push("/Dashboard/Profile")
    }
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <img src="/Aora.png" className="w-[30%] border-2 border-solid" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <a href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <item.icon />
                        </div>
                        <span className="ml-2 transition-all duration-200 group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </a>
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
        <SidebarMenuButton className="w-full">
          <a
            href="/Dashboard/Profile"
            onClick={profileClick}
            className="flex w-full items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="truncate text-xs font-medium transition-all duration-200 group-data-[collapsible=icon]:hidden">
              {loading ? "Loading..." : user ? user.email : "Not logged in"}
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
