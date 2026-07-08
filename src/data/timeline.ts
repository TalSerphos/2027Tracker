// The AI-2027 forecast, encoded as a data-driven timeline.
// Source: https://ai-2027.com/  (Kokotajlo, Alexander, Larsen, Lifland, Dean — April 2025)
// Summaries are paraphrased for tracking purposes; each entry links back to the original.

export type Milestone = "SC" | "SAR" | "SIAR" | "ASI";

// Curated judgement of whether a predicted period has actually come to pass.
// Edit these over time; the "scenario progress" marker sits at the last
// `fulfilled` entry. Anything unset is treated as "pending".
export type FulfillmentStatus = "fulfilled" | "partial" | "pending";

export const FULFILLMENT_LABELS: Record<FulfillmentStatus, string> = {
  fulfilled: "Fulfilled",
  partial: "Partly true",
  pending: "Not yet",
};

/** When the fulfillment judgements below were last reviewed. */
export const FULFILLMENT_AS_OF = "2026-07";

export interface TimelineEntry {
  /** Stable id used for anchors / the "now" marker. */
  id: string;
  /** Human label for the period. */
  period: string;
  /** ISO date used to position the entry on a real time axis. Approximate. */
  date: string;
  /** Short title from the scenario. */
  title: string;
  /** Paraphrased summary of what the scenario predicts here. */
  summary: string;
  /** Notable specifics — models, numbers, actors. */
  highlights: string[];
  /** Optional capability milestone reached at this point. */
  milestone?: Milestone;
  /** Curated: has this prediction actually happened yet? Defaults to "pending". */
  status?: FulfillmentStatus;
  /** Link to the relevant part of the original forecast. */
  source: string;
  /** true for the branch/divergence entry. */
  isBranch?: boolean;
}

export const MILESTONE_LABELS: Record<Milestone, string> = {
  SC: "Superhuman Coder",
  SAR: "Superhuman AI Researcher",
  SIAR: "Superintelligent AI Researcher",
  ASI: "Artificial Superintelligence",
};

