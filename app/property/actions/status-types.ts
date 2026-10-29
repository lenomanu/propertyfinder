
export type PropertyStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "rented"
  | "withdrawn";

export type UserRole = "admin" | "agent" | "user";

export const ALL_PROPERTY_STATUSES: PropertyStatus[] = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "sold",
  "rented",
  "withdrawn",
];

export const AGENT_EDITABLE_STATUSES: PropertyStatus[] = [
  "draft",
  "sold",
  "rented",
  "withdrawn",
];

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  draft: "Draft",
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
  sold: "Sold",
  rented: "Rented",
  withdrawn: "Withdrawn",
};

export const STATUS_STYLES: Record<PropertyStatus, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-700",
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  approved: "border-emerald-300 bg-emerald-100 text-emerald-800",
  rejected: "border-red-300 bg-red-100 text-red-800",
  sold: "border-blue-300 bg-blue-100 text-blue-800",
  rented: "border-violet-300 bg-violet-100 text-violet-800",
  withdrawn: "border-orange-300 bg-orange-100 text-orange-800",
};

export function isPropertyStatus(
  value: unknown,
): value is PropertyStatus {
  return (
    typeof value === "string" &&
    ALL_PROPERTY_STATUSES.includes(value as PropertyStatus)
  );
}
