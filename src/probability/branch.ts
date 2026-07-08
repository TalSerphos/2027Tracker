import { onUtopia } from "../state";

// The visual centerpiece of the branch point: a single road that forks into a
// bright "utopia" path and a dark "dystopia" path. The relative glow and width
// of each fork track the current probability. Rendered as crisp SVG so it stays
// sharp at any size and layers cleanly over the WebGL background.

export function createBranchViz(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "branch-viz";
  wrap.innerHTML = /* html */ `
    <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid meet" class="branch-svg" role="img"
         aria-label="A single path forking into a utopia route and a dystopia route">
      <defs>
        <linearGradient id="utopiaGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#ffd36e"/>
          <stop offset="1" stop-color="#5ff0e0"/>
        </linearGradient>
        <linearGradient id="dystopiaGrad" x1="0" y1="1" x2="1" y2="1">
          <stop offset="0" stop-color="#ff3b52"/>
          <stop offset="1" stop-color="#7a1030"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- shared trunk -->
      <path class="trunk" d="M40,210 C200,210 240,210 360,210"
            fill="none" stroke="#9fb0d0" stroke-width="10" stroke-linecap="round"/>

      <!-- dystopia fork (down) -->
      <path class="fork fork-dyst" d="M360,210 C520,210 560,360 760,360"
            fill="none" stroke="url(#dystopiaGrad)" stroke-linecap="round"/>
      <!-- utopia fork (up) -->
      <path class="fork fork-utop" d="M360,210 C520,210 560,60 760,60"
            fill="none" stroke="url(#utopiaGrad)" stroke-linecap="round"/>

      <circle class="node" cx="360" cy="210" r="9" fill="#eaf0ff"/>

      <g class="lbl lbl-utop">
        <text x="770" y="52" text-anchor="end">Utopia · Slowdown</text>
        <text x="770" y="74" text-anchor="end" class="pct pct-utop">—</text>
      </g>
      <g class="lbl lbl-dyst">
        <text x="770" y="352" text-anchor="end">Dystopia · Race</text>
        <text x="770" y="374" text-anchor="end" class="pct pct-dyst">—</text>
      </g>
    </svg>
  `;

  const utop = wrap.querySelector<SVGPathElement>(".fork-utop")!;
  const dyst = wrap.querySelector<SVGPathElement>(".fork-dyst")!;
  const pctU = wrap.querySelector<SVGTextElement>(".pct-utop")!;
  const pctD = wrap.querySelector<SVGTextElement>(".pct-dyst")!;

  onUtopia((u) => {
    const utopiaFrac = u / 100;
    const dystFrac = 1 - utopiaFrac;
    // Width and opacity encode the probability; keep a legible minimum.
    utop.style.strokeWidth = `${4 + utopiaFrac * 20}`;
    dyst.style.strokeWidth = `${4 + dystFrac * 20}`;
    utop.style.opacity = `${0.35 + utopiaFrac * 0.65}`;
    dyst.style.opacity = `${0.35 + dystFrac * 0.65}`;
    utop.style.filter = utopiaFrac > 0.5 ? "url(#glow)" : "none";
    dyst.style.filter = dystFrac > 0.5 ? "url(#glow)" : "none";
    pctU.textContent = `${u}%`;
    pctD.textContent = `${100 - u}%`;
  });

  return wrap;
}
