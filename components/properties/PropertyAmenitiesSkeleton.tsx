import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyAmenitiesSkeleton() {
  return (
    <section className="space-y-4" aria-hidden="true">
      <Skeleton className="h-6 w-32" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex gap-3 rounded-lg border p-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
