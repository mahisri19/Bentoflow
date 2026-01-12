-- Timer/User Stats
create table if not exists user_stats (
    user_id uuid references auth.users not null primary key,
    total_focus_time integer default 0,
    last_updated_date text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table user_stats enable row level security;

do $$ begin
  create policy "Users can select own stats" on user_stats for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert own stats" on user_stats for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own stats" on user_stats for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Check Events 'completed'
do $$ 
begin 
    alter table events add column completed boolean default false; 
exception 
    when duplicate_column then null; 
end $$;
