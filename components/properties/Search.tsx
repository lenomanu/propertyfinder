"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryStates } from "nuqs";
import { ChevronDown, Search as SearchIcon, SlidersHorizontal } from "lucide-react";

import {
  LAND_SIZE_PRESETS,
  listingTypeParser,
  propertySearchParams,
  type ListingType,
} from "@/lib/properties/property-search-params";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function parsePriceInput(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;

  const amount = Number(digits);
  if (!Number.isSafeInteger(amount)) return null;

  return amount;
}

function activeFilterClass(active: boolean) {
  if (!active) return undefined;

  return "border-primary bg-primary/10 font-medium text-primary hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25";
}

const LOCALITY_PRESET_COUNT = 5;

function formatPriceLabel(minPrice: number | null, maxPrice: number | null) {
  const format = (amount: number) => amount.toLocaleString();

  if (minPrice !== null && maxPrice !== null) {
    return `${format(minPrice)} – ${format(maxPrice)}`;
  }

  if (minPrice !== null) return `From ${format(minPrice)}`;
  if (maxPrice !== null) return `Up to ${format(maxPrice)}`;

  return "Price";
}

export default function Search({
  localities,
  defaultListingType = "sale",
}: {
  localities: string[];
  defaultListingType?: ListingType;
}) {
  const searchParams = useMemo(
    () => ({
      ...propertySearchParams,
      listingType: listingTypeParser(defaultListingType),
    }),
    [defaultListingType]
  );

  const [filters, setFilters] = useQueryStates(searchParams, {
    shallow: false,
    history: "replace",
  });

  const [searchInput, setSearchInput] = useState(filters.search);
  const [priceOpen, setPriceOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(
    filters.minPrice?.toString() ?? ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.maxPrice?.toString() ?? ""
  );
  const [localityOpen, setLocalityOpen] = useState(false);
  const [localityQuery, setLocalityQuery] = useState("");

  const isLandType =
    filters.propertyType === "land" || filters.propertyType === "plot";

  useEffect(() => {
    setMinPriceInput(filters.minPrice?.toString() ?? "");
    setMaxPriceInput(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    await setFilters({
      search: searchInput.trim(),
      page: 1,
    });
  }

  async function updateFilter(key: string, value: string | number | null) {
    await setFilters({
      [key]: value,
      page: 1,
    } as Parameters<typeof setFilters>[0]);
  }

  function resetPriceDraft() {
    setMinPriceInput(filters.minPrice?.toString() ?? "");
    setMaxPriceInput(filters.maxPrice?.toString() ?? "");
  }

  async function applyPrice() {
    let minPrice = parsePriceInput(minPriceInput);
    let maxPrice = parsePriceInput(maxPriceInput);

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    setMinPriceInput(minPrice?.toString() ?? "");
    setMaxPriceInput(maxPrice?.toString() ?? "");
    setPriceOpen(false);

    if (minPrice === filters.minPrice && maxPrice === filters.maxPrice) {
      return;
    }

    await setFilters({
      minPrice,
      maxPrice,
      page: 1,
    });
  }

  async function clearPrice() {
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceOpen(false);

    if (filters.minPrice === null && filters.maxPrice === null) return;

    await setFilters({
      minPrice: null,
      maxPrice: null,
      page: 1,
    });
  }

  const priceLabel = formatPriceLabel(filters.minPrice, filters.maxPrice);
  const priceActive = filters.minPrice !== null || filters.maxPrice !== null;
  const listingTypeActive = filters.listingType !== defaultListingType;
  const propertyTypeActive = Boolean(filters.propertyType);
  const landSizeActive = filters.minLandSize !== null;
  const localityActive = Boolean(filters.locality);
  const bedroomsActive = filters.bedrooms !== null;
  const bathroomsActive = filters.bathrooms !== null;
  const sortActive = filters.sort !== "newest";
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    listingTypeActive ||
    propertyTypeActive ||
    priceActive ||
    landSizeActive ||
    localityActive ||
    bedroomsActive ||
    bathroomsActive ||
    sortActive;

  const localityMatches = localityQuery.trim()
    ? localities.filter((name) =>
        name.toLowerCase().includes(localityQuery.trim().toLowerCase())
      )
    : localities.slice(0, LOCALITY_PRESET_COUNT);

  async function resetAll() {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceOpen(false);
    setLocalityOpen(false);
    setLocalityQuery("");

    await setFilters({
      search: "",
      listingType: defaultListingType,
      propertyType: null,
      minPrice: null,
      maxPrice: null,
      minLandSize: null,
      locality: null,
      bedrooms: null,
      bathrooms: null,
      sort: "newest",
      page: 1,
    });
  }

  async function selectLocality(locality: string | null) {
    setLocalityOpen(false);
    setLocalityQuery("");

    if (locality === filters.locality) return;

    await setFilters({
      locality,
      page: 1,
    });
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by location, price, rooms and more"
            className="h-14 rounded-full pl-12"
          />
        </div>

        <Button type="submit" className="h-14 rounded-full px-8">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" aria-label="Advanced filters">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        <Select
          value={filters.listingType}
          onValueChange={(value) => updateFilter("listingType", value)}
        >
          <SelectTrigger className={`w-[140px] ${activeFilterClass(listingTypeActive) ?? ""}`}>
            <SelectValue placeholder="Listing type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="sale">For sale</SelectItem>
            <SelectItem value="rent">For rent</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.propertyType || "all"}
          onValueChange={(value) => {
            const propertyType = value === "all" ? null : value;
            const nextIsLand = propertyType === "land" || propertyType === "plot";

            void setFilters({
              propertyType,
              minLandSize: nextIsLand ? filters.minLandSize : null,
              bedrooms: nextIsLand ? null : filters.bedrooms,
              bathrooms: nextIsLand ? null : filters.bathrooms,
              page: 1,
            });
          }}
        >
          <SelectTrigger className={`w-[160px] ${activeFilterClass(propertyTypeActive) ?? ""}`}>
            <SelectValue placeholder="Property type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All properties</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="plot">Plot</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu
          open={localityOpen}
          onOpenChange={(open) => {
            setLocalityOpen(open);
            if (!open) setLocalityQuery("");
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={`h-9 min-w-[140px] max-w-[200px] justify-between px-3 font-normal ${activeFilterClass(localityActive) ?? ""}`}
              aria-label="Filter by locality"
            >
              <span className={localityActive ? "truncate" : "truncate text-muted-foreground"}>
                {filters.locality || "Locality"}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-64 p-2"
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <div className="space-y-2" onKeyDown={(event) => event.stopPropagation()}>
              <Input
                value={localityQuery}
                onChange={(event) => setLocalityQuery(event.target.value)}
                placeholder="Search localities"
                aria-label="Search localities"
                autoFocus
              />

              <div className="max-h-64 overflow-y-auto">
                <button
                  type="button"
                  className="flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                  onClick={() => void selectLocality(null)}
                >
                  Any locality
                </button>

                {localityMatches.length === 0 ? (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground">No localities found</p>
                ) : (
                  localityMatches.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`flex w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent ${
                        filters.locality === name ? "bg-accent font-medium" : ""
                      }`}
                      onClick={() => void selectLocality(name)}
                    >
                      {name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu
          open={priceOpen}
          onOpenChange={(open) => {
            setPriceOpen(open);
            if (open) resetPriceDraft();
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={`h-9 min-w-[140px] justify-between px-3 font-normal ${activeFilterClass(priceActive) ?? ""}`}
              aria-label="Filter by price"
            >
              <span className={priceActive ? undefined : "text-muted-foreground"}>
                {priceLabel}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-72 p-3"
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void applyPrice();
              }}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="min-price">Min price</Label>
                  <Input
                    id="min-price"
                    inputMode="numeric"
                    placeholder="No min"
                    value={minPriceInput}
                    onChange={(event) =>
                      setMinPriceInput(event.target.value.replace(/[^\d]/g, ""))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="max-price">Max price</Label>
                  <Input
                    id="max-price"
                    inputMode="numeric"
                    placeholder="No max"
                    value={maxPriceInput}
                    onChange={(event) =>
                      setMaxPriceInput(event.target.value.replace(/[^\d]/g, ""))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => void clearPrice()}>
                  Clear
                </Button>
                <Button type="submit" size="sm">
                  Apply
                </Button>
              </div>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>

        {isLandType ? (
          <Select
            value={filters.minLandSize ?? "any"}
            onValueChange={(value) =>
              updateFilter("minLandSize", value === "any" ? null : value)
            }
          >
            <SelectTrigger
              className={`w-[150px] ${activeFilterClass(landSizeActive) ?? ""}`}
              aria-label="Land size"
            >
              <SelectValue placeholder="Land size" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="any">Any size</SelectItem>
              {LAND_SIZE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {isLandType ? null : (
          <Select
            value={filters.bedrooms?.toString() || "any"}
            onValueChange={(value) =>
              updateFilter("bedrooms", value === "any" ? null : Number(value))
            }
          >
            <SelectTrigger className={`w-[140px] ${activeFilterClass(bedroomsActive) ?? ""}`}>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="any">Any bedrooms</SelectItem>
              <SelectItem value="1">1+ bedroom</SelectItem>
              <SelectItem value="2">2+ bedrooms</SelectItem>
              <SelectItem value="3">3+ bedrooms</SelectItem>
              <SelectItem value="4">4+ bedrooms</SelectItem>
              <SelectItem value="5">5+ bedrooms</SelectItem>
            </SelectContent>
          </Select>
        )}

        {isLandType ? null : (
          <Select
            value={filters.bathrooms?.toString() || "any"}
            onValueChange={(value) =>
              updateFilter("bathrooms", value === "any" ? null : Number(value))
            }
          >
            <SelectTrigger className={`w-[150px] ${activeFilterClass(bathroomsActive) ?? ""}`}>
              <SelectValue placeholder="Bathrooms" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="any">Any bathrooms</SelectItem>
              <SelectItem value="1">1+ bathroom</SelectItem>
              <SelectItem value="2">2+ bathrooms</SelectItem>
              <SelectItem value="3">3+ bathrooms</SelectItem>
              <SelectItem value="4">4+ bathrooms</SelectItem>
              <SelectItem value="5">5+ bathrooms</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className={`w-[150px] ${activeFilterClass(sortActive) ?? ""}`}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price_asc">Price: Low to high</SelectItem>
            <SelectItem value="price_desc">Price: High to low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters ? (
          <Button type="button" variant="ghost" onClick={() => void resetAll()}>
            Reset all
          </Button>
        ) : null}
      </div>
    </div>
  );
}
