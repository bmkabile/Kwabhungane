# Kwa Bhungane — Phase 1

Production Next.js build of the Kwa Bhungane website, online shop and admin
dashboard, backed by Supabase (Postgres + Auth) and deployed on Vercel.

This replaces the earlier single-file HTML prototype with a real,
type-checked, lint-clean codebase you can push to GitHub and deploy today.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase — Postgres, Auth, Row Level Security
- **Hosting:** Vercel
- **Source control:** GitHub

## What's included

- Public site: Home, About, Shop (search + category filters), Product detail,
  Branches, Contact (with a working contact form), Cart, Checkout, Order
  confirmation
- Admin dashboard (auth-gated): Dashboard, Products (add/edit/archive),
  Inventory (stock levels + quick adjust), Orders (status pipeline),
  Customers, Branches, Reports & Analytics, and a "What's Next" roadmap page
- Atomic, server-side checkout: a single Postgres function (`create_order`)
  locks product rows, recomputes prices and stock from the database, and
  writes the order — so client-submitted totals are never trusted and two
  simultaneous checkouts can't oversell the same item
- Row Level Security on every table: the public can only read active
  products/branches/categories and create orders/contact messages; only
  accounts listed in the `admins` table can read or manage everything else

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the contents of `supabase/migrations/0001_init.sql`.
   This creates every table, RLS policy, and the seed data (branches,
   categories, and the same 9 products from the prototype).
3. Under **Project Settings → API**, copy the **Project URL** and the
   **anon public key**.

## 2. Create your admin login

1. In Supabase, go to **Authentication → Users → Add user** and create an
   account with your email and a password (or invite yourself by email).
2. In the SQL Editor, run:
   ```sql
   insert into public.admins (user_id)
   values ('paste-the-new-user-uuid-here');
   ```
   The user's UUID is shown in the Authentication → Users table.
3. You can now sign in at `/admin/login` with that email and password.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
step 1.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login`
for the dashboard.

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "Kwa Bhungane — Phase 1"
git branch -M main
git remote add origin https://github.com/<your-org>/<your-repo>.git
git push -u origin main
```

## 6. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Add the two environment variables from `.env.local` under
   **Settings → Environment Variables** (for Production, Preview and
   Development).
3. Deploy. Vercel builds with `next build` automatically — no extra config
   needed (see `next.config.mjs`).
4. Add your custom domain under **Settings → Domains** once you're ready.

## Notes on production-readiness

- **Payment gateway:** checkout is built to hand off to a South African
  gateway (Yoco, PayFast or Payflex) rather than process cards itself, per
  the original brief. Orders are created with `payment_status = 'Pending'`;
  wire your gateway's webhook into a new Route Handler (e.g.
  `src/app/api/webhooks/[provider]/route.ts`) that calls
  `supabase.from('orders').update({ payment_status: 'Paid' })` once payment
  is confirmed. Never mark an order paid from the client.
- **Product images:** products currently render as colour placeholders.
  `products.image_url` is already in the schema — wire up Supabase Storage
  and set that column once real product photography is available.
- **Branch-level inventory:** the `branch_stock` table exists in the schema
  but isn't used by the UI yet. `products.stock` is the single source of
  truth for Phase 1; switching to per-branch stock later is a UI change,
  not a schema change.
- **Content placeholders:** mission/vision copy and each product's
  ingredients/usage text are marked as placeholders in the seed data —
  replace them with real copy from Kwa Bhungane before launch. Deliberately
  avoided inventing health claims for real herbal products.
- **Consultation booking, knowledge centre, mobile app, Google Maps, social
  integrations:** intentionally out of scope for Phase 1. See
  `/admin/roadmap` in the dashboard for how each is expected to slot in
  without a rebuild.

## Project structure

```
supabase/migrations/0001_init.sql   Schema, RLS policies, seed data, create_order()
src/lib/supabase/                   Browser/server/middleware Supabase clients
src/lib/database.types.ts           Hand-written types mirroring the schema
src/components/                     Shared site + admin UI components
src/app/                            Public site routes
src/app/admin/                      Auth-gated admin dashboard routes
```