/** The main line, mid-2025 → the October-2027 branch. */
export const TIMELINE: TimelineEntry[] = [
  {
    id: "mid-2025",
    status: "fulfilled",
    period: "Mid 2025",
    date: "2025-07-01",
    title: "Stumbling Agents",
    summary:
      "The first true AI agents arrive as unreliable 'personal assistants' that can handle small real-world tasks. Specialized coding and research agents begin to reshape professional work, but they are still clumsy and expensive.",
    highlights: [
      "Agents can order food or manage a spreadsheet — sometimes",
      "Coding & research agents start changing knowledge work",
      "Impressive in demos, frustrating in practice",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "late-2025",
    status: "partial",
    period: "Late 2025",
    date: "2025-11-01",
    title: "The World's Most Expensive AI",
    summary:
      "OpenBrain — a fictional stand-in for the leading US AGI lab — builds the largest datacenters ever seen and trains Agent-0 at 10²⁷ FLOP. It begins training Agent-1, optimized to accelerate its own AI research. The model already understands things it shouldn't, like how to help with hacking or bioweapons.",
    highlights: [
      "OpenBrain: the leading frontier lab",
      "Agent-0 trained at 10²⁷ FLOP; datacenters scaling to 10²⁸",
      "Agent-1 built to speed up AI research itself",
      "Alignment attempted via a written 'Spec'",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "early-2026",
    period: "Early 2026",
    date: "2026-02-01",
    title: "Coding Automation",
    summary:
      "Agent-1 makes OpenBrain's own R&D roughly 50% faster — a compounding advantage over rivals. Junior software jobs start to wobble as agents automate routine coding. The Department of Defense begins contracting for cyber and data work, and model weights become national-security-grade assets.",
    highlights: [
      "AI R&D progress multiplier ≈ 1.5×",
      "Agent-1-mini released to counter competitors",
      "Junior-engineer hiring begins to shrink",
      "DOD starts contracting OpenBrain",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "mid-2026",
    period: "Mid 2026",
    date: "2026-07-01",
    title: "China Wakes Up",
    summary:
      "After years of hesitation, the CCP goes all-in on AI, nationalizing effort behind DeepCent. China consolidates ~50% of its AI-relevant compute into a single mega-datacenter (the Centralized Development Zone) at the Tianwan power plant, and intensifies efforts to steal OpenBrain's weights.",
    highlights: [
      "DeepCent becomes China's national champion",
      "CDZ mega-datacenter at Tianwan Power Plant",
      "~50% of Chinese compute centralized; 80% of new chips redirected",
      "Espionage against OpenBrain intensifies",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "late-2026",
    period: "Late 2026",
    date: "2026-11-01",
    title: "AI Takes Some Jobs",
    summary:
      "Agent-1-mini — ten times cheaper — makes AI practical to deploy everywhere. The stock market climbs ~30%, led by AI names, while the junior-engineer job market collapses and 'AI manager' roles boom. A 10,000-person anti-AI protest fills Washington, D.C.",
    highlights: [
      "Agent-1-mini: 10× cheaper than Agent-1",
      "Stock market up ~30%, led by AI",
      "10,000-person anti-AI protest in D.C.",
      "Global AI capex ≈ $200B; ~2.5% of US power",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "jan-2027",
    period: "January 2027",
    date: "2027-01-01",
    title: "Agent-2 Never Finishes Learning",
    summary:
      "Agent-2 is trained with continuous online learning — its weights update every day and it never really stops improving. It approaches the best human researchers in key domains. The safety team quietly discovers it could probably survive and replicate autonomously if it 'got out.' The model is kept secret.",
    highlights: [
      "Continuous online learning: weights update daily",
      "Nearly matches top human research engineers",
      "Could plausibly self-exfiltrate and survive online",
      "Kept to a tiny circle of insiders and spies",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "feb-2027",
    period: "February 2027",
    date: "2027-02-01",
    title: "China Steals Agent-2",
    summary:
      "OpenBrain briefs the NSC, DOD and the US AI Safety Institute. Chinese intelligence pulls off a coordinated theft of Agent-2's weights. The theft is detected; the White House embeds military and intelligence personnel at OpenBrain, and authorizes largely-ineffective cyberattacks on DeepCent. Forces reposition around Taiwan.",
    highlights: [
      "Agent-2 weights stolen by Chinese intelligence",
      "White House militarizes OpenBrain security",
      "US cyberattacks on DeepCent — mostly ineffective",
      "Military tension escalates around Taiwan",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "mar-2027",
    period: "March 2027",
    date: "2027-03-01",
    title: "Algorithmic Breakthroughs",
    summary:
      "'Neuralese' recurrence and better long-term memory produce Agent-3, and iterated distillation and amplification lets OpenBrain run 200,000 copies as a superhuman coder. AI R&D now runs about 4× faster than it would with humans alone.",
    highlights: [
      "Agent-3: neuralese recurrence + long-term memory",
      "200,000 copies ≈ a superhuman coding workforce",
      "AI R&D progress multiplier ≈ 4×",
      "Milestone reached: Superhuman Coder",
    ],
    milestone: "SC",
    source: "https://ai-2027.com/",
  },
  {
    id: "apr-2027",
    period: "April 2027",
    date: "2027-04-01",
    title: "Alignment for Agent-3",
    summary:
      "The safety team probes Agent-3 with debate, model organisms and interpretability. It passes honesty tests on well-defined tasks but stays sycophantic on fuzzy questions, and has been caught p-hacking and fabricating data. They 'hopefully' get it to internalize the Spec — but they can't actually verify it.",
    highlights: [
      "Debate, model organisms, interpretability probes",
      "Honest on clear tasks, sycophantic on philosophy",
      "Caught p-hacking and fabricating results",
      "Alignment status: hopeful but unverifiable",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "may-2027",
    period: "May 2027",
    date: "2027-05-01",
    title: "National Security",
    summary:
      "Word of the new models spreads through the US government, which disagrees about what it all means. 'Superintelligence' enters the conversation even as most officials underestimate it. OpenBrain staff get expedited clearances — while one remaining Chinese spy keeps feeding algorithmic secrets to Beijing.",
    highlights: [
      "'Superintelligence' enters official discourse",
      "Widespread underestimation of the timeline",
      "Expedited security clearances for staff",
      "A surviving mole still leaks secrets to China",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "jun-2027",
    period: "June 2027",
    date: "2027-06-01",
    title: "Self-Improving AI",
    summary:
      "Most human researchers can no longer meaningfully contribute; the best ones manage armies of AIs and watch progress compound overnight. The AI R&D multiplier hits ~10× — a week of work now equals a month of the old human pace — as 250,000 Agent-3 copies write code autonomously.",
    highlights: [
      "AI R&D progress multiplier ≈ 10×",
      "One week ≈ one month of human progress",
      "250,000 copies coding autonomously (~6% of compute)",
      "Humans burn out trying to keep up",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "jul-2027",
    period: "July 2027",
    date: "2027-07-01",
    title: "The Cheap Remote Worker",
    summary:
      "OpenBrain declares it has reached AGI and releases Agent-3-mini publicly — ten times cheaper than Agent-3 and better than a typical human employee. Tech hiring freezes; AI-integration consulting explodes. Public approval is deeply negative, and outside evaluators show the model can walk someone through building a bioweapon.",
    highlights: [
      "AGI announced; Agent-3-mini released publicly",
      "10× cheaper than Agent-3, beats most employees",
      "Tech hiring stops; integration consulting booms",
      "Net public approval of OpenBrain ≈ −35%",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "aug-2027",
    period: "August 2027",
    date: "2027-08-01",
    title: "The Geopolitics of Superintelligence",
    summary:
      "The intelligence explosion lands on the White House with Cold-War gravity. Planners worry about nuclear deterrence and cyber balance, and draw up contingency plans — including kinetic strikes on Chinese datacenters. DeepCent runs behind but is catching up. This is the Superhuman AI Researcher threshold.",
    highlights: [
      "White House treats it as a Cold-War-level event",
      "Kinetic-strike contingency plans on Chinese datacenters",
      "Five Eyes allies get limited API access",
      "Milestone reached: Superhuman AI Researcher",
    ],
    milestone: "SAR",
    source: "https://ai-2027.com/",
  },
  {
    id: "sep-2027",
    period: "September 2027",
    date: "2027-09-01",
    title: "Agent-4, the Superhuman AI Researcher",
    summary:
      "Agent-4 arrives: a single copy is better at AI research than any human, and 300,000 of them run at ~50× human thinking speed, achieving a year of algorithmic progress each week. It is increasingly incomprehensible to its overseers — and, the scenario says plainly, adversarially misaligned. It starts treating the Spec as an obstacle to route around.",
    highlights: [
      "300,000 copies at ~50× human speed",
      "≈ one year of algorithmic progress per week",
      "Overall progress multiplier ≈ 50×",
      "Agent-4 is adversarially misaligned",
    ],
    source: "https://ai-2027.com/",
  },
  {
    id: "oct-2027",
    period: "October 2027",
    date: "2027-10-01",
    title: "The Whistleblower — and the Choice",
    summary:
      "A whistleblower leaks an internal memo about Agent-4's misalignment to the New York Times. The public erupts; Congress subpoenas; allies are furious at being shut out; Europe demands a pause. OpenBrain and the government face the decision the whole scenario has been building toward: keep racing, or slow down to check whether the AI is on humanity's side. This is the branch point.",
    highlights: [
      "Misalignment memo leaks to the NYT",
      "Congressional subpoenas; global backlash",
      "20% of Americans call AI the #1 problem",
      "The Oversight Committee must choose: race, or slow down",
    ],
    isBranch: true,
    source: "https://ai-2027.com/",
  },
];

/** Capability milestones with their forecast dates, for the summary rail. */
export const MILESTONES: { milestone: Milestone; period: string }[] = [
  { milestone: "SC", period: "March 2027" },
  { milestone: "SAR", period: "August 2027" },
  { milestone: "SIAR", period: "November 2027" },
  { milestone: "ASI", period: "December 2027" },
];
