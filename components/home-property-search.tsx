"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

type SearchMode = "sale" | "rent" | "sold";

const modes: { id: SearchMode; label: string }[] = [
  { id: "sale", label: "Buy" },
  { id: "rent", label: "Rent" },
  { id: "sold", label: "Sold" },
];

function parseHomeSearch(input: string, knownLocalities: string[]) {
  const normalized = input.trim().replace(/\s+/g, " ");
  const bedrooms = normalized.match(/\b(\d+)\s*(?:bed(?:room)?s?)\b/i)?.[1];
  const bathrooms = normalized.match(/\b(\d+)\s*(?:bath(?:room)?s?)\b/i)?.[1];
  const locationNames = [...new Set([
    ...knownLocalities,
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kiambu", "Thika",
    "Kilimani", "Westlands", "Karen", "Runda", "Lavington", "Kileleshwa",
    "Ruiru", "Naivasha", "Nyali",
  ])].sort((a, b) => b.length - a.length);
  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const localityMatch = locationNames.find((name) =>
    new RegExp(`(?:\\b(?:in|at|near|around)\\s+)?${escapeRegex(name)}$`, "i").test(normalized),
  );
  const location = localityMatch
    ?? normalized.match(/\b(?:in|at|near|around)\s+(.+)$/i)?.[1]?.trim();
  const textWithoutLocation = location
    ? normalized.replace(new RegExp(`(?:\\b(?:in|at|near|around)\\s+)?${escapeRegex(location)}$`, "i"), " ")
    : normalized.replace(/\b(?:in|at|near|around)\s+.+$/i, " ");
  const propertyType = textWithoutLocation.match(/\b(house|apartment|land|plot|villa|office|warehouse)\b/i)?.[1]?.toLowerCase();
  const leftover = textWithoutLocation
    .replace(/\b\d+\s*(?:bed(?:room)?s?|bath(?:room)?s?)\b/gi, " ")
    .replace(/\b(?:to\s+rent|for\s+rent|rent(?:al)?|for\s+sale|to\s+buy|buy|sale|sold|bedrooms?|bathrooms?|property|properties|house|apartment|land|plot|villa|office|warehouse)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { bedrooms, bathrooms, location, propertyType, search: leftover };
}

export default function HomePropertySearch({ localities }: { localities: string[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("sale");
  const [query, setQuery] = useState("");

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseHomeSearch(query, localities);
    const submittedIntent = query.toLowerCase();
    const effectiveMode: SearchMode = /\b(sold|recently sold)\b/.test(submittedIntent)
      ? "sold"
      : /\b(to rent|for rent|rent)\b/.test(submittedIntent)
        ? "rent"
        : /\b(for sale|to buy|buy)\b/.test(submittedIntent)
          ? "sale"
          : mode;
    const route = effectiveMode === "sold" ? "sold" : effectiveMode === "rent" ? "rent" : "sale";
    const params = new URLSearchParams();

    if (effectiveMode !== "sold") params.set("listingType", effectiveMode);
    if (parsed.bedrooms) params.set("bedrooms", parsed.bedrooms);
    if (parsed.bathrooms) params.set("bathrooms", parsed.bathrooms);
    if (parsed.propertyType) params.set("propertyType", parsed.propertyType);
    if (parsed.search) params.set("search", parsed.search);
    params.set("page", "1");

    const locationPath = parsed.location
      ? `/${encodeURIComponent(parsed.location.toLowerCase().replace(/\s+/g, "-"))}`
      : "";
    router.push(`/properties-for-${route}${locationPath}?${params.toString()}`);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-2xl backdrop-blur-md">
      <div className="flex border-b border-white/15 px-4 sm:px-7">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            aria-pressed={mode === item.id}
            className={`relative px-5 py-4 text-sm font-semibold transition sm:px-7 ${mode === item.id ? "text-white" : "text-white/65 hover:text-white"}`}
          >
            {item.label}
            {mode === item.id ? <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-teal-400" /> : null}
          </button>
        ))}
      </div>
      <form onSubmit={submitSearch} className="p-4 sm:p-7">
        <label htmlFor="home-property-search" className="mb-3 block text-sm font-semibold text-white">
        Search property in Kenya
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              id="home-property-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try ‘2 bedroom to rent in Kilimani’"
              className="h-14 w-full rounded-xl border-0 bg-white pl-12 pr-4 text-base text-slate-950 outline-none ring-teal-400 transition placeholder:text-slate-500 focus:ring-2"
            />
          </div>
          <button type="submit" className="h-14 rounded-xl bg-teal-400 px-8 font-semibold text-slate-950 transition hover:bg-teal-300">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
