// Runtime configuration.
//
// Supabase powers the crowd-averaged probability vote. The anon key is safe to
// expose publicly: row-level security (see supabase/schema.sql) only allows
// inserting a vote and reading an aggregate, never reading raw rows.
//
// These can be provided at build time via Vite env vars
// (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) or pasted directly below.
// If left blank, the site degrades gracefully to a localStorage-only vote.

const env = import.meta.env as Record<string, string | undefined>;

export const SUPABASE_URL = env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? "";

export const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
