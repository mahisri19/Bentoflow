-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tasks Table
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date text, 
  due_time text,
  priority text,
  completed boolean default false,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table tasks enable row level security;
create policy "Users can select their own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks for delete using (auth.uid() = user_id);

-- Habits Table
create table if not exists habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text,
  color text,
  streak integer default 0,
  days_of_week boolean[] default array[true, true, true, true, true, true, true],
  completed_dates text[] default array[]::text[], 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table habits enable row level security;
create policy "Users can select their own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on habits for delete using (auth.uid() = user_id);

-- Schedule Items Table
create table if not exists schedule_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  start_time text,
  end_time text,
  location text,
  color text,
  date text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table schedule_items enable row level security;
create policy "Users can select their own schedule items" on schedule_items for select using (auth.uid() = user_id);
create policy "Users can insert their own schedule_items" on schedule_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own schedule_items" on schedule_items for update using (auth.uid() = user_id);
create policy "Users can delete their own schedule_items" on schedule_items for delete using (auth.uid() = user_id);

-- Events Table
create table if not exists events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  date text,
  start_time text,
  location text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table events enable row level security;
create policy "Users can select their own events" on events for select using (auth.uid() = user_id);
create policy "Users can insert their own events" on events for insert with check (auth.uid() = user_id);
create policy "Users can update their own events" on events for update using (auth.uid() = user_id);
create policy "Users can delete their own events" on events for delete using (auth.uid() = user_id);

-- Routines Table (Items stored as JSONB)
create table if not exists routines (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  start_time text,
  end_time text,
  days_of_week text[],
  icon text,
  color text,
  items jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table routines enable row level security;
create policy "Users can select their own routines" on routines for select using (auth.uid() = user_id);
create policy "Users can insert their own routines" on routines for insert with check (auth.uid() = user_id);
create policy "Users can update their own routines" on routines for update using (auth.uid() = user_id);
create policy "Users can delete their own routines" on routines for delete using (auth.uid() = user_id);
