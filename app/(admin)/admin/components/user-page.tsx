import { createClient } from "@/lib/supabase/server";
import { UsersManager } from "./user-manager";
import { AppUser } from "../types";


export async function UsersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      "id,email,phone,full_name,avatar_url,agency_id,role,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>

        <p className="text-sm text-muted-foreground">
          Manage application users and their roles.
        </p>
      </div>

      <UsersManager users={(data ?? []) as AppUser[]} />
    </main>
  );
}