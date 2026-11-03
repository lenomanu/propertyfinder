
"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

import { propertySearchParams } from "@/lib/properties/property-search-params";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Search() {
  const [filters, setFilters] = useQueryStates(
    propertySearchParams,
    {
      shallow: false,
      history: "replace",
    }
  );

  const [searchInput, setSearchInput] = useState(
    filters.search
  );

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    await setFilters({
      search: searchInput.trim(),
      page: 1,
    });
  }

  async function updateFilter(
    key: string,
    value: string | number | null
  ) {
    await setFilters({
      [key]: value,
      page: 1,
    } as any);
  }

  return (
    <div className="w-full space-y-4">

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 md:flex-row"
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            placeholder="Search by location, price, rooms and more"
            className="h-14 rounded-full pl-12"
          />
        </div>

        <Button
          type="submit"
          className="h-14 rounded-full px-8"
        >
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">

        <Button
          variant="outline"
          size="icon"
          aria-label="Advanced filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* Listing type */}
        <Select
          value={filters.listingType}
          onValueChange={(value) =>
            updateFilter("listingType", value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Listing type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="sale">For sale</SelectItem>
            <SelectItem value="rent">For rent</SelectItem>
          </SelectContent>
        </Select>

        {/* Property type */}
        <Select
          value={filters.propertyType || "all"}
          onValueChange={(value) =>
            updateFilter(
              "propertyType",
              value === "all" ? null : value
            )
          }
        >
          <SelectTrigger className="w-[160px]">
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

        {/* Bedrooms */}
        <Select
          value={filters.bedrooms?.toString() || "any"}
          onValueChange={(value) =>
            updateFilter(
              "bedrooms",
              value === "any" ? null : Number(value)
            )
          }
        >
          <SelectTrigger className="w-[140px]">
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

        {/* Sorting */}
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            updateFilter("sort", value)
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price_asc">
              Price: Low to high
            </SelectItem>
            <SelectItem value="price_desc">
              Price: High to low
            </SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
