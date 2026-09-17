-- Saved delivery addresses for signed-in customers. A WhatsApp order pastes the
-- chosen one into the pre-filled message; guests type theirs inline instead and
-- nothing is stored for them.
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text,
  line1 text not null,
  landmark text,
  city text not null,
  state text not null,
  pin text not null check (pin ~ '^\d{6}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table addresses enable row level security;

drop policy if exists "addresses_select_own" on addresses;
drop policy if exists "addresses_insert_own" on addresses;
drop policy if exists "addresses_update_own" on addresses;
drop policy if exists "addresses_delete_own" on addresses;

create policy "addresses_select_own" on addresses
  for select using (auth.uid() = user_id);
create policy "addresses_insert_own" on addresses
  for insert with check (auth.uid() = user_id);
create policy "addresses_update_own" on addresses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "addresses_delete_own" on addresses
  for delete using (auth.uid() = user_id);

create index if not exists addresses_user_id_idx on addresses (user_id);

-- At most one default per customer; the API clears the old default before
-- setting a new one and this index makes that the database's problem too.
create unique index if not exists addresses_one_default_per_user
  on addresses (user_id) where is_default;

-- Google sends the display name as full_name (and usually name); the original
-- trigger was written for the email/password signup, which only ever sent name.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $function$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$function$;
