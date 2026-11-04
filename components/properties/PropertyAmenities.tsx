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
      <ul className="grid gap-3 sm:grid-cols-2">
        {amenities.map((amenity) => (
          <li
            key={amenity.name}
            className="flex gap-3 rounded-lg border p-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <AmenityIcon name={amenity.icon} />
            </span>
            <div className="min-w-0">
              <p className="font-medium">{amenity.name}</p>
              {amenity.description && (
                <p className="text-sm leading-5 text-muted-foreground">
                  {amenity.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
