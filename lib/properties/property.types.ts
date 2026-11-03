
export type PropertyDetails = {
  id: string;
  land_size: number | null;
  land_size_unit: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  car_ports: number | null;
  floor_area: number | null;
  floor_area_unit: string | null;
  floors: number | null;
  year_built: number | null;
  furnished: boolean | null;
};

export type LandDetails = {
  id: string;
  land_size: number | null;
  land_size_unit: string | null;
  land_use: "residential" | "commercial" | null;
};

export type PropertyImage = {
  storage_path: string;
};

export type Property = {
  id: string;
  user_id: string | null;
  agency_id: string | null;
  slug: string;
  title: string;
  property_type: string;
  listing_type: string;
  price: number;
  price_period: string | null;
  currency: string;
  description: string | null;
  locality: string;
  nearest_town: string | null;
  county: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  property_details: PropertyDetails | null;
  land_details: LandDetails | null;
  property_images: PropertyImage[];
};

export type PropertyResult = Omit<Property, "property_images"> & {
  images: string[];
};

export type FetchResult = {
  success: boolean;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  properties: PropertyResult[];
  error?: string;
  city?: string;
};

export type PropertyPagination = {
  page?: number;
  pageSize?: number;
};