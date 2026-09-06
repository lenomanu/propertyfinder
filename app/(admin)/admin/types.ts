export type UserRole = "user" | "admin" | "agent";

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