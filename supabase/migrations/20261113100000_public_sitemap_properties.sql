-- Sitemap generation runs server-side with the publishable key and no user
-- session (anon). RLS on public.properties hides listing rows from anon, so
-- property detail and city URLs never appeared in /sitemap.xml. This function
-- returns only public listing identifiers for SEO.

create or replace function public.get_public_sitemap_properties()
returns table (
  slug text,
  locality text,
  property_status text,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    btrim(p.slug) as slug,
    nullif(btrim(p.locality), '') as locality,
    p.status::text as property_status,
    p.updated_at
  from public.properties p
  where p.status in ('approved', 'sold')
    and p.slug is not null
    and btrim(p.slug) <> '';
$$;

revoke all on function public.get_public_sitemap_properties() from public;
grant execute on function public.get_public_sitemap_properties() to anon;
grant execute on function public.get_public_sitemap_properties() to authenticated;
