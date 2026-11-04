export type ApplicationValues = {
  agencyName: string;
  username: string;
  town: string;
  location: string;
  email: string;
  phone: string;
  instagram: string;
  tiktok: string;
  facebook: string;
};

export type AgencyApplication = {
  agency_name: string;
  username: string | null;
  status: string;
  rejection_reason: string | null;
};

export type UsernameCheck =
  | { status: "available" }
  | { status: "taken" | "invalid" | "error"; message: string };

export type ApplicationState = {
  success: boolean;
  message: string;
  values?: ApplicationValues;
  errors?: {
    agencyName?: string[];
    username?: string[];
    town?: string[];
    location?: string[];
    email?: string[];
    phone?: string[];
    instagram?: string[];
    tiktok?: string[];
    facebook?: string[];
  };
};