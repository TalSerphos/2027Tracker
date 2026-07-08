-- AI 2027 Tracker — Supabase schema for the crowd-averaged probability vote.
--
-- Run this in the Supabase SQL editor once. The public `anon` key is safe to
-- ship in the site: row-level security lets anonymous visitors INSERT a vote
-- and read only the aggregate (via the RPC below) — never the raw rows.

create table if not exists public.votes (
  id          bigint generated always as identity primary key,
  utopia_prob smallint not null check (utopia_prob between 0 and 100),
  created_at  timestamptz not null default now()
);

create index if not exists votes_created_at_idx on public.votes (created_at);

alter table public.votes enable row level security;

-- Allow anonymous inserts only.
drop policy if exists "anon can insert votes" on public.votes;
create policy "anon can insert votes"
  on public.votes for insert
  to anon
  with check (utopia_prob between 0 and 100);

-- No select policy => raw rows are not readable by anon. Aggregates come from
-- the SECURITY DEFINER function below, which runs with the owner's privileges.
create or replace function public.avg_last_30d()
returns table (avg numeric, n bigint)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(avg(utopia_prob), 0)::numeric as avg,
    count(*)::bigint as n
  from public.votes
  where created_at >= now() - interval '30 days';
$$;

grant execute on function public.avg_last_30d() to anon;

-- Optional: light rate-limiting is best handled at the edge / API-gateway
-- level; for a small site the insert policy above is sufficient.
