
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">

      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <div className="space-y-3 p-4">

        {/* Listing type */}
        <Skeleton className="h-3 w-32" />

        {/* Price */}
        <Skeleton className="h-7 w-40" />

        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Location */}
        <Skeleton className="h-4 w-full" />

        {/* Features */}
        <div className="flex gap-4 border-t pt-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>

      </div>
    </div>
  );
}
