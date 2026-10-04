-- Run once in the Supabase SQL Editor. No browser role can access these tables.
create table if not exists public.inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 6 and 30),
  email text not null default '' check (char_length(email) <= 254),
  subject text not null check (char_length(subject) between 1 and 400),
  event_date date,
  guests integer check (guests between 1 and 100000),
  note text not null check (char_length(note) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'contacted', 'done')),
  request_hash text not null,
  notification_status text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed')),
  notification_sent_at timestamptz
);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc, id desc);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc, id desc);
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
grant select, insert, update on public.inquiries to service_role;

create table if not exists public.inquiry_rate_limits (
  key text primary key,
  started_at timestamptz not null,
  attempts integer not null
);
alter table public.inquiry_rate_limits enable row level security;
revoke all on public.inquiry_rate_limits from anon, authenticated;
grant select, insert, update, delete on public.inquiry_rate_limits to service_role;

-- Atomic and shared by every server instance; raw visitor IPs are not stored.
create or replace function public.consume_inquiry_limit(bucket_key text, maximum integer, window_seconds integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_attempts integer;
begin
  delete from public.inquiry_rate_limits where started_at < now() - interval '1 day';
  insert into public.inquiry_rate_limits(key, started_at, attempts) values (bucket_key, now(), 1)
  on conflict (key) do update set
    attempts = case when inquiry_rate_limits.started_at < now() - make_interval(secs => window_seconds) then 1 else inquiry_rate_limits.attempts + 1 end,
    started_at = case when inquiry_rate_limits.started_at < now() - make_interval(secs => window_seconds) then now() else inquiry_rate_limits.started_at end
  returning attempts into current_attempts;
  return current_attempts <= maximum;
end;
$$;
revoke all on function public.consume_inquiry_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_inquiry_limit(text, integer, integer) to service_role;
