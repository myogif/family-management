-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id)
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

-- Families table
create table public.families (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on families
alter table public.families enable row level security;

-- Family Members table
create table public.family_members (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(family_id, user_id)
);

-- Enable RLS on family_members
alter table public.family_members enable row level security;

-- Helper function to check family membership
create or replace function public.is_family_member(family_id uuid)
returns boolean as $$
  select exists (
    select 1 from public.family_members
    where family_id = $1 and user_id = auth.uid()
  );
$$ language sql security definer;

-- Policies for families
create policy "Users can view families they are members of"
  on public.families
  for select
  using (public.is_family_member(id));

create policy "Only owners can update families"
  on public.families
  for update
  using (
    public.is_family_member(id) and
    exists (
      select 1 from public.family_members
      where family_id = id and user_id = auth.uid() and role = 'owner'
    )
  );

create policy "Users can create families"
  on public.families
  for insert
  with check (created_by = auth.uid());

-- Policies for family_members
create policy "Family members can view other members"
  on public.family_members
  for select
  using (public.is_family_member(family_id));

create policy "Only owners can manage members"
  on public.family_members
  for insert
  with check (
    public.is_family_member(family_id) and
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_id and fm.user_id = auth.uid() and fm.role = 'owner'
    )
  );

create policy "Only owners can delete members"
  on public.family_members
  for delete
  using (
    public.is_family_member(family_id) and
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_id and fm.user_id = auth.uid() and fm.role = 'owner'
    )
  );

create policy "Only owners can update member roles"
  on public.family_members
  for update
  using (
    public.is_family_member(family_id) and
    exists (
      select 1 from public.family_members fm
      where fm.family_id = family_id and fm.user_id = auth.uid() and fm.role = 'owner'
    )
  );

-- Categories table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense', 'both')),
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.categories enable row level security;

create policy "Family members can view categories"
  on public.categories
  for select
  using (public.is_family_member(family_id));

create policy "Family admins can manage categories"
  on public.categories
  for insert
  with check (
    public.is_family_member(family_id) and
    exists (
      select 1 from public.family_members
      where family_id = categories.family_id and user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Transactions table
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete set null,
  created_by uuid not null references auth.users(id),
  type text not null check (type in ('income', 'expense')),
  amount numeric(15,2) not null,
  transaction_date timestamp with time zone not null,
  description text default '',
  payment_method text default 'cash',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.transactions enable row level security;

create policy "Family members can view transactions"
  on public.transactions
  for select
  using (public.is_family_member(family_id));

create policy "Family members can create transactions"
  on public.transactions
  for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());

-- Assets table
create table public.assets (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  category text not null,
  purchase_value numeric(15,2) not null,
  current_value numeric(15,2) not null,
  purchase_date timestamp with time zone not null,
  description text default '',
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.assets enable row level security;

create policy "Family members can view assets"
  on public.assets
  for select
  using (public.is_family_member(family_id));

create policy "Family members can create assets"
  on public.assets
  for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());

-- Debts table
create table public.debts (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  type text not null check (type in ('debt', 'receivable')),
  principal_amount numeric(15,2) not null,
  remaining_amount numeric(15,2) not null,
  due_date timestamp with time zone not null,
  status text not null check (status in ('active', 'paid', 'overdue')),
  description text default '',
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.debts enable row level security;

create policy "Family members can view debts"
  on public.debts
  for select
  using (public.is_family_member(family_id));

create policy "Family admins can manage debts"
  on public.debts
  for insert
  with check (
    public.is_family_member(family_id) and
    exists (
      select 1 from public.family_members
      where family_id = debts.family_id and user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Goals table
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  target_amount numeric(15,2) not null,
  current_amount numeric(15,2) not null default 0,
  deadline timestamp with time zone not null,
  description text default '',
  status text not null check (status in ('active', 'completed', 'cancelled')) default 'active',
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.goals enable row level security;

create policy "Family members can view goals"
  on public.goals
  for select
  using (public.is_family_member(family_id));

create policy "Family members can create goals"
  on public.goals
  for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());

-- Events table
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  description text default '',
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  location text default '',
  created_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.events enable row level security;

create policy "Family members can view events"
  on public.events
  for select
  using (public.is_family_member(family_id));

create policy "Family members can create events"
  on public.events
  for insert
  with check (public.is_family_member(family_id) and created_by = auth.uid());

-- Documents table
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  name text not null,
  file_path text not null,
  file_type text not null,
  file_size integer not null,
  description text default '',
  uploaded_by uuid not null references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.documents enable row level security;

create policy "Family members can view documents"
  on public.documents
  for select
  using (public.is_family_member(family_id));

create policy "Family members can upload documents"
  on public.documents
  for insert
  with check (public.is_family_member(family_id) and uploaded_by = auth.uid());

-- Notifications table
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  family_id uuid not null references public.families(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('debt_overdue', 'goal_deadline', 'event_reminder', 'system')),
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

-- Activity Logs table
create table public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  description text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.activity_logs enable row level security;

create policy "Family members can view activity logs"
  on public.activity_logs
  for select
  using (public.is_family_member(family_id));

-- Create indexes for performance
create index idx_family_members_family_id on public.family_members(family_id);
create index idx_family_members_user_id on public.family_members(user_id);
create index idx_transactions_family_id on public.transactions(family_id);
create index idx_transactions_transaction_date on public.transactions(transaction_date);
create index idx_transactions_category_id on public.transactions(category_id);
create index idx_assets_family_id on public.assets(family_id);
create index idx_debts_family_id on public.debts(family_id);
create index idx_debts_due_date on public.debts(due_date);
create index idx_goals_family_id on public.goals(family_id);
create index idx_goals_deadline on public.goals(deadline);
create index idx_events_family_id on public.events(family_id);
create index idx_events_start_at on public.events(start_at);
create index idx_documents_family_id on public.documents(family_id);
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_activity_logs_family_id on public.activity_logs(family_id);
create index idx_activity_logs_created_at on public.activity_logs(created_at);
