import { TIMELINE, MILESTONE_LABELS, FULFILLMENT_LABELS } from "../data/timeline";
import { ENDINGS } from "../data/endings";
import { REALITY_LOG, REALITY_AS_OF, VERDICT_LABELS } from "../data/realityLog";
import { computeNow, computeScenarioProgress, computeLagMonths } from "./nowMarker";

// Renders the scroll-driven timeline, the "you are here" marker, the two
// endings, and the reality-check log. Pure DOM — GSAP/ScrollTrigger animate it
// from main.ts after mount.

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function createTimelineSection(): HTMLElement {
  const now = computeNow();
  const scenario = computeScenarioProgress();
  const lag = computeLagMonths();

  const section = document.createElement("section");
  section.id = "timeline";
  section.className = "section timeline-section";

  const items = TIMELINE.map((e, i) => {
    const milestoneTag = e.milestone
      ? `<span class="milestone-tag">◆ ${MILESTONE_LABELS[e.milestone]}</span>`
      : "";
    const branchClass = e.isBranch ? " is-branch" : "";
    const status = e.status ?? "pending";
    const statusPill =
      status !== "pending"
        ? `<span class="status-pill status-${status}">${FULFILLMENT_LABELS[status]}</span>`
        : "";
    const highlights = e.highlights
      .map((h) => `<li>${h}</li>`)
      .join("");
    return /* html */ `
      <article class="tl-item${branchClass} fs-${status}" data-index="${i}" id="tl-${e.id}">
        <div class="tl-marker"><span class="tl-dot"></span></div>
        <div class="tl-card glass">
          <div class="tl-card-head">
            <span class="tl-period">${e.period}</span>
            <span class="tl-date">${fmtDate(e.date)}</span>
            ${statusPill}
          </div>
          <h3 class="tl-title">${e.title} ${milestoneTag}</h3>
          <p class="tl-summary">${e.summary}</p>
          <ul class="tl-highlights">${highlights}</ul>
          <a class="tl-source" href="${e.source}" target="_blank" rel="noopener">
            Read the original forecast ↗
          </a>
        </div>
      </article>
    `;
  }).join("");

  const lagNote =
    lag != null && lag > 0
      ? `The real world is tracking about <strong>${lag} month${lag === 1 ? "" : "s"} behind</strong> the forecast's pace.`
      : lag != null && lag < 0
        ? `The real world is running about <strong>${-lag} month${lag === -1 ? "" : "s"} ahead</strong> of the forecast.`
        : `The real world is roughly <strong>on pace</strong> with the forecast.`;

  section.innerHTML = /* html */ `
    <div class="section-head">
      <span class="eyebrow">The Forecast</span>
      <h2>The road to superintelligence</h2>
      <p class="lede">
        A month-by-month scenario from the AI-2027 team — from today's stumbling
        agents to a superhuman AI researcher, and the choice that follows.
      </p>
      <div class="marker-legend">
        <span class="now-chip chip-real">🕒 Real time · ${now.label}</span>
        <span class="now-chip chip-scenario">✓ Scenario progress · ${scenario.label}</span>
      </div>
      <p class="marker-gap">${lagNote}</p>
    </div>
    <div class="timeline" data-now-index="${now.index}" data-scenario-index="${scenario.index}">
      <div class="tl-spine">
        <div class="tl-spine-fill scenario" style="height:${(scenario.overall * 100).toFixed(1)}%"></div>
        <div class="tl-spine-fill realtime" style="top:${(scenario.overall * 100).toFixed(1)}%;height:${(Math.max(0, now.overall - scenario.overall) * 100).toFixed(1)}%"></div>
      </div>
      ${items}
    </div>
  `;

  return section;
}

