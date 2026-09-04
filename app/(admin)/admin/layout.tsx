import { ThemeSwitcher } from "@/components/theme-switcher"
import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <section className="flex-1 overflow-y-auto p-6">{children}</section>
        </div>
      </div>
    </ThemeProvider>
  )
}