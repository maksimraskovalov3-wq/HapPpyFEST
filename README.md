# HapPpy FEST — Vercel + Supabase deploy package

This folder is a self-contained, ready-to-deploy copy of the site:

- `public/` — the pre-built static frontend (HTML/CSS/JS/images), same as replit dev.
- `api/` — the backend, rewritten as Vercel serverless functions (one file per route),
  so it runs on Vercel with zero extra server config.
- `lib/` — shared DB schema + connection, used by the `api/` functions.

The frontend calls `/api/...` (relative), so once deployed on Vercel both the site and
the API live on the same domain — no CORS or extra config needed.

## 1. Create a Supabase project & database

1. Create a project at https://supabase.com (or use an existing one).
2. In your Supabase project, go to **Project Settings → Database → Connection string**
   and copy the **URI** (use the "Session" pooler connection on the free tier, or the
   direct connection — either works with the settings below).
3. Put that value in a local `.env` file here (copy `.env.example` to `.env` and fill it in):

   ```
   DATABASE_URL=postgresql://postgres:<password>@<project-ref>.supabase.co:5432/postgres?sslmode=require
   ```

## 2. Push the database schema to Supabase

The `registrations` and `subscriptions` tables have already been created in your
Supabase database for you — no action needed here.

If you ever need to re-run it yourself (e.g. after changing `lib/schema.ts`), from
this folder:

```bash
npm install
npm run db:push
```

## 3. Deploy to Vercel

Easiest path — Vercel CLI:

```bash
npm install -g vercel
vercel
```

Follow the prompts (link/create a project). When asked for a framework preset, choose
**Other** — this project ships a pre-built `public/` folder plus serverless functions,
so no build step is needed.

Then add the database env var to the Vercel project (Project → Settings →
Environment Variables):

```
DATABASE_URL = <same value as your .env above>
```

Redeploy once the env var is set:

```bash
vercel --prod
```

(Alternatively: push this folder to a GitHub repo and import it in the Vercel
dashboard — same steps, just click "Add Environment Variable" during import.)

## What's included / what to know

- Routes: `GET /api/healthz`, `GET /api/registrations/count`, `POST /api/registrations`,
  `POST /api/subscriptions` — same behavior as the original Express API.
- If you ever redesign the frontend, rebuild it (`vite build` in the original project)
  and drop the new `dist/public` contents into this folder's `public/` directory.
- The site's design/content is otherwise unchanged from what you saw running in Replit.
