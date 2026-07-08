import { TIMELINE } from "../data/timeline";

// Works out where "now" falls along the forecast timeline, so the marker
// advances automatically over time without any manual editing.

export interface NowPosition {
  /** Index of the entry we're at or just past. */
  index: number;
  /** The entry we're currently within/nearest. */
  current: (typeof TIMELINE)[number];
  /** The next entry (or undefined if past the end). */
  next?: (typeof TIMELINE)[number];
  /** Fractional progress (0–1) between `current` and `next`. */
  fraction: number;
  /** Fractional progress (0–1) across the whole timeline. */
  overall: number;
  /** Human summary, e.g. "between Mid 2026 and Late 2026". */
  label: string;
  /** True once we're at/after the final (branch) entry. */
  atBranch: boolean;
}

export function computeNow(now: Date = new Date()): NowPosition {
  const t = now.getTime();
  const times = TIMELINE.map((e) => new Date(e.date).getTime());
  const first = times[0];
  const last = times[times.length - 1];

  // Before the timeline starts.
  if (t <= first) {
    return {
      index: 0,
      current: TIMELINE[0],
      next: TIMELINE[1],
      fraction: 0,
      overall: 0,
      label: `approaching ${TIMELINE[0].period}`,
      atBranch: false,
    };
  }
  // At or past the branch.
  if (t >= last) {
    return {
      index: TIMELINE.length - 1,
      current: TIMELINE[TIMELINE.length - 1],
      fraction: 1,
      overall: 1,
      label: `at the branch point — ${TIMELINE[TIMELINE.length - 1].period}`,
      atBranch: true,
    };
  }

  // Find the segment we're inside.
  let index = 0;
  for (let i = 0; i < times.length - 1; i++) {
    if (t >= times[i] && t < times[i + 1]) {
      index = i;
      break;
    }
  }
  const segStart = times[index];
  const segEnd = times[index + 1];
  const fraction = (t - segStart) / (segEnd - segStart);
  const overall = (t - first) / (last - first);
  const current = TIMELINE[index];
  const next = TIMELINE[index + 1];

  return {
    index,
    current,
    next,
    fraction,
    overall,
    label:
      fraction < 0.25
        ? `at ${current.period}`
        : `between ${current.period} and ${next.period}`,
    atBranch: false,
  };
}
