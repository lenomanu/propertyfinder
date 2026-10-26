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
};

export type PropertyTableRow = Property & {
  agent_name: string | null;
};

export type PaginatedProperties = {
  properties: PropertyTableRow[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};