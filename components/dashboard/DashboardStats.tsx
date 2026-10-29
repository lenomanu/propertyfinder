
"use client";

import {
  Building2,
  CheckCircle2,
  Clock3,
  FileWarning,
  House,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type {
  DashboardFilter,
  DashboardRole,
  DashboardStatsData,
} from "@/lib/dashboard/dashboard-types";

type Props = {
  stats: DashboardStatsData;
  role: DashboardRole;
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
};

const propertyCards = [
  {
    key: "all",
    label: "Total properties",
    value: (s: DashboardStatsData) => s.totalProperties,
    icon: House,
    color: "text-indigo-700",
    iconBg: "bg-indigo-100",
    border: "border-indigo-200",
    active: "ring-indigo-400",
    description: "All your listings",
  },
  {
    key: "pending",
    label: "Pending",
    value: (s: DashboardStatsData) => s.pendingProperties,
    icon: Clock3,
    color: "text-amber-700",
    iconBg: "bg-amber-100",
    border: "border-amber-200",
    active: "ring-amber-400",
    description: "Awaiting review",
  },
  {
    key: "approved",
    label: "Approved",
    value: (s: DashboardStatsData) => s.approvedProperties,
    icon: CheckCircle2,
    color: "text-emerald-700",
    iconBg: "bg-emerald-100",
    border: "border-emerald-200",
    active: "ring-emerald-400",
    description: "Approved listings",
  },
  {
    key: "rejected",
    label: "Rejected",
    value: (s: DashboardStatsData) => s.rejectedProperties,
    icon: FileWarning,
    color: "text-rose-700",
    iconBg: "bg-rose-100",
    border: "border-rose-200",
    active: "ring-rose-400",
    description: "Need attention",
  },
  {
    key: "draft",
    label: "Drafts",
    value: (s: DashboardStatsData) => s.draftProperties,
    icon: Building2,
    color: "text-sky-700",
    iconBg: "bg-sky-100",
    border: "border-sky-200",
    active: "ring-sky-400",
    description: "Not yet submitted",
  },
] as const;

export default function DashboardStats({
  stats,
  role,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
          {role === "admin" ? "Platform statistics" : "Your properties"}
        </h2>

        <span className="text-xs text-slate-400">
          Click a card to filter
        </span>
      </div>

      {/* Property statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {propertyCards.map((card) => {
          const Icon = card.icon;
          const active = activeFilter === card.key;

          return (
            <button
              key={card.key}
              type="button"
              aria-pressed={active}
              onClick={() =>
                onFilterChange(
                  active ? "all" : (card.key as DashboardFilter),
                )
              }
              className="min-w-0 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Card
                className={`h-full border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  card.border
                } ${active ? `ring-2 ${card.active} shadow-sm` : ""}`}
              >
                <CardContent className="flex items-start justify-between gap-2 p-3 sm:p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-4 text-slate-500 sm:text-sm">
                      {card.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {card.value(stats).toLocaleString()}
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-slate-500 sm:text-xs">
                      {card.description}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg p-2 ${card.iconBg} ${card.color}`}
                  >
                    <Icon className="size-4 sm:size-5" />
                  </span>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Admin-only statistics: always displayed in one row */}
      {role === "admin" && (
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-violet-200 bg-violet-50/50 transition hover:shadow-sm">
            <CardContent className="flex items-center gap-3 p-3 sm:p-4">
              <span className="shrink-0 rounded-lg bg-violet-100 p-2 text-violet-700">
                <Users className="size-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-medium text-violet-800 sm:text-sm">
                  Registered users
                </p>

                <p className="mt-1 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                  {(stats.totalUsers ?? 0).toLocaleString()}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Platform accounts
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-fuchsia-200 bg-fuchsia-50/50 transition hover:shadow-sm">
            <CardContent className="flex items-center gap-3 p-3 sm:p-4">
              <span className="shrink-0 rounded-lg bg-fuchsia-100 p-2 text-fuchsia-700">
                <Building2 className="size-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-medium text-fuchsia-800 sm:text-sm">
                  Pending agencies
                </p>

                <p className="mt-1 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                  {(stats.pendingAgencies ?? 0).toLocaleString()}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Applications to review
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
