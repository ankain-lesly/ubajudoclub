-- Migration: Rename role 'coach' to 'staff' and add admin check
-- Date: 2026-11-18

-- 1. Update existing profiles with 'coach' or 'COACH' to 'STAFF'
update public.profiles
set role = 'STAFF'
where role in ('coach', 'COACH');

-- 2. Update helper function to check for staff, admin, and legacy coach
create or replace function public.is_coach_or_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'STAFF', 'coach', 'COACH', 'admin', 'ADMIN')
  );
end;
$$ language plpgsql security definer;

-- 3. Dedicated is_admin function for user/staff creation permissions
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'ADMIN')
  );
end;
$$ language plpgsql security definer;

-- 4. Dedicated is_staff_or_admin alias
create or replace function public.is_staff_or_admin()
returns boolean as $$
begin
  return public.is_coach_or_admin();
end;
$$ language plpgsql security definer;
