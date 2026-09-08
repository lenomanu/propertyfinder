import { createClient } from "@/lib/supabase/server";
import { AgenciesManager } from "./agency-manager";
import { Agency } from "./agency-types";


const PAGE_SIZE = 20;

type Props = {
  // NOTE: on Next.js 15+, searchParams is a Promise and needs
  // `const params = await searchParams;` below instead of using
  // it directly. Adjust this line for your Next.js version.
  searchParams?: {
    page?: string;
    search?: string;
  };
};

export async function AgenciesPage({
  searchParams,
}: Props) {
  const page = Math.max(
    1,
    Number(searchParams?.page) || 1
  );

  const search =
    searchParams?.search?.trim() ?? "";

  const supabase = await createClient();

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("agency")
    .select(
      "id,user_id,agency_name,town,location,email,phone,instagram,tiktok,facebook,status,rejection_reason,reviewed_by,reviewed_at,created_at,updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  // Only filter by name when the admin has typed something —
  // this keeps the default "browse everything" view untouched.
  if (search) {
    query = query.ilike(
      "agency_name",
      `%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load agencies: {error.message}
      </div>
    );
  }

  const totalPages = Math.max(
    1,
    Math.ceil((count ?? 0) / PAGE_SIZE)
  );

  return (
    <main className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Agencies</h1>

        <p className="text-sm text-muted-foreground">
          Review agency applications and manage their status.
        </p>
      </div>

      <AgenciesManager
        agencies={(data ?? []) as Agency[]}
        page={page}
        totalPages={totalPages}
        search={search}
      />
    </main>
  );
}