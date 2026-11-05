import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SimilarPropertiesSkeleton() {
  return (
    <section className="space-y-4" aria-hidden="true">
      <Skeleton className="h-6 w-48" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="w-72 shrink-0">
            <PropertyCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
