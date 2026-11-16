---
name: supabase
description: Guide and instructions for managing the Supabase backend in UBa Judo Club, including schema migrations, RLS policies, AuthContext integration, and SSR data access.
---

# Supabase Backend Guide for UBa Judo Club

This skill provides the architectural conventions, database schema, Row Level Security (RLS) rules, and client patterns for the UBa Judo Club application.

## 1. Project Architecture & Connection

The project is connected to Supabase:
- **Project Ref**: `yumqjwowofgwsxnbedwo`
- **Region**: `eu-north-1`
- **Config**: Defined in `supabase/config.toml` and `.env`

### Environment Variables
- `VITE_SUPABASE_URL`: Public Supabase Project URL (`https://yumqjwowofgwsxnbedwo.supabase.co`)
- `VITE_SUPABASE_ANON_KEY`: Public Anon Key (safe for client-side and browser usage)
- `SUPABASE_URL` / `SUPABASE_ANON_KEY`: Used server-side during SSR in React Router loaders and actions.

---

## 2. Supabase Clients

### Browser Client (`@/lib/supabase/client.ts`)
- Use in React components, hooks, and browser-executed client APIs (`api.entities.*`).
- Created via `@supabase/ssr` `createBrowserClient<Database>()`.
- Singleton in browser runtime to maintain session cache and websocket subscriptions.

```ts
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = getSupabaseBrowserClient();
const { data, error } = await supabase.from("events").select("*");
```

### Server Client (`@/lib/supabase/server.ts`)
- Use in React Router v8 server `loader`s and `action`s (`app/routes/*.tsx`).
- Reads and serializes HTTP cookies for SSR session preservation.

```ts
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Route } from "./+types/my-route";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = getSupabaseServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  return Response.json({ user }, { headers });
}
```

---

## 3. Database Schema & Tables

All primary keys use `uuid` with `gen_random_uuid()`. Timestamps use `timestamptz`.

| Table | Purpose | Access Control (RLS) |
|---|---|---|
| `profiles` | User profiles linked to `auth.users(id)` with `role` (`coach`, `member`, `admin`). | Users read/update own profile; coaches/admins view all. |
| `events` | Club competitions, gradings, seminars, socials. | Public read for `is_published = true`. Coaches full CRUD. |
| `members` | Athlete roster, rank, matricule, attendance totals. | Coaches and admins view and manage. |
| `training_sessions` | Dojo session logs, coaches, attendance tallies. | Coaches and admins view and manage. |
| `attendance` | Member attendance records per session. Triggers auto-increment `attended_count`. | Coaches and admins view and manage. |
| `promotions` | Belt promotion records and session benchmarks. | Coaches and admins view and manage. |
| `join_requests` | Prospective athlete interest submissions from `/join`. | Public insert (`true`). Coaches read/update. |

---

## 4. Key Functions & Triggers

- `public.handle_new_user()`: Trigger on `auth.users` insert that auto-creates `public.profiles`.
- `public.handle_attendance_change()`: Trigger on `public.attendance` insert/delete that maintains:
  - `training_sessions.attended_count`
  - `members.sessions_total`
  - `members.sessions_since_promotion`
  - `members.last_attended`
- `public.is_coach_or_admin()`: Security definer function used in RLS policies.
- `public.get_public_stats()`: RPC function returning anonymized stats (`active_athletes`, `sessions_logged`, `average_turnout`, `belt_distribution`, `turnout_series`) without exposing member identities.

---

## 5. TypeScript Types Workflow

TypeScript database definitions live in `app/lib/supabase/types.ts`.
When schema changes occur, regenerate types using the Supabase MCP tool `generate_typescript_types` or with Supabase CLI:

```bash
supabase gen types typescript --project-id yumqjwowofgwsxnbedwo > app/lib/supabase/types.ts
```
