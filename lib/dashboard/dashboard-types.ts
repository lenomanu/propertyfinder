
export type DashboardRole = "admin" | "agent";

export type PropertyStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "rented"
  | "withdrawn";

export type DashboardFilter = "all" | PropertyStatus;

export type DashboardStatsData = {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  draftProperties: number;
  totalUsers: number | null;
  pendingAgencies: number | null;
};

export type DashboardProperty = {
  id: string;
  title: string;
  status: string;
  price: number;
  currency: string;
  locality: string;
  created_at: string;
};

export type DashboardAgency = {
  id: string;
  agency_name: string;
  status: string;
  rejection_reason: string | null;
} | null;

export type DashboardUser = {
  id: string;
  role: DashboardRole;
  fullName: string;
  agencyId: string | null;
};

export type DashboardData = {
  role: DashboardRole;
  fullName: string;
  stats: DashboardStatsData;
  recentProperties: DashboardProperty[];
  agency: DashboardAgency;
};
