import { TIMELINE, MILESTONE_LABELS } from "../data/timeline";
import { ENDINGS } from "../data/endings";
import { REALITY_LOG, REALITY_AS_OF, VERDICT_LABELS } from "../data/realityLog";
import { computeNow } from "./nowMarker";

// Renders the scroll-driven timeline, the "you are here" marker, the two
// endings, and the reality-check log. Pure DOM — GSAP/ScrollTrigger animate it
// from main.ts after mount.

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function createTimelineSection(): HTMLElement {
  const now = computeNow();

  const section = document.createElement("section");
  section.id = "timeline";
  section.className = "section timeline-section";

  const items = TIMELINE.map((e, i) => {
    const milestoneTag = e.milestone
      ? `<span class="milestone-tag">◆ ${MILESTONE_LABELS[e.milestone]}</span>`
      : "";
    const branchClass = e.isBranch ? " is-branch" : "";
    const highlights = e.highlights
      .map((h) => `<li>${h}</li>`)
      .join("");
    return /* html */ `
      <article class="tl-item${branchClass}" data-index="${i}" id="tl-${e.id}">
        <div class="tl-marker"><span class="tl-dot"></span></div>
        <div class="tl-card glass">
          <div class="tl-card-head">
            <span class="tl-period">${e.period}</span>
            <span class="tl-date">${fmtDate(e.date)}</span>
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

  section.innerHTML = /* html */ `
    <div class="section-head">
      <span class="eyebrow">The Forecast</span>
      <h2>The road to superintelligence</h2>
      <p class="lede">
        A month-by-month scenario from the AI-2027 team — from today's stumbling
        agents to a superhuman AI researcher, and the choice that follows.
        <span class="now-chip">You are here: ${now.label}</span>
      </p>
    </div>
    <div class="timeline" data-now-index="${now.index}">
      <div class="tl-spine"><div class="tl-spine-fill" style="height:${(now.overall * 100).toFixed(1)}%"></div></div>
      ${items}
    </div>
  `;

  return section;
}

export function createEndingsSection(): HTMLElement {
  const section = document.createElement("section");
  section.id = "endings";
  section.className = "section endings-section";

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
