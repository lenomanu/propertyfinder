
"use client";

import { useEffect } from "react";

import type { PropertyResult } from "@/lib/properties/property.types";

type PropertyGridProps = {
  properties: PropertyResult[];
};

export default function PropertyGrid({
  properties,
}: PropertyGridProps) {
  useEffect(() => {
    console.log("[PropertyGrid] Property results:", properties);
    console.log("[PropertyGrid] Total loaded:", properties.length);
  }, [properties]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <div
          key={property.id}
          className="rounded-lg border p-4"
        >
          <h3 className="font-semibold">
            {property.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {property.locality}, {property.nearest_town}
          </p>

          <p className="mt-2 font-medium">
            {property.currency} {property.price.toLocaleString()}
          </p>
        </div>
      ))}

      {properties.length === 0 && (
        <p className="col-span-full py-10 text-center text-muted-foreground">
          No properties found.
        </p>
      )}
    </div>
  );
}
