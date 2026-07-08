// Reality check: how the forecast is holding up against the actual world.
//
// This is curated, editable commentary — NOT an automated feed. Update the
// entries and `asOf` over time as events unfold. Each entry links to a source
// so readers can judge for themselves. Verdicts are deliberately coarse.

export type Verdict = "on-track" | "mixed" | "off-track" | "too-early";

export interface RealityEntry {
  /** Which forecast period this comments on. */
  period: string;
  verdict: Verdict;
  note: string;
  source?: { label: string; url: string };
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  "on-track": "Tracking",
  mixed: "Mixed",
  "off-track": "Behind forecast",
  "too-early": "Too early to tell",
};

/** When this log was last curated. Shown in the UI. */
export const REALITY_AS_OF = "2026-07";

export const REALITY_LOG: RealityEntry[] = [
  {
    period: "Mid 2025 · Stumbling Agents",
    verdict: "on-track",
    note: "Broadly matched reality: capable-but-unreliable coding and computer-use agents shipped from the major labs, impressive in demos and uneven in practice — much as the scenario described.",
    source: {
      label: "AI Futures — Grading AI-2027's 2025 predictions",
      url: "https://blog.aifutures.org/p/grading-ai-2027s-2025-predictions",
    },
  },
  {
    period: "Late 2025 · Most Expensive AI",
    verdict: "mixed",
    note: "The direction was right — record datacenter build-outs and agents aimed at accelerating research — but public frontier capabilities and the concrete 10²⁷-FLOP 'Agent-0/Agent-1' framing were faster/cleaner in the story than on the ground.",
    source: {
      label: "One year later — a timeline check",
      url: "https://futuresearch.ai/blog/ai-2027-one-year-later/",
    },
  },
  {
    period: "Early–Mid 2026 · Coding automation & China",
    verdict: "too-early",
    note: "This is roughly where the real world sits now. Watch three dials: how much AI is actually accelerating lab R&D, how fast entry-level engineering demand shifts, and how centralized China's compute build-out becomes.",
  },
  {
    period: "2027 · Superhuman coder → researcher",
    verdict: "too-early",
    note: "The scenario's own authors flag 2027 as their median guess that could be off by up to ~5× in either direction. The capability-milestone dates (SC, SAR, SIAR, ASI) are the load-bearing, most-uncertain claims.",
    source: {
      label: "AI 2027 — Summary",
      url: "https://ai-2027.com/summary",
    },
  },
];
