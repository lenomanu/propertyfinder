import PropertyCard from "@/components/properties/PropertyCard";
import type { PropertyResult } from "@/lib/properties/property.types";

type PropertyGridProps = {
  properties: PropertyResult[];
};

export default function PropertyGrid({ properties }: PropertyGridProps) {
  const imageBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

  if (properties.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        No properties found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          imageBaseUrl={imageBaseUrl}
        />
      ))}
    </div>
  );
}
