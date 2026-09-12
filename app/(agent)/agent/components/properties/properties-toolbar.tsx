"use client";


import { PropertyFilter } from "./filter-properties";
import { PropertySearch } from "./properties-search";
import { PropertySort } from "./property-sort";

export function PropertiesToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left side */}
      <div className="flex flex-wrap items-center gap-2">
        <PropertySearch />

      </div>

      {/* Right side */}
      <div className="flex flex-wrap items-center gap-2">
     
        <PropertyFilter />

        <PropertySort />
      </div>
    </div>
  );
}