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
import { GoTasklist } from "react-icons/go"
import { AiOutlineProject } from "react-icons/ai"

const items = [
  { title: "Home", url: "/Dashboard", icon: Home },
  { title: "Inbox", url: "/Dashboard/Inbox", icon: Inbox },
  { title: "Calendar", url: "/Dashboard/Calendar", icon: Calendar },
]

export function AppSidebar() {
  const { user, loading } = useUser()
  const router = useRouter()

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

      {/* Main Dashboard */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<a href={item.url} />}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Task */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="/Dashboard/Task" />}>
                  <GoTasklist />
                  <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                    Task
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>

        {/* Collaboration */}
        <SidebarGroup>
          <SidebarGroupLabel>Collaboration</SidebarGroupLabel>
          <SidebarContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<a href="/Dashboard/Collaboration/Project" />}
                >
                  <AiOutlineProject />
                  <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                    Project
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>

        {/* Pushed to bottom using mt-auto */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/Dashboard/Setting" />}>
                <Settings />
                <span className="transition-all duration-200 group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton
          render={<a href="/Dashboard/Profile" onClick={profileClick} />}
          className="w-full"
        >
          <User className="h-4 w-4" />
          <span className="truncate text-xs font-medium transition-all duration-200 group-data-[collapsible=icon]:hidden">
            {loading ? "Loading..." : user ? user.email : "Not logged in"}
          </span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
