import { getUtopia, onUtopia, setUtopia } from "../state";
import { EDITORIAL } from "./editorial";
import { createBranchViz } from "./branch";
import { fetchCrowd, getLocalVote, submitVote, type CrowdResult } from "./votes";

// Builds the interactive probability panel: the editorial anchor, the branch
// visualization, a slider the visitor drives, and the crowd 30-day average.

export function createProbabilitySection(): HTMLElement {
  const section = document.createElement("section");
  section.id = "probability";
  section.className = "section prob-section";

  section.innerHTML = /* html */ `
    <div class="section-head">
      <span class="eyebrow">The Choice</span>
      <h2>Utopia or dystopia?</h2>
      <p class="lede">
        Everything before October 2027 is roughly shared. Then the story forks. How
        likely do you think each ending is? Drag the dial — the whole scene responds.
      </p>
    </div>

    <div class="prob-grid">
      <div class="prob-left"></div>

      <div class="prob-right">
        <div class="dial">
          <div class="dial-readout">
            <div class="dial-side dial-utop">
              <span class="dial-pct" data-utop>38%</span>
              <span class="dial-name">Utopia</span>
            </div>
            <div class="dial-vs">vs</div>
            <div class="dial-side dial-dyst">
              <span class="dial-pct" data-dyst>62%</span>
              <span class="dial-name">Dystopia</span>
            </div>
          </div>
          <input id="prob-slider" class="slider" type="range" min="0" max="100" step="1"
                 value="38" aria-label="Probability of the utopia ending, in percent" />
          <div class="dial-scale"><span>Certain dystopia</span><span>Even</span><span>Certain utopia</span></div>
        </div>

        <div class="readouts">
          <div class="readout">
            <span class="readout-label">Editorial estimate</span>
            <span class="readout-value" data-editorial>${EDITORIAL.utopia}% utopia</span>
          </div>
          <div class="readout">
            <span class="readout-label">Crowd · last 30 days</span>
            <span class="readout-value" data-crowd>loading…</span>
          </div>
          <div class="readout">
            <span class="readout-label">Your vote</span>
            <span class="readout-value" data-yours>—</span>
          </div>
        </div>

        <button class="vote-btn" type="button">Cast my vote</button>
        <p class="vote-status" data-vote-status></p>

        <details class="rationale">
          <summary>Why this editorial estimate?</summary>
          <ul>
            ${EDITORIAL.rationale.map((r) => `<li>${r}</li>`).join("")}
          </ul>
          <p class="sources">
            Sources:
            ${EDITORIAL.sources
              .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
              .join(" · ")}
          </p>
          <p class="disclaimer">
            This is an explicitly editorial judgement offered as a starting point to
            argue with — not a claim of fact. The AI-2027 authors stress the outcome
            is a choice, not a prophecy.
          </p>
        </details>
      </div>
    </div>
  `;

  // Insert the branch visualization.
  section.querySelector(".prob-left")!.appendChild(createBranchViz());

  const slider = section.querySelector<HTMLInputElement>("#prob-slider")!;
  const utopEl = section.querySelector<HTMLElement>("[data-utop]")!;
  const dystEl = section.querySelector<HTMLElement>("[data-dyst]")!;
  const crowdEl = section.querySelector<HTMLElement>("[data-crowd]")!;
  const yoursEl = section.querySelector<HTMLElement>("[data-yours]")!;
  const voteBtn = section.querySelector<HTMLButtonElement>(".vote-btn")!;
  const voteStatus = section.querySelector<HTMLElement>("[data-vote-status]")!;

  // Keep the slider and readouts in sync with global state.
  slider.addEventListener("input", () => setUtopia(Number(slider.value)));
  onUtopia((u) => {
    slider.value = String(u);
    utopEl.textContent = `${u}%`;
    dystEl.textContent = `${100 - u}%`;
  });

  // Show any previous local vote.
  const prior = getLocalVote();
  if (prior != null) {
    yoursEl.textContent = `${prior}% utopia`;
    setUtopia(prior);
  }

  // Load the crowd average.
  const renderCrowd = (r: CrowdResult) => {
    if (r.source === "crowd" && r.average != null) {
      crowdEl.textContent = `${r.average}% utopia · ${r.count} vote${r.count === 1 ? "" : "s"}`;
    } else if (r.source === "crowd") {
      crowdEl.textContent = "no votes yet — be first";
    } else if (r.source === "local") {
      crowdEl.textContent = `${r.average}% (local only)`;
    } else {
      crowdEl.textContent = "unavailable";
    }
  };
  fetchCrowd().then(renderCrowd);

  voteBtn.addEventListener("click", async () => {
    const value = getUtopia();
    voteBtn.disabled = true;
    voteStatus.textContent = "Recording…";
    await submitVote(value);
    yoursEl.textContent = `${value}% utopia`;
    voteStatus.textContent = "Thanks — your vote is in.";
    const fresh = await fetchCrowd();
    renderCrowd(fresh);
    setTimeout(() => {
      voteBtn.disabled = false;
      voteStatus.textContent = "";
    }, 2500);
  });

  return section;
}
