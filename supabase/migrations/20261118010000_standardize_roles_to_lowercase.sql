-- Migration: Standardize roles to strictly lowercase ('admin', 'staff', 'member')
-- Date: 2026-11-18

-- 1. Standardize existing profile rows to lowercase and migrate 'coach' -> 'staff'
update public.profiles
set role = lower(role);

update public.profiles
set role = 'staff'
where role = 'coach';

-- Ensure only valid lowercase roles exist
update public.profiles
set role = 'member'
where role not in ('admin', 'staff', 'member');

-- Add check constraint to guarantee role is always lowercase
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'staff', 'member'));

-- Set default role to lowercase 'member'
alter table public.profiles
  alter column role set default 'member';

-- 2. Update auth user creation trigger to default to lowercase 'member' or lowercase metadata
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
begin
  user_role := lower(coalesce(new.raw_user_meta_data->>'role', 'member'));
  if user_role not in ('admin', 'staff', 'member') then
    user_role := 'member';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    user_role
  )
  on conflict (id) do update
  set email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

-- 3. Standardized helper functions
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_staff_or_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
end;
$$ language plpgsql security definer;

-- Keep is_coach_or_admin as an alias pointing to is_staff_or_admin for any legacy references
create or replace function public.is_coach_or_admin()
returns boolean as $$
begin
  return public.is_staff_or_admin();
end;
$$ language plpgsql security definer;

-- 4. RLS Policies on profiles
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users and coaches can update profiles" on public.profiles;
drop policy if exists "Coaches can insert profiles" on public.profiles;
drop policy if exists "Admins can manage profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Anyone authenticated can read their own profile; staff/admins can read all profiles
create policy "Users and staff can read profiles" on public.profiles
  for select using (auth.uid() = id or public.is_staff_or_admin());

-- Users can update their own personal info (name, etc)
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins have full management over profiles (e.g. assigning roles)
create policy "Admins can manage profiles" on public.profiles
  for all using (public.is_admin())
  with check (public.is_admin());