export function createEndingsSection(): HTMLElement {
  const section = document.createElement("section");
  section.id = "endings";
  section.className = "section endings-section";

  // Small hand-drawn SVG motif per ending: a luminous skyline for utopia,
  // a dark machine lattice for dystopia. Pure inline SVG, no assets.
  const endingArt = (kind: "utopia" | "dystopia") => {
    if (kind === "utopia") {
      return /* html */ `
        <svg class="ending-art" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="uSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#5ff0e0" stop-opacity="0.35"/>
              <stop offset="1" stop-color="#ffd36e" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <circle cx="320" cy="42" r="26" fill="#ffd36e" opacity="0.55"/>
          <circle cx="320" cy="42" r="40" fill="#ffd36e" opacity="0.12"/>
          <g fill="url(#uSky)" stroke="#5ff0e0" stroke-opacity="0.5">
            <rect x="30" y="70" width="24" height="50"/>
            <rect x="62" y="52" width="20" height="68"/>
            <rect x="90" y="80" width="18" height="40"/>
            <rect x="116" y="40" width="22" height="80"/>
            <rect x="146" y="64" width="18" height="56"/>
            <rect x="172" y="78" width="26" height="42"/>
            <rect x="206" y="50" width="20" height="70"/>
            <rect x="234" y="72" width="18" height="48"/>
          </g>
          <g fill="#5ff0e0" opacity="0.8">
            <circle cx="40" cy="26" r="1.5"/><circle cx="110" cy="18" r="1.5"/>
            <circle cx="180" cy="30" r="1.5"/><circle cx="250" cy="20" r="1.5"/>
          </g>
        </svg>`;
    }
    return /* html */ `
      <svg class="ending-art" viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="dCore" cx="0.72" cy="0.35" r="0.5">
            <stop offset="0" stop-color="#ff3b52" stop-opacity="0.6"/>
            <stop offset="1" stop-color="#ff3b52" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="400" height="120" fill="url(#dCore)"/>
        <g stroke="#ff3b52" stroke-opacity="0.4" fill="none">
          <path d="M0,90 L400,90 M0,60 L400,60 M0,30 L400,30"/>
          <path d="M50,0 L50,120 M110,0 L110,120 M170,0 L170,120 M230,0 L230,120 M290,0 L290,120 M350,0 L350,120"/>
        </g>
        <g fill="#ff3b52">
          <circle cx="110" cy="60" r="2.5"/><circle cx="230" cy="30" r="2.5"/>
          <circle cx="290" cy="90" r="2.5"/><circle cx="170" cy="90" r="2.5"/>
          <circle cx="288" cy="42" r="5" opacity="0.9"/>
        </g>
      </svg>`;
  };

  const card = (key: "slowdown" | "race") => {
    const e = ENDINGS[key];
    const steps = e.steps
      .map(
        (s) => /* html */ `
        <li class="ending-step">
          <div class="ending-step-period">${s.period}</div>
          <div class="ending-step-body">
            <h4>${s.title}</h4>
            <p>${s.summary}</p>
          </div>
        </li>`,
      )
      .join("");
    return /* html */ `
      <article class="ending-card glass ${e.kind}">
        ${endingArt(e.kind)}
        <div class="ending-badge">${e.kind === "utopia" ? "Utopia" : "Dystopia"}</div>
        <h3>${e.label}</h3>
        <p class="ending-tagline">${e.tagline}</p>
        <p class="ending-overview">${e.overview}</p>
        <ol class="ending-steps">${steps}</ol>
        <a class="tl-source" href="${e.source}" target="_blank" rel="noopener">
          Read the ${e.label.toLowerCase()} ending ↗
        </a>
      </article>
    `;
  };

  section.innerHTML = /* html */ `
    <div class="section-head">
      <span class="eyebrow">The Two Endings</span>
      <h2>One branch point. Two worlds.</h2>
      <p class="lede">
        After the October-2027 whistleblower, the Oversight Committee makes a
        decision — and the scenario splits into the futures below.
      </p>
    </div>
    <div class="endings-grid">
      ${card("slowdown")}
      ${card("race")}
    </div>
  `;
  return section;
}

export function createRealitySection(): HTMLElement {
  const section = document.createElement("section");
  section.id = "reality";
  section.className = "section reality-section";

  const rows = REALITY_LOG.map((r) => {
    const src = r.source
      ? `<a href="${r.source.url}" target="_blank" rel="noopener">${r.source.label} ↗</a>`
      : "";
    return /* html */ `
      <div class="reality-row glass">
        <div class="reality-period">${r.period}</div>
        <div class="reality-verdict verdict-${r.verdict}">${VERDICT_LABELS[r.verdict]}</div>
        <div class="reality-note">${r.note}${src ? `<div class="reality-src">${src}</div>` : ""}</div>
      </div>
    `;
  }).join("");

  section.innerHTML = /* html */ `
    <div class="section-head">
      <span class="eyebrow">Reality Check</span>
      <h2>How is the forecast holding up?</h2>
      <p class="lede">
        A hand-curated scorecard comparing the prediction to what has actually
        happened. Editorial commentary, updated periodically — last reviewed
        <strong>${REALITY_AS_OF}</strong>.
      </p>
    </div>
    <div class="reality-list">${rows}</div>
  `;
  return section;
}
