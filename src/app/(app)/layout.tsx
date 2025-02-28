import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggler } from "@/components/ThemeToggler"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <header className="flex items-center justify-between px-2 py-1 border-b sticky top-0 z-10 shadow-sm bg-background">
          <SidebarTrigger />
          <ThemeToggler />
        </header>
        {children}
      </main>
    </SidebarProvider>
  )
}
