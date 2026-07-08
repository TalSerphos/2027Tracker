import "./styles/main.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initBackground } from "./scene/background";
import {
  createTimelineSection,
  createEndingsSection,
  createRealitySection,
} from "./timeline/render";
import { createProbabilitySection } from "./probability/slider";
import { MILESTONES, MILESTONE_LABELS } from "./data/timeline";
import { computeNow, computeScenarioProgress } from "./timeline/nowMarker";

gsap.registerPlugin(ScrollTrigger);

function createHero(): HTMLElement {
  const now = computeNow();
  const scenario = computeScenarioProgress();
  const hero = document.createElement("header");
  hero.className = "hero";
  hero.innerHTML = /* html */ `
    <div class="hero-art" aria-hidden="true">
      <div class="aurora aurora-a"></div>
      <div class="aurora aurora-b"></div>
      <svg class="hero-streams" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="streamUtop" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5ff0e0" stop-opacity="0"/>
            <stop offset="0.5" stop-color="#5ff0e0" stop-opacity="0.9"/>
            <stop offset="1" stop-color="#ffd36e" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="streamDyst" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#ff3b52" stop-opacity="0"/>
            <stop offset="0.5" stop-color="#ff3b52" stop-opacity="0.85"/>
            <stop offset="1" stop-color="#b3143a" stop-opacity="0.85"/>
          </linearGradient>
          <filter id="streamGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>
        <g filter="url(#streamGlow)" class="streams-up">
          <path d="M-100,470 C420,470 560,300 1540,150" />
          <path d="M-100,480 C440,480 580,360 1540,250" />
          <path d="M-100,490 C460,490 600,410 1540,340" />
        </g>
        <g filter="url(#streamGlow)" class="streams-down">
          <path d="M-100,470 C420,470 560,640 1540,780" />
          <path d="M-100,480 C440,480 580,600 1540,690" />
          <path d="M-100,490 C460,490 600,560 1540,600" />
        </g>
        <circle class="fork-node" cx="520" cy="482" r="6" />
      </svg>
    </div>
    <div class="hero-inner">
      <span class="eyebrow">Tracking the forecast at ai-2027.com</span>
      <h1 class="hero-title">
        The <span class="grad-utop">utopia</span> /
        <span class="grad-dyst">dystopia</span> split is coming.
      </h1>
      <p class="hero-sub">
        AI-2027 forecasts a month-by-month sprint from stumbling agents to
        superintelligence — ending in a single choice between two futures. This is
        a live tracker: where we are, what was predicted, and how likely each
        ending looks.
      </p>
      <div class="hero-markers">
        <div class="hero-now glass marker-real">
          <span class="hero-now-label">🕒 Real time</span>
          <span class="hero-now-value">${now.label}</span>
          <span class="hero-now-meta">${(now.overall * 100).toFixed(0)}% of the way to the branch point</span>
        </div>
        <div class="hero-now glass marker-scenario">
          <span class="hero-now-label">✓ Scenario progress</span>
          <span class="hero-now-value">${scenario.entry ? scenario.entry.period : "—"}</span>
          <span class="hero-now-meta">predictions fulfilled so far</span>
        </div>
      </div>
      <div class="hero-cta">
        <a class="btn btn-primary" href="#timeline">Explore the timeline</a>
        <a class="btn btn-ghost" href="#probability">Weigh the odds</a>
      </div>
      <div class="milestone-rail">
        ${MILESTONES.map(
          (m) => `<div class="mrail-item"><span class="mrail-code">${m.milestone}</span>
            <span class="mrail-name">${MILESTONE_LABELS[m.milestone]}</span>
            <span class="mrail-date">${m.period}</span></div>`,
        ).join("")}
      </div>
    </div>
    <div class="scroll-hint" aria-hidden="true"><span></span></div>
  `;
  return hero;
}

function createFooter(): HTMLElement {
  const f = document.createElement("footer");
  f.className = "site-footer";
  f.innerHTML = /* html */ `
    <p>
      An independent tracker for the
      <a href="https://ai-2027.com/" target="_blank" rel="noopener">AI 2027</a>
      scenario by Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland
      &amp; Romeo Dean. All predictions and quotes belong to the original authors.
    </p>
    <p class="footer-links">
      <a href="https://ai-2027.com/" target="_blank" rel="noopener">Full scenario</a> ·
      <a href="https://ai-2027.com/summary" target="_blank" rel="noopener">Summary</a> ·
      <a href="https://ai-2027.com/slowdown" target="_blank" rel="noopener">Slowdown ending</a> ·
      <a href="https://ai-2027.com/race" target="_blank" rel="noopener">Race ending</a>
    </p>
    <p class="footer-fine">
      Not affiliated with the AI-2027 authors. Editorial estimates and the reality
      scorecard are this site's own commentary, offered to be argued with.
    </p>
  `;
  return f;
}

function mount() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.appendChild(createHero());
  app.appendChild(createTimelineSection());
  app.appendChild(createProbabilitySection());
  app.appendChild(createEndingsSection());
  app.appendChild(createRealitySection());
  app.appendChild(createFooter());

  // WebGL background.
  const canvas = document.querySelector<HTMLCanvasElement>("#bg-canvas")!;
  try {
    initBackground(canvas);
  } catch (err) {
    console.warn("WebGL background unavailable", err);
    canvas.style.display = "none";
  }

  setupAnimations();
  markNow();
}

function setupAnimations() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.querySelectorAll(".tl-item, .ending-card, .reality-row").forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
    });
    return;
  }

  gsap.utils.toArray<HTMLElement>(".tl-item").forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 85%" },
    });
  });

  gsap.utils.toArray<HTMLElement>(".ending-card, .reality-row, .section-head").forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 88%" },
    });
  });

  // Grow both spine fills in as the timeline scrolls into view.
  gsap.utils.toArray<HTMLElement>(".tl-spine-fill").forEach((fill) => {
    const target = fill.style.height;
    gsap.from(fill, {
      height: "0%",
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: { trigger: ".timeline", start: "top 70%" },
      onComplete: () => {
        fill.style.height = target;
      },
    });
  });
}

// Highlight the two "you are here" entries: real-time and scenario progress.
function markNow() {
  const now = computeNow();
  const scenario = computeScenarioProgress();

  const addBadge = (index: number, cls: string, text: string) => {
    const el = document.querySelector<HTMLElement>(
      `.timeline .tl-item[data-index="${index}"]`,
    );
    if (!el) return;
    el.classList.add(cls);
    const badge = document.createElement("span");
    badge.className = `now-badge ${cls}-badge`;
    badge.textContent = text;
    el.querySelector(".tl-card-head")?.appendChild(badge);
  };

  // Scenario marker first, so if both land on the same card the real-time
  // badge appears last (leftmost emphasis stays on "today").
  if (scenario.index >= 0) addBadge(scenario.index, "is-scenario", "✓ Scenario is here");
  addBadge(now.index, "is-now", "🕒 Real time");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
