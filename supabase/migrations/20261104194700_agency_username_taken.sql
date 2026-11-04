-- Lets the apply form see whether a username is taken without
-- reading other agencies' private columns. Row security hides those
-- rows from the applicant, so a normal select always looks available.

create or replace function public.is_agency_username_taken(candidate text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.agencies
    where username is not null
      and lower(username) = lower(btrim(candidate))
  );
$$;

revoke all on function public.is_agency_username_taken(text) from public;
revoke all on function public.is_agency_username_taken(text) from anon;
grant execute on function public.is_agency_username_taken(text) to authenticated;

do $$
begin
  create unique index agencies_username_lower_idx
    on public.agencies (lower(username))
    where username is not null;
exception
  when duplicate_table then
    null;
  when unique_violation then
    raise notice 'agencies.username values differ only by case; lower(username) unique index was not created';
end $$;
