"use client";

import PropertyImageUploader from "../PropertyImageUploader";



export default function PropertyImages({
  propertyId,
}: {
  propertyId: string;
}) {
  return <PropertyImageUploader propertyId={propertyId} />;
}