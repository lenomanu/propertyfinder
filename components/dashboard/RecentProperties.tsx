
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Search,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  DashboardFilter,
  DashboardProperty,
  DashboardRole,
} from "@/lib/dashboard/dashboard-types";

type Props = {
  properties: DashboardProperty[];
  role: DashboardRole;
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
};

type StatusFilter =
  | "all"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "rented"
  | "withdrawn";

type SortOption = "newest" | "oldest" | "price-high" | "price-low";

const statusStyles: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  sold: "bg-blue-100 text-blue-800",
  rented: "bg-violet-100 text-violet-800",
  withdrawn: "bg-gray-100 text-gray-700",
};

function formatPrice(price: number | string, currency: string) {
  const amount = Number(price);
  const code = currency || "KES";

  if (!Number.isFinite(amount)) return `${code} ${price}`;

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString()}`;
  }
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function RecentProperties({
  properties,
  role,
  activeFilter,
  onFilterChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    return properties
      .filter((property) => {
        const matchesSearch =
          !query ||
          property.title?.toLowerCase().includes(query) ||
          property.locality?.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" || property.status === statusFilter;

        const matchesActiveFilter =
          activeFilter === "all" || property.status === activeFilter;

        return matchesSearch && matchesStatus && matchesActiveFilter;
      })
      .sort((a, b) => {
        if (sort === "newest") {
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        }

        if (sort === "oldest") {
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          );
        }

        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        return sort === "price-high"
          ? priceB - priceA
          : priceA - priceB;
      });
  }, [properties, search, statusFilter, activeFilter, sort]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setSort("newest");
    onFilterChange("all");
  }

  return (
    <Card className="w-full min-w-0 overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="space-y-3 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Building2 className="size-4 text-indigo-600" />
              Recent Properties
            </CardTitle>

            <p className="mt-0.5 text-xs text-slate-500">
              {filteredProperties.length} of {properties.length} properties
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link
              href={role === "admin" ? "/admin/properties" : "/agent/properties"}
            >
              View all
              <ArrowUpRight className="ml-1 size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(160px,1fr)_150px_150px]">
          <div className="relative min-w-0">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search properties..."
              aria-label="Search properties"
              className="h-8 pl-8 text-xs"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as StatusFilter)
            }
          >
            <SelectTrigger className="h-8 text-xs" aria-label="Filter status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortOption)}
          >
            <SelectTrigger className="h-8 text-xs" aria-label="Sort properties">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="price-high">Highest price</SelectItem>
              <SelectItem value="price-low">Lowest price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredProperties.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Building2 className="mx-auto size-6 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">
              No properties found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try changing your search or filters.
            </p>

            {(search || statusFilter !== "all" || activeFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8 text-xs"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[760px]">
              {/* Compact column headings */}
              <div className="grid grid-cols-[minmax(220px,1fr)_130px_105px_95px_145px_28px] items-center gap-3 border-y border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Property</span>
                <span>Locality</span>
                <span>Created</span>
                <span>Status</span>
                <span className="text-right">Price</span>
                <span />
              </div>

              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/property/${property.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${property.title} in a new tab`}
                  className="group grid grid-cols-[minmax(220px,1fr)_130px_105px_95px_145px_28px] items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-xs transition-colors last:border-b-0 hover:bg-indigo-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                >
                  {/* Property title */}
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
                      <Building2 className="size-4" />
                    </span>

                    <span className="truncate font-semibold text-slate-800 group-hover:text-indigo-700">
                      {property.title}
                    </span>
                  </div>

                  {/* Locality */}
                  <span className="truncate text-slate-600">
                    {property.locality || "Not specified"}
                  </span>

                  {/* Date */}
                  <span className="inline-flex items-center gap-1 whitespace-nowrap text-slate-500">
                    <CalendarDays className="size-3.5 shrink-0" />
                    {formatDate(property.created_at)}
                  </span>

                  {/* Status */}
                  <span>
                    <span
                      className={`inline-flex max-w-full truncate rounded-full px-2 py-1 text-[10px] font-medium capitalize ${
                        statusStyles[property.status] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </span>

                  {/* Price */}
                  <span className="truncate text-right font-semibold tabular-nums text-slate-900">
                    {formatPrice(property.price, property.currency)}
                  </span>

                  {/* Open in new tab */}
                  <span className="flex justify-end text-slate-400 transition-colors group-hover:text-indigo-600">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
