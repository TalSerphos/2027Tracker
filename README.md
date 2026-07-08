# AI 2027 Tracker

A live, interactive tracker for the [AI 2027](https://ai-2027.com/) forecast — the
month-by-month scenario of how AI could sprint from stumbling agents to
superintelligence, and the October-2027 branch point that splits into a
**utopia (slowdown)** ending and a **dystopia (race)** ending.

**Live site:** https://talserphos.github.io/2027tracker/

## What it does

- **Interactive timeline** of the forecast (mid-2025 → the branch), each point
  with a summary, key specifics, capability milestones (SC / SAR / SIAR / ASI),
  and a link back to the original.
- **"You are here" marker** computed from today's date — it advances on its own.
- **Utopia-vs-dystopia probability**: an editorial estimate, an interactive
  slider that drives a WebGL scene + branch visualization, and a **crowd average
  of all slider votes from the last 30 days**.
- **The two endings**, side by side.
- **Reality-check scorecard** grading the forecast against what has actually
  happened (curated, editable commentary).

## Tech

- Vite + TypeScript, Three.js (WebGL particle field), GSAP (scroll animation).
- Supabase for the crowd-averaged vote (optional — degrades to a local vote).
- Deployed to GitHub Pages via GitHub Actions.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview
```

## Enabling the crowd vote (Supabase)

1. Create a free Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor. It creates
   the `votes` table, row-level security (anon can only insert), and the
   `avg_last_30d()` aggregate function.
3. Add the project URL and public **anon** key as GitHub repo secrets
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (and to `.env.local` for
   local dev — see `.env.example`).

Without these, the vote still works but is stored only in the visitor's browser.

## Enabling GitHub Pages

Repo **Settings → Pages → Source → "GitHub Actions"**. Every push to the
deployment branch rebuilds and publishes automatically.

## Credits

All predictions, quotes, and the underlying scenario belong to the AI-2027
authors: Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland, and
Romeo Dean. This tracker is an independent, unaffiliated project; the editorial
probability and reality scorecard are its own commentary.
