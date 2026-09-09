
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { GetRole } from "@/app/auth/get-role-jwt";
import Dashboard from "./components/dashboard";


export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <RoleGate />
    </Suspense>
  );
}

async function RoleGate() {
  const role = await GetRole();

  if (role === "admin") {
    redirect("/admin");
  }
  if(role === 'user'){
    redirect("/");
  }


  return <Dashboard/>;
}
