
-- Enable UUIDs
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  phone text unique,
  created_at timestamp with time zone default now()
);

-- Keep phone updated from auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone, display_name)
  values (new.id, new.phone, coalesce(new.raw_user_meta_data->>'display_name',''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Friends
create type public.friend_status as enum ('pending', 'accepted', 'blocked');
create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  friend_id uuid references public.profiles(id) on delete cascade,
  status public.friend_status not null default 'pending',
  created_at timestamp with time zone default now(),
  unique (user_id, friend_id)
);

-- Recipe books
create table if not exists public.recipe_books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

-- Shares
create type public.share_permission as enum ('view','edit');
create table if not exists public.book_shares (
  book_id uuid references public.recipe_books(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  permission public.share_permission not null default 'view',
  created_at timestamp with time zone default now(),
  primary key (book_id, user_id)
);

-- Recipes
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  book_id uuid references public.recipe_books(id) on delete set null,
  title text not null,
  directions text,
  image_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
  before update on public.recipes
  for each row execute function public.touch_updated_at();

-- Ingredients
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references public.recipes(id) on delete cascade,
  name text not null,
  quantity text,
  unit text,
  created_at timestamp with time zone default now()
);

-- Shopping lists
create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  title text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
create table if not exists public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references public.shopping_lists(id) on delete cascade,
  name text not null,
  quantity text,
  unit text,
  checked boolean default false,
  source_recipe_id uuid references public.recipes(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Weekly menus
create table if not exists public.weekly_menus (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  week_start_date date not null,
  created_at timestamp with time zone default now(),
  unique (owner_id, week_start_date)
);
create table if not exists public.weekly_menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid references public.weekly_menus(id) on delete cascade,
  date date not null,
  meal_type text not null default 'dinner',
  recipe_id uuid references public.recipes(id) on delete set null,
  notes text,
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.friends enable row level security;
alter table public.recipe_books enable row level security;
alter table public.book_shares enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.shopping_list_items enable row level security;
alter table public.weekly_menus enable row level security;
alter table public.weekly_menu_items enable row level security;

-- Profiles policies
create policy if not exists "Users can view their profile"
  on public.profiles for select using (auth.uid() = id);
create policy if not exists "Users can update their profile"
  on public.profiles for update using (auth.uid() = id);

-- Friends policies
create policy if not exists "users manage their friend edges"
  on public.friends for all using (auth.uid() = user_id or auth.uid() = friend_id);

-- Books policies
create policy if not exists "book owner full access"
  on public.recipe_books for all using (auth.uid() = owner_id);
create policy if not exists "shared book read-only access"
  on public.recipe_books for select using (
    exists (select 1 from public.book_shares s where s.book_id = id and s.user_id = auth.uid())
  );

-- Shares policies
create policy if not exists "owner manages shares"
  on public.book_shares for all using (
    exists (select 1 from public.recipe_books b where b.id = book_id and b.owner_id = auth.uid())
  );
create policy if not exists "viewer can see shares they have"
  on public.book_shares for select using (user_id = auth.uid());

-- Recipes policies
create policy if not exists "owner full access"
  on public.recipes for all using (owner_id = auth.uid());
create policy if not exists "select if in shared book"
  on public.recipes for select using (
    exists (select 1 from public.book_shares s where s.book_id = recipes.book_id and s.user_id = auth.uid())
  );

-- Ingredients policies (follow recipe access)
create policy if not exists "ingredients accessible if recipe accessible"
  on public.recipe_ingredients for all using (
    exists (select 1 from public.recipes r where r.id = recipe_id and (r.owner_id = auth.uid() or exists (
      select 1 from public.book_shares s where s.book_id = r.book_id and s.user_id = auth.uid()
    )))
  );

-- Shopping lists policies
create policy if not exists "owner full access shopping list"
  on public.shopping_lists for all using (owner_id = auth.uid());
create policy if not exists "owner full access shopping list items"
  on public.shopping_list_items for all using (
    exists (select 1 from public.shopping_lists l where l.id = list_id and l.owner_id = auth.uid())
  );

-- Weekly menus policies
create policy if not exists "owner full access weekly menu"
  on public.weekly_menus for all using (owner_id = auth.uid());
create policy if not exists "owner full access weekly items"
  on public.weekly_menu_items for all using (
    exists (select 1 from public.weekly_menus m where m.id = menu_id and m.owner_id = auth.uid())
  );

-- Convenience view for friends list with directions
create or replace view public.friends_with_profiles as
select
  f.id,
  f.user_id,
  f.friend_id,
  f.status,
  f.created_at,
  case when f.user_id = auth.uid() then p2.display_name else p1.display_name end as friend_display_name,
  case when f.user_id = auth.uid() then p2.phone else p1.phone end as friend_phone,
  case when f.friend_id = auth.uid() and f.status = 'pending' then 'pending_me'
       when f.user_id = auth.uid() and f.status = 'pending' then 'pending_them'
       else f.status::text end as direction_status
from public.friends f
join public.profiles p1 on p1.id = f.user_id
join public.profiles p2 on p2.id = f.friend_id
where f.user_id = auth.uid() or f.friend_id = auth.uid();

-- View combining own + shared recipes for easy listing
drop view if exists public.recipes_with_access;
create view public.recipes_with_access as
select r.*
from public.recipes r
where r.owner_id = auth.uid()
union
select r.*
from public.recipes r
join public.book_shares s on s.book_id = r.book_id
where s.user_id = auth.uid();
