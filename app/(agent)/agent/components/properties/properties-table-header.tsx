"use client";

import React from "react";

function PropertiesTableHeader() {
  return (
    <div className="grid w-full grid-cols-[2.5fr_1fr_1fr_1.2fr_1fr_1fr_1.5fr_1.2fr] items-center border-b bg-muted/50 px-4 py-3 text-sm font-medium">
      <div className="pr-6">Property Name</div>

      <div className="pr-4">Listing Type</div>

      <div className="pr-4">Property Type</div>

      <div className="pr-4">Locality Name</div>

      <div className="pr-4">City</div>

      <div className="pr-4">Status</div>

      <div className="pr-4">Price</div>

      <div>Agent Name</div>
    </div>
  );
}

export default PropertiesTableHeader;