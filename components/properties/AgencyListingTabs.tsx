"use client";

import { useQueryStates } from "nuqs";
import { parseAsStringLiteral } from "nuqs/server";

import { propertySearchParams } from "@/lib/properties/property-search-params";

const agencyListingParams = {
  status: parseAsStringLiteral(["approved", "sold"] as const).withDefault(
    "approved"
  ),
  page: propertySearchParams.page,
};

export default function AgencyListingTabs() {
  const [{ status }, setParams] = useQueryStates(agencyListingParams, {
    shallow: false,
    history: "push",
  });

  async function selectStatus(nextStatus: "approved" | "sold") {
    if (nextStatus === status) return;
    await setParams({ status: nextStatus, page: 1 });
  }

  return (
    <div
      className="inline-flex rounded-full border bg-muted/50 p-1"
      role="tablist"
      aria-label="Agency property status"
    >
      {([
        ["approved", "Available"],
        ["sold", "Sold"],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={status === value}
          onClick={() => selectStatus(value)}
          className={
            status === value
              ? "rounded-full bg-background px-4 py-2 text-sm font-medium shadow-sm"
              : "rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
