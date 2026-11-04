import PropertyGridSkeleton from "@/components/properties/PropertyGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesForSaleLoading() {
  return (
    <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Skeleton className="h-14 flex-1 rounded-full" />
          <Skeleton className="h-14 w-28 rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-[140px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>

      <PropertyGridSkeleton showHeader count={8} />
    </main>
  );
}
