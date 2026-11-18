-- Migration: Fix RLS Policies for Profiles, Join Requests, and Promotions
-- Date: 2026-11-18

-- 1. PROFILES POLICIES
-- Allow coaches and admins to update profiles (needed for role assignment and member management)
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users and coaches can update profiles" on public.profiles;
create policy "Users and coaches can update profiles" on public.profiles
  for update using (auth.uid() = id or public.is_coach_or_admin())
  with check (auth.uid() = id or public.is_coach_or_admin());

-- Allow coaches and admins to insert profiles
drop policy if exists "Coaches can insert profiles" on public.profiles;
create policy "Coaches can insert profiles" on public.profiles
  for insert with check (public.is_coach_or_admin());

-- 2. JOIN REQUESTS POLICIES
-- Keep insert open to all (public prospective athletes)
-- Ensure coaches and admins have full management permissions
drop policy if exists "Anyone can submit a join request" on public.join_requests;
create policy "Anyone can submit a join request" on public.join_requests
  for insert with check (true);

drop policy if exists "Coaches can view join requests" on public.join_requests;
create policy "Coaches can view join requests" on public.join_requests
  for select using (public.is_coach_or_admin());

drop policy if exists "Coaches can update join requests" on public.join_requests;
create policy "Coaches can update join requests" on public.join_requests
  for update using (public.is_coach_or_admin());

drop policy if exists "Coaches can delete join requests" on public.join_requests;
create policy "Coaches can delete join requests" on public.join_requests
  for delete using (public.is_coach_or_admin());

-- 3. PROMOTIONS POLICIES
-- Allow athletes to view their own promotions
drop policy if exists "Athletes can view own promotions" on public.promotions;
create policy "Athletes can view own promotions" on public.promotions
  for select using (
    exists (
      select 1 from public.members
      where members.id = promotions.member_id and members.profile_id = auth.uid()
    ) or public.is_coach_or_admin()
  );
