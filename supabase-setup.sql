-- AryanVerse portfolio manager: run this in Supabase SQL Editor.
-- IMPORTANT: replace the email below with the ONE email you will use for admin login.
-- Keep the Supabase service_role key secret; never put it in frontend files.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'ai',
  subtitle text,
  description text not null,
  technologies text,
  github_url text,
  demo_url text,
  badge text,
  image_url text,
  created_at timestamptz not null default now()
);
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  category text,
  issue_year integer,
  verification_url text,
  file_url text,
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects" on public.projects for select using (true);
drop policy if exists "Only Aryan admin can insert projects" on public.projects;
create policy "Only Aryan admin can insert projects" on public.projects for insert to authenticated with check (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can update projects" on public.projects;
create policy "Only Aryan admin can update projects" on public.projects for update to authenticated using (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com')) with check (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can delete projects" on public.projects;
create policy "Only Aryan admin can delete projects" on public.projects for delete to authenticated using (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Public can view certificates" on public.certificates;
create policy "Public can view certificates" on public.certificates for select using (true);
drop policy if exists "Only Aryan admin can insert certificates" on public.certificates;
create policy "Only Aryan admin can insert certificates" on public.certificates for insert to authenticated with check (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can update certificates" on public.certificates;
create policy "Only Aryan admin can update certificates" on public.certificates for update to authenticated using (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com')) with check (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can delete certificates" on public.certificates;
create policy "Only Aryan admin can delete certificates" on public.certificates for delete to authenticated using (lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
-- Create a PUBLIC bucket named portfolio-assets in Storage settings before uploading files.
-- Public files are readable; only the authorized admin can upload/delete/replace them.
drop policy if exists "Public can view portfolio assets" on storage.objects;
create policy "Public can view portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
drop policy if exists "Only Aryan admin can upload portfolio assets" on storage.objects;
create policy "Only Aryan admin can upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can update portfolio assets" on storage.objects;
create policy "Only Aryan admin can update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com')) with check (bucket_id = 'portfolio-assets' and lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
drop policy if exists "Only Aryan admin can delete portfolio assets" on storage.objects;
create policy "Only Aryan admin can delete portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and lower((auth.jwt()->>'email')) = lower('engineerworld853@gmail.com'));
-- After running this script, replace YOUR_VERIFIED_ADMIN_EMAIL@example.com in this SQL policy file with your real admin email, then run it again.
