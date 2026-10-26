import React from 'react'

import PropertyDetails from '../property-details'
import Amenities from '../amenities';

type DetailsProps = {
  propertyId: string;
  propertyType: string;
};

function Details({ propertyId, propertyType }: DetailsProps) {
  return (
    <div>
      <PropertyDetails propertyId={propertyId} />
      
      <Amenities propertyId={propertyId} />
    </div>
  )
}

export default Details
