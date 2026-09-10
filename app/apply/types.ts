export type ApplicationValues = {
  agencyName: string;
  town: string;
  location: string;
  email: string;
  phone: string;
  instagram: string;
  tiktok: string;
  facebook: string;
};

export type ApplicationState = {
  success: boolean;
  message: string;
  values?: ApplicationValues;
  errors?: {
    agencyName?: string[];
    town?: string[];
    location?: string[];
    email?: string[];
    phone?: string[];
    instagram?: string[];
    tiktok?: string[];
    facebook?: string[];
  };
};