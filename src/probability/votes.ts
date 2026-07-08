import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_ENABLED, SUPABASE_URL } from "../config";

// Records the visitor's probability vote and reads the crowd average over the
// last 30 days. Backed by Supabase when configured; otherwise falls back to a
// localStorage-only "your vote" so the UI always works.

export interface CrowdResult {
  /** Average utopia probability over the last 30 days, or null if none/unavailable. */
  average: number | null;
  /** Number of votes counted. */
  count: number;
  /** Where the number came from. */
  source: "crowd" | "local" | "none";
}

const LOCAL_KEY = "ai2027.myVote";

let client: SupabaseClient | null = null;
function db(): SupabaseClient | null {
  if (!SUPABASE_ENABLED) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

export function getLocalVote(): number | null {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function setLocalVote(value: number): void {
  localStorage.setItem(LOCAL_KEY, String(Math.round(value)));
}

/** Insert a vote. Always stores locally; also pushes to Supabase if enabled. */
export async function submitVote(utopia: number): Promise<void> {
  const value = Math.max(0, Math.min(100, Math.round(utopia)));
  setLocalVote(value);
  const c = db();
  if (!c) return;
  try {
    await c.from("votes").insert({ utopia_prob: value });
  } catch (err) {
    // Non-fatal: the local vote is still recorded.
    console.warn("Vote sync failed; kept locally.", err);
  }
}

/** Fetch the 30-day crowd average, degrading to the local vote if needed. */
export async function fetchCrowd(): Promise<CrowdResult> {
  const c = db();
  if (c) {
    try {
      // avg_last_30d() is a SECURITY DEFINER RPC (see supabase/schema.sql) that
      // returns { avg, n } without exposing individual rows.
      const { data, error } = await c.rpc("avg_last_30d");
      if (!error && data) {
        const row = Array.isArray(data) ? data[0] : data;
        const avg = row?.avg;
        const n = row?.n ?? 0;
        if (avg != null && n > 0) {
          return { average: Math.round(Number(avg)), count: Number(n), source: "crowd" };
        }
        return { average: null, count: 0, source: "crowd" };
      }
      console.warn("Crowd fetch error", error);
    } catch (err) {
      console.warn("Crowd fetch failed", err);
    }
  }
  const local = getLocalVote();
  if (local != null) return { average: local, count: 1, source: "local" };
  return { average: null, count: 0, source: "none" };
}
