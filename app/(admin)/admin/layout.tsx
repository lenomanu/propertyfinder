import { Suspense } from "react"
import { redirect } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/app/(admin)/admin/components/admin-sidebar"
import { GetRole } from "@/app/auth/get-role-jwt"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminGuard>{children}</AdminGuard>
      </Suspense>
    </ThemeProvider>
  )
}

async function AdminGuard({ children }: { children: React.ReactNode }) {
  const role = await GetRole()

  if (role !== "admin") {
    redirect("/") // or "/unauthorized"
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <section className="flex-1 overflow-y-auto p-6">{children}</section>
      </div>
    </div>
  )
}