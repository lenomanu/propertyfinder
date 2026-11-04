import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  count?: number;
  showHeader?: boolean;
};

export default function PropertyGridSkeleton({
  count = 8,
  showHeader = false,
}: Props) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div>
          <Skeleton className="h-7 w-52" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
