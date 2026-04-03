import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to https://supabase.com → create a free project
// 2. Project Settings → API → copy Project URL and anon/public key
// 3. In Vercel: Settings → Environment Variables → add:
//      VITE_SUPABASE_URL      = https://yourproject.supabase.co
//      VITE_SUPABASE_ANON_KEY = eyJ...
// 4. Redeploy after adding the variables
// 5. Run this SQL in Supabase SQL Editor:
//
// create table user_profiles (
//   id uuid references auth.users primary key,
//   name text,
//   created_at timestamptz default now()
// );
// create table user_prs (
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid references auth.users not null,
//   lift_name text not null,
//   weight numeric not null,
//   reps integer not null,
//   estimated_1rm numeric not null,
//   logged_at timestamptz default now()
// );
// create table user_data (
//   id uuid references auth.users primary key,
//   history jsonb default '[]',
//   notes jsonb default '{}',
//   custom_workouts jsonb default '[]',
//   preset_overrides jsonb default '{}',
//   settings jsonb default '{}',
//   updated_at timestamptz default now()
// );
// alter table user_profiles enable row level security;
// alter table user_prs enable row level security;
// alter table user_data enable row level security;
// create policy "own profile" on user_profiles for all using (auth.uid() = id);
// create policy "own prs" on user_prs for all using (auth.uid() = user_id);
// create policy "own data" on user_data for all using (auth.uid() = id);
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// isConfigured — app works fully without Supabase, just no cloud sync
export const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Only create the client if both values are present — prevents crash on missing env vars
export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
