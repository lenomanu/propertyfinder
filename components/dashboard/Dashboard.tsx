
import DashboardClient from "./DashboardClient";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import type { DashboardRole } from "@/lib/dashboard/dashboard-types";

export default async function Dashboard({
  role,
}: {
  role: DashboardRole;
}) {
  const data = await getDashboardData(role);

  return <DashboardClient data={data} />;
}
