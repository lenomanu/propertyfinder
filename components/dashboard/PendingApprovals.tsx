
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  ClipboardCheck,
  House,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardStatsData } from "@/lib/dashboard/dashboard-types";

export default function PendingApprovals({
  stats,
}: {
  stats: DashboardStatsData;
}) {
  const items = [
    {
      label: "Property listings",
      count: stats.pendingProperties,
      href: "/admin/approvals",
      icon: House,
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Agency applications",
      count: stats.pendingAgencies ?? 0,
      href: "/admin/agencies",
      icon: Building2,
      color: "bg-violet-100 text-violet-700",
    },
  ];

  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="overflow-hidden border-amber-200 shadow-sm">
      <CardHeader className="border-b border-amber-100 bg-amber-50/70">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="size-5 text-amber-700" />
            Pending approvals
          </CardTitle>

          <span className="rounded-full bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900">
            {total}
          </span>
        </div>

        <p className="text-sm text-slate-600">
          Items requiring administrator review.
        </p>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-amber-200 hover:bg-amber-50/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className={`rounded-lg p-2 ${item.color}`}>
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
              </div>

              <span className="text-lg font-bold text-slate-900">
                {item.count}
              </span>
            </Link>
          );
        })}

        {total === 0 ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
            Everything is up to date. No approvals are currently pending.
          </p>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <Clock3 className="size-4" />
            Some applications may need your attention.
          </div>
        )}

        <Button asChild variant="outline" className="w-full justify-between">
          <Link href="/admin/approvals">
            Open approval queue
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
