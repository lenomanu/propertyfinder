export type UserRole = "user" | "admin"| "agent";

export type AppUser = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  agency_id: string | null;
  role: UserRole;
  created_at: string;
};

export type PropertyType =
  | "house"
  | "apartment"
  | "land"
  | "commercial";

export type ListingType = "sale" | "rent";

export type Currency = "KES" | "USD";

export type PricePeriod =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export type AreaUnit =
  | "sqm"
  | "sqft"
  | "acre"
  | "hectare";

export type LandType =
  | "residential"
  | "commercial";

export type Amenity =
  | "Alarm System"
  | "Backup Generator"
  | "En-Suite Bathroom"
  | "Fibre Internet"
  | "Serviced"
  | "Balcony"
  | "Borehole"
  | "CCTV"
  | "Garden"
  | "Gym"
  | "Lift/Elevator"
  | "Parking";

export interface ResidentialDetails {
  bedrooms: number | null;
  bathrooms: number | null;
  carPorts: number | null;
  floorArea: number | null;
  floorAreaUnit: AreaUnit | null;
  landSize: number | null;
  landSizeUnit: AreaUnit | null;
}

export interface LandDetails {
  landType: LandType | null;
  landSize: number | null;
  landSizeUnit: AreaUnit | null;
}

export interface CommercialDetails {
  floorArea: number | null;
  floorAreaUnit: AreaUnit | null;
  landSize: number | null;
  landSizeUnit: AreaUnit | null;
}
export type PropertyStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "rented";

export type BasicProperty = {
  id: string;
  user_id: string | null;
  agency_id: string | null;
  slug: string;
  title: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  price_period: PricePeriod | null;
  currency: Currency;
  description: string | null;
  locality: string;
  nearest_town: string | null;
  county: string | null;
  latitude: number | null;
  longitude: number | null;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
};

