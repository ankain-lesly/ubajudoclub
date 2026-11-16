-- ==============================================================================
-- UBa Judo Club — PostgreSQL Initial Schema & Views
-- University of Bamenda, Bambili Campus
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'MEMBER' check (role in ('COACH', 'MEMBER', 'ADMIN', 'coach', 'member', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists idx_profiles_email on public.profiles(email);

-- Trigger to create profile when auth.users is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'MEMBER')
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. MEMBERS TABLE (Normalized in 3NF)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  full_name text not null,
  matricule text unique,
  program text,
  belt_rank text not null default 'White',
  current_belt text not null default 'WHITE',
  belt_awarded_date date default current_date,
  status text not null default 'active',
  joined_on date default current_date,
  phone text,
  email text,
  notes text,
  created_date timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_belt on public.members(belt_rank);

-- 3. TRAINING SESSIONS TABLE
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  session_date date default current_date,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  focus text,
  coach text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_training_sessions_start on public.training_sessions(start_time);

-- 4. SESSION COORDINATORS TABLE (Many-to-Many junction)
create table if not exists public.session_coordinators (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  role text default 'Lead',
  created_at timestamptz not null default now(),
  unique (session_id, member_id)
);
create index if not exists idx_session_coordinators_member on public.session_coordinators(member_id);

-- 5. SESSION MEDIA TABLE
create table if not exists public.session_media (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  url text not null,
  public_id text,
  thumbnail_url text,
  media_type text not null default 'IMAGE',
  caption text,
  created_at timestamptz not null default now()
);
create index if not exists idx_session_media_session on public.session_media(session_id);

-- 6. ATTENDANCES TABLE
create table if not exists public.attendances (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique (session_id, member_id)
);
create index if not exists idx_attendances_member on public.attendances(member_id);

-- 7. JOIN REQUESTS TABLE
create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  program text,
  experience text,
  message text,
  status text not null default 'new',
  converted_member_id uuid unique references public.members(id) on delete set null,
  created_date timestamptz not null default now()
);
create index if not exists idx_join_requests_status on public.join_requests(status);

-- 8. COMPUTED DATABASE VIEWS
create or replace view public.members_with_stats as
select
  m.id,
  m.profile_id,
  m.full_name,
  m.matricule,
  m.program,
  m.current_belt,
  m.belt_awarded_date,
  m.status,
  m.joined_on,
  m.phone,
  m.email,
  m.notes,
  m.created_date as created_at,
  m.updated_at,
  coalesce(count(a.id), 0)::int as sessions_total,
  coalesce(count(a.id) filter (
    where s.start_time >= coalesce(m.belt_awarded_date, m.joined_on, '1970-01-01'::date)
  ), 0)::int as sessions_since_promotion,
  max(s.start_time) as last_attended
from public.members m
left join public.attendances a on a.member_id = m.id
left join public.training_sessions s on s.id = a.session_id
group by m.id;

create or replace view public.sessions_with_turnout as
select
  s.id,
  s.start_time,
  s.end_time,
  s.focus,
  s.notes,
  s.created_at,
  s.updated_at,
  coalesce(count(a.id), 0)::int as attended_count
from public.training_sessions s
left join public.attendances a on a.session_id = s.id
group by s.id;

-- 9. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.training_sessions enable row level security;
alter table public.session_coordinators enable row level security;
alter table public.session_media enable row level security;
alter table public.attendances enable row level security;
alter table public.join_requests enable row level security;

-- Helper check
create or replace function public.is_coach_or_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('coach', 'admin', 'COACH', 'ADMIN')
  );
end;
$$ language plpgsql security definer;

-- Policies
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_coach_or_admin());

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Coaches can manage members" on public.members
  for all using (public.is_coach_or_admin());

create policy "Athletes can read own member record" on public.members
  for select using (profile_id = auth.uid() or public.is_coach_or_admin());

create policy "Anyone can view sessions" on public.training_sessions
  for select using (true);

create policy "Coaches can manage sessions" on public.training_sessions
  for all using (public.is_coach_or_admin());

create policy "Anyone can view coordinators" on public.session_coordinators
  for select using (true);

create policy "Coaches can manage coordinators" on public.session_coordinators
  for all using (public.is_coach_or_admin());

create policy "Anyone can view media" on public.session_media
  for select using (true);

create policy "Coaches can manage media" on public.session_media
  for all using (public.is_coach_or_admin());

create policy "Coaches can manage attendances" on public.attendances
  for all using (public.is_coach_or_admin());

create policy "Athletes can view own attendance" on public.attendances
  for select using (
    exists (
      select 1 from public.members
      where members.id = attendances.member_id and members.profile_id = auth.uid()
    ) or public.is_coach_or_admin()
  );

create policy "Anyone can submit a join request" on public.join_requests
  for insert with check (true);

create policy "Coaches can manage join requests" on public.join_requests
  for all using (public.is_coach_or_admin());
