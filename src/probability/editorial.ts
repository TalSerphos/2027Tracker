// The editorial probability estimate for the utopia-vs-dystopia branch.
//
// This is an explicitly-labeled editorial judgement, not a claim of fact. It
// exists to give the slider a starting anchor and to be argued with. The point
// of the site is to invite readers to form their own view.

export interface EditorialEstimate {
  /** Editorial probability that we end up on the "utopia" (slowdown) path, 0–100. */
  utopia: number;
  rationale: string[];
  sources: { label: string; url: string }[];
}

export const EDITORIAL: EditorialEstimate = {
  utopia: 38,
  rationale: [
    "The AI-2027 authors deliberately wrote the race (dystopia) ending first, as their central-tendency extrapolation, and added the slowdown ending afterward as a plausible-but-not-default hopeful alternative.",
    "The branch turns on hard, unsolved problems — verifiable alignment and interpretability of superhuman systems — landing before an intelligence explosion, and on institutions choosing caution under intense competitive pressure.",
    "Countervailing reasons for optimism: rising safety investment, that real timelines may run slower than the scenario (buying time), and that a visible near-miss could itself trigger the slowdown the good ending depends on.",
    "Net: a considered lean toward the race path being more likely than the slowdown path — while stressing this is one forecast, the error bars are enormous, and the whole point is that the outcome is still a choice.",
  ],
  sources: [
    { label: "AI 2027 — full scenario", url: "https://ai-2027.com/" },
    { label: "AI 2027 — slowdown ending", url: "https://ai-2027.com/slowdown" },
    { label: "AI 2027 — race ending", url: "https://ai-2027.com/race" },
  ],
};
