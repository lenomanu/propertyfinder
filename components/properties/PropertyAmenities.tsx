import AmenityIcon from "@/components/properties/AmenityIcon";
import {
  getPropertyAmenities,
  type PropertyAmenity,
} from "@/lib/properties/property";

export default async function PropertyAmenities({
  propertyId,
}: {
  propertyId: string;
}) {
  const amenities = await getPropertyAmenities(propertyId);

  if (amenities.length === 0) return null;

  const inside = amenities.filter((amenity) => amenity.placement === "internal");
  const outside = amenities.filter((amenity) => amenity.placement === "external");

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Amenities</h2>
      {inside.length > 0 && <AmenityGroup title="Inside" amenities={inside} />}
      {outside.length > 0 && (
        <AmenityGroup title="Outside" amenities={outside} />
      )}
    </section>
  );
}

function AmenityGroup({
  title,
  amenities,
}: {
  title: string;
  amenities: PropertyAmenity[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => (
          <li key={amenity.name}>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border px-2.5 py-2 marker:hidden hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <AmenityIcon name={amenity.icon} />
                </span>
                <span className="truncate text-sm font-medium">{amenity.name}</span>
              </summary>
              {amenity.description && (
                <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 w-max max-w-64 rounded-md bg-popover px-3 py-2 text-sm leading-5 text-popover-foreground opacity-0 shadow-md ring-1 ring-border transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 group-open:opacity-100">
                  {amenity.description}
                </span>
              )}
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
