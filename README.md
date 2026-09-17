# NEOAIWEBY

A corporate website for NEOAIWEBY, built with Next.js (App Router), TypeScript, Tailwind CSS, and
Supabase (database, auth, and storage). It has a public marketing frontend and a secure `/admin`
area for managing all content.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres database, Auth, and Storage
- **Vercel** for hosting

## Project structure

```
src/
  app/
    (site)/            Public pages (home, services, portfolio, contact) - shares Header/Footer
    admin/              /admin - authentication-gated dashboard
      login/            Public login page
      (dashboard)/      Pages, Services, Portfolio, Submissions, Media, Contact info, Settings
    actions/            Server Actions (mutations) for every admin area + the contact form
    sitemap.ts, robots.ts
  components/
    ui/                 Base design-system primitives (Button, Card, Badge, Container)
    layout/             Header, Footer, Logo, nav config
    sections/           Renderers for each reusable content-section type
    admin/              Reusable admin form/table components
  lib/
    supabase/           Browser / server / admin Supabase clients + hand-written DB types
    queries/            Read-only data-access functions (used by public pages + admin)
    validation/         Zod schemas (content sections, services, portfolio, contact form, ...)
    sections/           Section content TypeScript types + defaults
    contact/            Contact-form rate limiting
    notifications/      Stubbed hook for future email notifications (e.g. Resend)
supabase/
  migrations/           SQL migrations: schema, RLS policies, storage bucket, seed data
```

## Content architecture

Editable content lives in Supabase, not hardcoded in components:

- **Pages** (`pages` + `page_sections`) — each page is an ordered list of typed content
  sections (`hero`, `text`, `image_text`, `services`, `portfolio`, `benefits`, `stats`, `cta`,
  `faq`, `contact`). Each section's content is a small JSON document validated against a Zod
  schema (see `src/lib/validation/sections.ts`). New section types can be added later without
  a schema migration.
- **Services** (`services`) — title, slug, short/full description, icon, image, SEO fields,
  status, display order.
- **Portfolio / references** (`portfolio_items`, `portfolio_item_services`,
  `portfolio_gallery`) — project details, linked services, image gallery, SEO fields, status,
  display order.
- **Contact information** (`contact_info`, singleton) and **site settings**
  (`site_settings`, singleton) for global SEO defaults.
- **Media** (`media` table + `media` Storage bucket) — uploaded images with alt text, used
  across pages, services, and portfolio items.
- **Contact submissions** (`contact_submissions`) — stored server-side, viewable in
  `/admin/submissions`.

All of the above is managed from `/admin`. Row Level Security enforces that only published
content (or draft content viewed by a signed-in admin) is ever readable by anonymous visitors,
and only admins can write.

## Getting started locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com/dashboard).

3. **Run the database migrations.** Using the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started):

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

   This creates all tables, enums, RLS policies, the `media` Storage bucket + its policies, and
   seeds starter content (site settings, sample services/portfolio items, and pages built from
   sections). Everything the seed inserts is editable afterwards from `/admin`.

   Alternatively, run the SQL files in `supabase/migrations/` in order via the Supabase
   dashboard's SQL editor.

4. **Create your first admin user.**

   - In the Supabase dashboard, go to **Authentication → Users** and invite/create a user with
     your email and a password.
   - In the **SQL editor**, allowlist that user as an admin:

     ```sql
     insert into public.admin_users (user_id, email)
     select id, email from auth.users where email = 'you@example.com';
     ```

   Only users listed in `admin_users` can sign in to `/admin`, even if they have a valid
   Supabase Auth account — this is enforced both by the login flow and by every RLS write
   policy via the `public.is_admin()` function.

5. **Configure environment variables.** Copy `.env.example` to `.env.local` and fill in:

   | Variable                        | Where to find it                                                                 |
   | -------------------------------- | --------------------------------------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`        | Supabase dashboard → Project Settings → API                                       |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase dashboard → Project Settings → API (the `anon` / `public` key)           |
   | `SUPABASE_SERVICE_ROLE_KEY`       | Supabase dashboard → Project Settings → API (the `service_role` key — **secret**) |
   | `CONTACT_FORM_IP_PEPPER`          | Any random secret, e.g. `openssl rand -hex 32`                                    |
   | `NEXT_PUBLIC_SITE_URL`            | `http://localhost:3000` locally; your production domain when deployed            |
   | `RESEND_API_KEY` *(optional)*     | Only if you wire up email notifications — see below                              |
   | `CONTACT_NOTIFICATION_TO_EMAIL` *(optional)* | Inbox to notify on new contact submissions                            |

   `SUPABASE_SERVICE_ROLE_KEY` is server-only and bypasses Row Level Security — it is used only
   by the contact-form rate-limit check and is never sent to the browser.

6. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` to sign
   in and manage content.

## Email notifications for contact submissions

Contact form submissions are always stored in Supabase and visible in `/admin/submissions`.
Email notifications are optional and not wired up by default. To add them with
[Resend](https://resend.com):

1. `npm install resend` (or keep the plain `fetch` call already in
   `src/lib/notifications/contact.ts` — no extra dependency required).
2. Set `RESEND_API_KEY` and `CONTACT_NOTIFICATION_TO_EMAIL` in your environment.
3. That's it — `notifyNewContactSubmission` is already called after every successful
   submission and no-ops until those env vars are set.

## Deploying to Vercel

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com/new), import the repository. Framework preset: **Next.js**
   (auto-detected).
3. Add the environment variables from `.env.example` in the Vercel project's **Settings →
   Environment Variables** (use your production Supabase project's keys, and set
   `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. Vercel builds with `next build` and serves the app — no additional configuration is
   required.
5. Re-run step 3 of "Getting started locally" (`supabase db push`, or the SQL files) against
   your production Supabase project before or right after the first deploy, and create/allowlist
   your admin user there too (Supabase projects for local/dev and production should generally be
   separate).

### Custom domain

In the Vercel project, go to **Settings → Domains**, add your domain, and follow Vercel's
instructions to point your DNS (typically an `A`/`ALIAS` record at your registrar, or delegating
nameservers to Vercel). Once verified, update `NEXT_PUBLIC_SITE_URL` to the custom domain and
redeploy so canonical URLs, the sitemap, and Open Graph tags use it.

## Security notes

- Row Level Security is enabled on every table. Public (anon) access is read-only and limited to
  published content; all writes require the authenticated user to be present in
  `admin_users`.
- The Supabase **service role key** is only used server-side (contact-form rate limiting) and is
  never exposed to client code.
- The contact form has client- and server-side validation (Zod, shared schema), a honeypot
  field, a minimum-fill-time check, and server-side rate limiting by hashed IP address.
- `/admin` is protected by middleware that checks both Supabase session auth and `admin_users`
  membership on every request.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build locally
npm run lint     # ESLint
```
