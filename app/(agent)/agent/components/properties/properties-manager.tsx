"use client";

import React from "react";

import PropertiesRow from "./properties-table-row";

import { PaginatedProperties } from "../../properties/property";

type PropertiesManagerProps = {
  initialData: PaginatedProperties;
};

function PropertiesManager({
  initialData,
}: PropertiesManagerProps) {
  return (
    <div className="h-full w-full min-w-0 overflow-hidden rounded-md border">
      <div className="h-full w-full overflow-x-auto overflow-y-auto">
        <div className="min-w-[1100px]">
          <PropertiesRow properties={initialData.properties} />
        </div>
      </div>
    </div>
  );
}

export default PropertiesManager;