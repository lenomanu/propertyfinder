import { Skeleton } from "@/components/ui/skeleton";
import PropertyGridSkeleton from "@/components/properties/PropertyGridSkeleton";

export default function AgencyProfileLoading() {
  return (
    <main className="container mx-auto space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full sm:size-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-64 max-w-full" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
        </div>
        <Skeleton className="mt-5 h-10 w-64 max-w-full" />
      </section>
      <div className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-14 flex-1 rounded-full" />
        <Skeleton className="h-14 w-28 rounded-full" />
      </div>
      <PropertyGridSkeleton showHeader count={8} />
    </main>
  );
}
