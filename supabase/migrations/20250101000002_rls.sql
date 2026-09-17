-- Row Level Security: public visitors get read-only access to published
-- content; only allowlisted admins (public.is_admin()) can write anything.

alter table public.media enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.portfolio_item_services enable row level security;
alter table public.portfolio_gallery enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.contact_info enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

-- media: metadata only (no secrets) - safe to expose publicly for rendering
-- alt text/dimensions on the public site; writes are admin-only.
create policy "media_public_read" on public.media
  for select to anon, authenticated
  using (true);

create policy "media_admin_write" on public.media
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- pages
create policy "pages_public_read_published" on public.pages
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "pages_admin_write" on public.pages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- page_sections: published sections of published pages are public; the
-- admin UI (authenticated + is_admin) can see/edit drafts too.
create policy "page_sections_public_read_published" on public.page_sections
  for select to anon, authenticated
  using (
    public.is_admin()
    or (
      status = 'published'
      and exists (
        select 1 from public.pages p
        where p.id = page_sections.page_id and p.status = 'published'
      )
    )
  );

create policy "page_sections_admin_write" on public.page_sections
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- services
create policy "services_public_read_published" on public.services
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "services_admin_write" on public.services
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- portfolio_items
create policy "portfolio_items_public_read_published" on public.portfolio_items
  for select to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "portfolio_items_admin_write" on public.portfolio_items
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- portfolio_item_services (join table)
create policy "portfolio_item_services_public_read" on public.portfolio_item_services
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.portfolio_items pi
      where pi.id = portfolio_item_services.portfolio_item_id and pi.status = 'published'
    )
  );

create policy "portfolio_item_services_admin_write" on public.portfolio_item_services
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- portfolio_gallery
create policy "portfolio_gallery_public_read" on public.portfolio_gallery
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.portfolio_items pi
      where pi.id = portfolio_gallery.portfolio_item_id and pi.status = 'published'
    )
  );

create policy "portfolio_gallery_admin_write" on public.portfolio_gallery
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- contact_submissions: anyone can submit the public contact form; nobody
-- but admins can read, update, or delete submissions.
create policy "contact_submissions_public_insert" on public.contact_submissions
  for insert to anon, authenticated
  with check (true);

create policy "contact_submissions_admin_read" on public.contact_submissions
  for select to authenticated
  using (public.is_admin());

create policy "contact_submissions_admin_update" on public.contact_submissions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "contact_submissions_admin_delete" on public.contact_submissions
  for delete to authenticated
  using (public.is_admin());

-- contact_info: public company details are readable by anyone; only admins
-- can edit the singleton row.
create policy "contact_info_public_read" on public.contact_info
  for select to anon, authenticated
  using (true);

create policy "contact_info_admin_write" on public.contact_info
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- site_settings: public read (needed for default SEO metadata), admin write.
create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated
  using (true);

create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- admin_users: no direct policies -> default deny for everyone. Access is
-- only ever through the security-definer public.is_admin() function.
