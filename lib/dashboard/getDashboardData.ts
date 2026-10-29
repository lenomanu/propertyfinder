
import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./getCurrentUser";
import type {
  DashboardData,
  DashboardRole,
  DashboardProperty,
} from "./dashboard-types";

export async function getDashboardData(
  expectedRole: DashboardRole,
): Promise<DashboardData> {
  const currentUser = await getCurrentUser(expectedRole);
  const supabase = await createClient();
  const isAdmin = currentUser.role === "admin";

  function scopeProperties(query: any) {
    if (isAdmin) return query;

    if (currentUser.agencyId) {
      return query.or(
        `user_id.eq.${currentUser.id},agency_id.eq.${currentUser.agencyId}`,
      );
    }

    return query.eq("user_id", currentUser.id);
  }

  async function countProperties(status?: string) {
    let query = supabase
      .from("properties")
      .select("id", { count: "exact", head: true });

    query = scopeProperties(query);

    if (status) query = query.eq("status", status);

    const { count, error } = await query;

    if (error) {
      console.error("Dashboard property count error:", error);
      throw new Error("Unable to load property statistics.");
    }

    return count ?? 0;
  }

  const [
    totalProperties,
    pendingProperties,
    approvedProperties,
    rejectedProperties,
    draftProperties,
    usersResult,
    agenciesResult,
    recentResult,
  ] = await Promise.all([
    countProperties(),
    countProperties("pending"),
    countProperties("approved"),
    countProperties("rejected"),
    countProperties("draft"),

    isAdmin
      ? supabase.from("users").select("id", {
          count: "exact",
          head: true,
        })
      : Promise.resolve({ count: null, error: null }),

    isAdmin
      ? supabase
          .from("agencies")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending")
      : Promise.resolve({ count: null, error: null }),

    (() => {
      let query = supabase
        .from("properties")
        .select(
          "id, title, status, price, currency, locality, created_at",
        );

      query = scopeProperties(query);

      return query
        .order("created_at", { ascending: false })
        .limit(50);
    })(),
  ]);

  if (usersResult.error || agenciesResult.error || recentResult.error) {
    console.error("Dashboard data error:", {
      users: usersResult.error,
      agencies: agenciesResult.error,
      properties: recentResult.error,
    });

    throw new Error("Unable to load dashboard data.");
  }

  let agency: DashboardData["agency"] = null;

  if (!isAdmin) {
    let query = supabase
      .from("agencies")
      .select("id, agency_name, status, rejection_reason");

    query = currentUser.agencyId
      ? query.eq("id", currentUser.agencyId)
      : query.eq("user_id", currentUser.id);

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Dashboard agency error:", error);
      throw new Error("Unable to load agency information.");
    }

    agency = data;
  }

  const recentProperties: DashboardProperty[] = (
    recentResult.data ?? []
  ).map((property) => ({
    ...property,
    price: Number(property.price),
    currency: property.currency || "KES",
  }));

  return {
    role: currentUser.role,
    fullName: currentUser.fullName,

    stats: {
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      draftProperties,
      totalUsers: isAdmin ? usersResult.count ?? 0 : null,
      pendingAgencies: isAdmin ? agenciesResult.count ?? 0 : null,
    },

    recentProperties,
    agency,
  };
}
