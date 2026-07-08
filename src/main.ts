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
import { computeNow } from "./timeline/nowMarker";

gsap.registerPlugin(ScrollTrigger);

const BASE = import.meta.env.BASE_URL;

function createHero(): HTMLElement {
  const now = computeNow();
  const hero = document.createElement("header");
  hero.className = "hero";
  hero.innerHTML = /* html */ `
    <div class="hero-art" style="--split:url('${BASE}assets/split.jpg')"></div>
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
      <div class="hero-now glass">
        <span class="hero-now-label">Right now, we are</span>
        <span class="hero-now-value">${now.label}</span>
        <span class="hero-now-meta">${(now.overall * 100).toFixed(0)}% of the way to the branch point</span>
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

  // Animate the spine fill as you scroll the timeline.
  const fill = document.querySelector<HTMLElement>(".tl-spine-fill");
  const timeline = document.querySelector<HTMLElement>(".timeline");
  if (fill && timeline) {
    const target = fill.style.height;
    fill.style.height = "0%";
    gsap.to(fill, {
      height: target,
      ease: "none",
      scrollTrigger: {
        trigger: timeline,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 0.5,
      },
    });
  }
}

// Highlight the timeline entry we're currently at.
function markNow() {
  const now = computeNow();
  const el = document.querySelector<HTMLElement>(`.timeline .tl-item[data-index="${now.index}"]`);
  if (el) {
    el.classList.add("is-now");
    const badge = document.createElement("span");
    badge.className = "now-badge";
    badge.textContent = "You are here";
    el.querySelector(".tl-card-head")?.appendChild(badge);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
