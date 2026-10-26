import { cn } from "@/lib/utils";

type PropertyStatusBadgeProps = {
  status: string;
};

export default function PropertyStatusBadge({
  status,
}: PropertyStatusBadgeProps) {
  const label =
    status === "approved"
      ? "Active"
      : status.charAt(0).toUpperCase() +
        status.slice(1);

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-medium",
        status === "approved" &&
          "bg-green-100 text-green-700",
        status === "pending" &&
          "bg-yellow-100 text-yellow-700",
        status === "draft" &&
          "bg-muted text-muted-foreground",
        status === "rejected" &&
          "bg-red-100 text-red-700",
        status === "sold" &&
          "bg-blue-100 text-blue-700",
        status === "rented" &&
          "bg-blue-100 text-blue-700",
        status === "withdrawn" &&
          "bg-orange-100 text-orange-700",
      )}
    >
      {label}
    </span>
  );
}