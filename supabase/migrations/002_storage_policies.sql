-- Storage bucket for family documents
-- Run this in Supabase SQL Editor after creating the 'family-documents' bucket

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Policy: Users can only view files from families they are members of
-- This requires a helper function to check family membership

create or replace function public.is_family_member_by_path(file_path text)
returns boolean as $$
declare
  family_id uuid;
begin
  -- Extract family_id from path (first segment)
  family_id := split_part(file_path, '/', 1)::uuid;

  return exists (
    select 1 from public.family_members
    where family_id = family_id and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Policy for SELECT: Users can view files from their families
create policy "Family members can view documents"
  on storage.objects
  for select
  using (
    bucket_id = 'family-documents' and
    public.is_family_member_by_path(name)
  );

-- Policy for INSERT: Users can upload to their family folders
create policy "Family members can upload documents"
  on storage.objects
  for insert
  with check (
    bucket_id = 'family-documents' and
    public.is_family_member_by_path(name)
  );

-- Policy for DELETE: Users can delete files from their families
create policy "Family members can delete documents"
  on storage.objects
  for delete
  using (
    bucket_id = 'family-documents' and
    public.is_family_member_by_path(name)
  );

-- Note: The bucket 'family-documents' must be created manually in Supabase Dashboard
-- Go to Storage → New Bucket → Name: family-documents → Public: false
