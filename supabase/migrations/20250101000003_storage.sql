-- Storage bucket for the media library. Files are publicly readable (they
-- are marketing assets shown on the public site); only admins can upload,
-- replace, or delete objects.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

create policy "media_bucket_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_bucket_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
