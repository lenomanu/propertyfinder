"use client";

import React from "react";
import PropertiesTableHeader from "./properties-table-header";

type Property = {
  id: string;
  title: string;
  listing_type: string;
  property_type: string;
  locality: string;
  nearest_town: string | null;
  status: string;
  price: number | null;
  currency: string;
  price_period: string | null;
  agent_name: string | null;
};

type PropertiesRowProps = {
  properties: Property[];
};

function PropertiesRow({ properties }: PropertiesRowProps) {
  const handlePropertyClick = (propertyId: string) => {
    window.open(`/property/${propertyId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full">
      {/* TABLE HEADER */}
      <PropertiesTableHeader />

      {/* TABLE ROWS */}
      {properties.map((property) => (
        <div
          key={property.id}
          onClick={() => handlePropertyClick(property.id)}
          className="grid cursor-pointer grid-cols-[2.5fr_1fr_1fr_1.2fr_1fr_1fr_1.5fr_1.2fr] items-center border-b px-4 py-3 text-sm transition-colors hover:bg-muted/50"
        >
          <div className="pr-6 font-medium">
            <span className="line-clamp-2">{property.title}</span>
          </div>

          <div className="pr-4 capitalize">
            {property.listing_type}
          </div>

          <div className="pr-4 capitalize">
            {property.property_type}
          </div>

          <div className="pr-4">
            {property.locality}
          </div>

          <div className="pr-4">
            {property.nearest_town ?? "-"}
          </div>

          <div className="pr-4 capitalize">
            {property.status}
          </div>

          <div className="pr-4 whitespace-nowrap">
            {property.price !== null
              ? `${property.currency} ${property.price.toLocaleString()}${
                  property.price_period
                    ? ` / ${property.price_period}`
                    : ""
                }`
              : "-"}
          </div>

          <div>
            {property.agent_name ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertiesRow;