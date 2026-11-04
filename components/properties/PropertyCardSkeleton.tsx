import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-2 h-3 w-40" />
      <Skeleton className="mb-3 aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-2 h-7 w-36" />
      <Skeleton className="mt-2 h-4 w-48" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1.5 h-4 w-3/4" />
      <Skeleton className="mt-1.5 h-4 w-36" />
    </div>
  );
}
