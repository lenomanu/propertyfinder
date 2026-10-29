
"use client";

import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DashboardRole } from "@/lib/dashboard/dashboard-types";

type Props = {
  role: DashboardRole;
  fullName: string | null;
};

export default function DashboardHeader({ role, fullName }: Props) {
  const displayName = fullName?.trim() || "there";

  return (
    <div className="flex w-full flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-indigo-600">
          {role === "admin" ? "Administration" : "Agent workspace"}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {displayName}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {role === "admin"
            ? "Manage properties, agencies and platform activity."
            : "Manage your property listings and agency profile."}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {role === "agent" ? (
          <Link
            href="/agent/agency"
            className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-indigo-400 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
              <Building2 className="size-5" />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-slate-900">
                Edit Agency Profile
              </span>

              <span className="block text-xs text-slate-500">
                Manage your agency details
              </span>
            </span>

            <ArrowRight className="size-4 shrink-0 text-indigo-600" />
          </Link>
        ) : (
          <Button asChild variant="outline">
            <Link href="/admin">
              Dashboard
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
