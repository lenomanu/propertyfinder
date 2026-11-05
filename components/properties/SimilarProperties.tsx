import PropertyCard from "@/components/properties/PropertyCard";
import {
  getSimilarProperties,
  type SimilarPropertySource,
} from "@/lib/properties/similar-properties";

export default async function SimilarProperties({
  property,
}: {
  property: SimilarPropertySource;
}) {
  const properties = await getSimilarProperties(property);

  if (properties.length === 0) return null;

  const imageBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Similar properties</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {properties.map((item) => (
          <div key={item.id} className="w-72 shrink-0">
            <PropertyCard property={item} imageBaseUrl={imageBaseUrl} />
          </div>
        ))}
      </div>
    </section>
  );
}
