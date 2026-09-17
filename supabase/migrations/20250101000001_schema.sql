-- NEOAIWEBY core schema
-- Content types: pages/sections, services, portfolio, media, contact info, seo, submissions.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Publication status shared by most content tables.
create type public.content_status as enum ('draft', 'published');

-- ---------------------------------------------------------------------------
-- Media library (metadata for files stored in the "media" Storage bucket)
-- ---------------------------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_text text,
  uploaded_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_media_updated_at
  before update on public.media
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pages + flexible content sections
-- ---------------------------------------------------------------------------

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  status public.content_status not null default 'draft',
  seo_title text,
  seo_description text,
  seo_canonical_url text,
  seo_og_image_id uuid references public.media (id) on delete set null,
  seo_no_index boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_pages_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

create type public.section_type as enum (
  'hero',
  'text',
  'image_text',
  'services',
  'portfolio',
  'benefits',
  'stats',
  'cta',
  'faq',
  'contact'
);

-- Each section stores type-specific content as JSON. The shape per type is
-- documented and validated in the application layer (see lib/validation),
-- keeping the schema flexible without requiring a migration per content tweak.
create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  type public.section_type not null,
  status public.content_status not null default 'published',
  display_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_page_sections_page_id on public.page_sections (page_id, display_order);

create trigger trg_page_sections_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  icon text,
  image_id uuid references public.media (id) on delete set null,
  seo_title text,
  seo_description text,
  status public.content_status not null default 'draft',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_status_order on public.services (status, display_order);

create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Portfolio / references / case studies
-- ---------------------------------------------------------------------------

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  client_name text,
  short_description text,
  full_description text,
  featured_image_id uuid references public.media (id) on delete set null,
  project_url text,
  published_date date,
  seo_title text,
  seo_description text,
  status public.content_status not null default 'draft',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_portfolio_items_status_order on public.portfolio_items (status, display_order);

create trigger trg_portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

create table public.portfolio_item_services (
  portfolio_item_id uuid not null references public.portfolio_items (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete cascade,
  primary key (portfolio_item_id, service_id)
);

create table public.portfolio_gallery (
  id uuid primary key default gen_random_uuid(),
  portfolio_item_id uuid not null references public.portfolio_items (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_portfolio_gallery_item on public.portfolio_gallery (portfolio_item_id, display_order);

-- ---------------------------------------------------------------------------
-- Contact form submissions
-- ---------------------------------------------------------------------------

create type public.submission_status as enum ('new', 'read', 'archived');

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (phone is null or char_length(phone) <= 50),
  company text check (company is null or char_length(company) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  consent boolean not null default false,
  status public.submission_status not null default 'new',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_contact_submissions_created_at on public.contact_submissions (created_at desc);
create index idx_contact_submissions_ip_hash on public.contact_submissions (ip_hash, created_at);

-- ---------------------------------------------------------------------------
-- Contact info (singleton)
-- ---------------------------------------------------------------------------

create table public.contact_info (
  id int primary key default 1 check (id = 1),
  company_name text,
  address text,
  phone text,
  email text,
  company_id text, -- IČO
  vat_id text, -- DIČ
  social_links jsonb not null default '[]'::jsonb,
  extra jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger trg_contact_info_updated_at
  before update on public.contact_info
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Site settings (singleton) - global SEO defaults / misc site config
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'NEOAIWEBY',
  default_seo_title text,
  default_seo_description text,
  default_og_image_id uuid references public.media (id) on delete set null,
  robots_index boolean not null default true,
  google_site_verification text,
  updated_at timestamptz not null default now()
);

create trigger trg_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Admin allowlist
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
