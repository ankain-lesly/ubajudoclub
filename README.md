# UBa Judo Club

Website for the University of Bamenda judo club. React Router v8 (framework mode, SSR), Vite, Tailwind CSS v4, Bun.

## Getting started

```bash
bun install
bun run dev        # http://localhost:5173
```

## Scripts

| Script | What it does |
|--------|--------------|
| `bun run dev` | Dev server with HMR |
| `bun run typecheck` | Generates route types, then `tsc` |
| `bun run build` | Production build into `build/` |
| `bun run start` | Serves the production build |

## Structure

```
app/
  root.tsx          document shell + providers
  routes.ts         route config
  routes/           route modules (loaders, meta, components)
  components/       UI (ui/ = shadcn primitives)
  lib/
    api/            data access (skeleton, no backend yet)
    auth/           auth context (skeleton, always signed out)
    data/           static club data + helpers
    hooks/ types/
```

## Status

No backend is connected. Event pages render empty states, and login/register
report "not implemented". Wire real data in `app/lib/api/` and
`app/lib/auth/`.
