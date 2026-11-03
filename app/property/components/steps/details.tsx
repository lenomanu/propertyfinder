import React from "react";

import PropertyDetails from "../property-details";
import Amenities from "../amenities";
import LandDetails from "../land-details";

type DetailsProps = {
  propertyId: string;
  propertyType: string;
};

function Details({ propertyId, propertyType }: DetailsProps) {
  const isLandProperty = ["land", "plot"].includes(
    propertyType.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {isLandProperty ? (
        <LandDetails propertyId={propertyId} />
      ) : (
        <PropertyDetails propertyId={propertyId} />
      )}

      <Amenities propertyId={propertyId} />
    </div>
  );
}

export default Details;