import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* The Sidebar Component */}
        <AppSidebar />
        
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {/* Header bar for the toggle button */}
          <header className="flex h-16 items-center border-b bg-white px-6 gap-3">
            <SidebarTrigger />
            <div className="font-semibold text-slate-800">My Workspace</div>
            <a className="font-semibold text-slate-800" href="/Event">Add Event</a>
          </header>
          
          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}