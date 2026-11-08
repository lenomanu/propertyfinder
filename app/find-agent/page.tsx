import Link from "next/link";
import { ArrowRight, Building2, MapPin, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { getPublicImageUrl } from "@/lib/cloudflare/public-image-url";

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  town?: string | string[];
  agency?: string | string[];
  page?: string | string[];
}>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function imageUrl(path: string | null) {
  if (!path) return null;
  try {
    return getPublicImageUrl(path);
  } catch {
    return null;
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function pageHref(page: number, town: string, agency: string) {
  const params = new URLSearchParams();
  if (town) params.set("town", town);
  if (agency) params.set("agency", agency);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/find-agent?${query}` : "/find-agent";
}

export default async function FindAgentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const town = (firstValue(params.town) ?? "").trim();
  const agency = (firstValue(params.agency) ?? "").trim().slice(0, 80);
  const requestedPage = Number.parseInt(firstValue(params.page) ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;

  const supabase = await createClient();
  const [townResult, agencyResult] = await Promise.all([
    supabase
      .from("agencies")
      .select("town", { count: "exact" })
      .eq("status", "approved")
      .order("town")
      .limit(500),
    (() => {
      let query = supabase
        .from("agencies")
        .select(
          "id,agency_name,town,location,profile_image_url,username",
          { count: "exact" },
        )
        .eq("status", "approved")
        .order("agency_name");

      if (town) query = query.eq("town", town);
      if (agency) {
        const escapedAgency = agency.replace(/[\\%_]/g, "\\$&");
        query = query.ilike("agency_name", `%${escapedAgency}%`);
      }

      return query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    })(),
  ]);

  const towns = Array.from(
    new Set(
      (townResult.data ?? [])
        .map((row) => row.town?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const agencies = agencyResult.data ?? [];
  const total = agencyResult.count ?? 0;
  const approvedCount = townResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (townResult.error) {
    console.error("[FindAgentPage] Could not load agency towns:", townResult.error);
  }
  if (agencyResult.error) {
    console.error("[FindAgentPage] Could not load agencies:", agencyResult.error);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <section className="relative border-b bg-gradient-to-br from-white via-[#f6f4f1] to-[#e8efec] dark:from-background dark:via-background dark:to-primary/10">
        <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:min-h-[460px] md:grid-cols-[1fr_0.85fr] md:py-16 lg:px-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <Users className="size-4" aria-hidden="true" />
              Local property experts across Kenya
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the right agency for your next move.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Explore approved property agencies by town or search by name. Connect directly with a team that knows your area.
            </p>

            <form
              action="/find-agent"
              className="mt-8 flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:rounded-full sm:pl-4"
            >
              <label className="sr-only" htmlFor="agency-town">Town</label>
              <select
                id="agency-town"
                name="town"
                defaultValue={town}
                className="h-11 min-w-0 rounded-xl border-0 bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-44 sm:shrink-0 sm:border-r sm:rounded-none sm:pl-1"
              >
                <option value="">All towns</option>
                {towns.map((townName) => (
                  <option key={townName} value={townName}>{townName}</option>
                ))}
              </select>
              <span className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
              <label className="sr-only" htmlFor="agency-name">Agency name</label>
              <Input
                id="agency-name"
                name="agency"
                defaultValue={agency}
                placeholder="Search by agency name"
                className="h-11 min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              {town || agency ? (
                <Link
                  href="/find-agent"
                  className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Clear
                </Link>
              ) : null}
              <Button type="submit" className="h-11 rounded-xl px-6 sm:rounded-full">
                <Search className="mr-2 size-4" aria-hidden="true" />
                Search
              </Button>
            </form>
          </div>

          <div className="relative hidden h-[360px] md:block" aria-hidden="true">
            <div className="absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-[#f6f4f1] to-transparent dark:from-background" />
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-4 overflow-hidden rounded-[2rem]">
              {Array.from({ length: 6 }, (_, index) => {
                const profile = agencies[index % Math.max(agencies.length, 1)];
                const photo = profile ? imageUrl(profile.profile_image_url) : null;
                const name = profile?.agency_name ?? "Property Team";
                return (
                  <div
                    key={profile ? `${profile.id}-${index}` : index}
                    className={`relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${index % 2 ? "from-primary/25 to-primary/5" : "from-amber-100 to-stone-200 dark:from-primary/20 dark:to-muted"} ${index === 0 || index === 4 ? "translate-y-5" : "-translate-y-5"}`}
                  >
                    {photo ? (
                      <img src={photo} alt="" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-4xl font-semibold text-primary/70">
                        {profile ? initials(name) : <Building2 className="size-12" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="absolute bottom-4 right-4 z-20 rounded-2xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-2xl font-semibold">{approvedCount.toLocaleString()}+</p>
              <p className="text-xs text-muted-foreground">approved agencies</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8" aria-labelledby="agency-results-title">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Find your local team</p>
            <h2 id="agency-results-title" className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {town ? `Agencies in ${town}` : "Explore property agencies"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {agencyResult.error
                ? "Agency listings are temporarily unavailable. Please try again shortly."
                : `${total.toLocaleString()} approved ${total === 1 ? "agency" : "agencies"}${agency ? ` matching “${agency}”` : ""}`}
            </p>
          </div>
          {town || agency ? (
            <Link href="/find-agent" className="text-sm font-medium text-primary hover:underline">
              View all agencies
            </Link>
          ) : null}
        </div>

        {agencyResult.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
            We couldn&apos;t load the agency directory. Please refresh the page to try again.
          </div>
        ) : agencies.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agencies.map((agencyItem) => {
              const photo = imageUrl(agencyItem.profile_image_url);
              const profileHref = agencyItem.username
                ? `/agency/${encodeURIComponent(agencyItem.username)}`
                : null;

              return (
                <article key={agencyItem.id} className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex min-w-0 items-center gap-4">
                    {photo ? (
                      <img src={photo} alt="" className="size-16 shrink-0 rounded-2xl object-cover" />
                    ) : (
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                        {initials(agencyItem.agency_name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold tracking-tight">{agencyItem.agency_name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{[agencyItem.town, agencyItem.location].filter(Boolean).join(" · ")}</span>
                      </p>
                    </div>
                  </div>
                  {profileHref ? (
                    <Button asChild variant="outline" className="mt-5 w-full justify-between rounded-xl">
                      <Link href={profileHref}>
                        View agency <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : (
                    <p className="mt-5 rounded-xl bg-muted px-4 py-2.5 text-center text-sm text-muted-foreground">
                      Agency profile coming soon
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-14 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No agencies found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Try a different town or agency name. Approved agencies will appear here as they join Property Team.
            </p>
          </div>
        )}

        {!agencyResult.error && totalPages > 1 ? (
          <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Agency pages">
            {page > 1 ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={pageHref(page - 1, town, agency)}>Previous</Link>
              </Button>
            ) : null}
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={pageHref(page + 1, town, agency)}>Next</Link>
              </Button>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
