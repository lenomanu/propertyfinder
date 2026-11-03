
import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";

type Props = {
  count?: number;
};

export default function PropertyGridSkeleton({
  count = 8,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
