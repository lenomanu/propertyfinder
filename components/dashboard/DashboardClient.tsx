
"use client";

import { useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentProperties from "@/components/dashboard/RecentProperties";
import PendingApprovals from "@/components/dashboard/PendingApprovals";
import AgencyStatusCard from "@/components/dashboard/AgencyStatusCard";

import type {
  DashboardData,
  DashboardFilter,
} from "@/lib/dashboard/dashboard-types";

type Props = {
  data: DashboardData;
};

export default function DashboardClient({ data }: Props) {
  const [filter, setFilter] = useState<DashboardFilter>("all");

  return (
    <div className="w-full min-w-0 space-y-6">
      <DashboardHeader
        role={data.role}
        fullName={data.fullName}
      />

      <DashboardStats
        stats={data.stats}
        role={data.role}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

  

      {/* Recent properties uses the full available page width */}
      <div className="w-full min-w-0">
        <RecentProperties
          properties={data.recentProperties}
          role={data.role}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {data.role === "admin" && (
        <PendingApprovals stats={data.stats} />
      )}

    </div>
  );
}
