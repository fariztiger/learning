# TIGERFX ACADEMY

**From Zero Knowledge to Independent Trading Mastery**

A premium, interactive, bilingual (Bahasa Melayu 🇲🇾 / English 🇬🇧) trading education platform — animated visual lessons, a professional chart simulator with structural drawing feedback, a scenario-based Practice Arena, and a risk-first toolkit. Built with Next.js 14, TypeScript and Tailwind CSS. Deployable to Vercel with zero configuration.

> **Education only — never financial advice.** No strategy promises profit. All charts and market data on this platform are deterministic **synthetic teaching data**, not real market prices.

---

## Quick start

```bash
npm install
npm run dev        # development → http://localhost:3000
npm run build      # production build (passes clean)
npm run start      # serve the production build
npm run typecheck  # strict TypeScript check (passes clean)
```

Requirements: Node.js ≥ 18 (tested on Node 20 / npm 10).

## Deploy to Vercel

1. Push this repository to GitHub/GitLab.
2. Import it in Vercel — `vercel.json` is preconfigured (`framework: nextjs`, region `sin1`).
3. Deploy. No environment variables required.

`next/font` self-hosts Inter + Space Grotesk at build time, so the production site makes **no third-party font requests**.

---

## What's inside

| Route | Product |
|---|---|
| `/` | Premium landing: animated hero chart, curriculum path, method, risk-first promise |
| `/learn` | Curriculum overview: 5 levels, 34 lessons, progress, XP, streaks |
| `/learn/[levelId]/[lessonId]` | Lesson player: animated chart scenes, quizzes with per-option explanations, clickable chart tasks, 9 interactive widgets |
| `/simulator` | **Flagship chart simulator**: candle-by-candle replay (no future data), 10 drawing tools, trade planner with live R:R, rule-based structural feedback, guided tasks |
| `/arena` | Practice Arena: 11 graded scenarios across 4 tiers (incl. certification run) with reasoning feedback |
| `/dashboard` | Roadmap, skills profile, achievements, streaks, activity history, progress export/import |
| `/tools` | Position-size & risk sandbox, R:R builder, live session clock (MYT, DST-aware), economic news guide |
| `/glossary` | 30+ bilingual flip-card trading terms with search & categories |
| `/about` | Founder profile & custom trading tools services (EAs, indicators, dashboards, Pine Script, strategy conversion, backtesting) with direct inquiry form |
| `/broker` | Optional Valetax registration (lazy iframe, referral disclosure, risk info, fallback link) |

### Curriculum

- **Level 1 — Absolute Beginner:** what trading is, Forex & XAUUSD, bid/ask/spread, candlesticks (anatomy lab), timeframes, lots/leverage/margin, P&L and R-multiples.
- **Level 2 — Reading Price Action:** HH/HL/LH/LL structure, support & resistance, candle formations, breakouts vs traps, pullbacks & reversals, volatility & ranges.
- **Level 3 — Smart Money Concepts:** BOS & CHoCH, liquidity mapping (BSL/SSL), the full liquidity-sweep sequence (observe → identify → explain → practice), supply/demand & order blocks, FVGs, displacement, premium/discount + Fibonacci, multi-timeframe analysis.
- **Level 4 — Strategy & Execution:** rule-based setups, two-step entry triggers, structural invalidation & stops, targets & 2R discipline, position sizing, trade management.
- **Level 5 — Advanced Trading Lab:** gold behaviour & London/NY sessions in Malaysia time, economic news planning, ATR/ADX, trailing stops, backtesting & overfitting, journals/expectancy/drawdown, psychology & independent thinking.

Every lesson is fully bilingual and ends with practice (quiz, chart task or interactive widget). Wrong quiz answers trigger targeted explanations rather than a bare "incorrect".

---

## Architecture

```
src/
├─ app/                    # Next.js App Router pages (all client-interactive)
├─ components/
│  ├─ learn/               # LessonPlayer, ChartScene, QuizCard, ChartTaskCard, ChartCanvas
│  │  └─ widgets/          # CandleAnatomyLab, RiskTools, SessionClock, PracticeWidgets, MtfLab
│  ├─ Navbar / Footer / Providers / Toaster / HeroChart / Reveal / Icons
├─ lib/
│  ├─ chart/engine.ts      # Dependency-free canvas candlestick engine
│  ├─ chart/builders.ts    # Deterministic synthetic market generators (seeded PRNG)
│  ├─ chart/analysis.ts    # Swings, FVGs, sweeps, equal levels + drawing evaluators
│  ├─ i18n.tsx / ui.ts     # Instant EN/BM language system (typed UI keys)
│  ├─ progress.ts          # localStorage store + useSyncExternalStore
│  └─ achievements.ts      # Achievement engine with toast events
└─ content/                # Curriculum (5 level modules), scenarios, glossary, achievements
```

**Key engineering decisions**

1. **Custom canvas chart engine** (`lib/chart/engine.ts`) instead of a third-party charting library — full control over lesson overlays, honest replay reveal (future candles are never drawn), the trade/R:R tool, drawing hit-testing, undo/redo and multi-touch-friendly pointer input. Zero chart-library licensing concerns.
2. **Deterministic synthetic market data** (`lib/chart/builders.ts`, mulberry32 seeded PRNG). Scenario charts are generated from composable narrative builders (`injectSweep`, `injectEqualHighs`, `injectFVG`, `injectBreak`, …) — identical on every device, and honestly labelled as teaching data.
3. **Rule-based feedback, not fake AI.** The simulator and arena grade drawings with real structural analysis (fractal swing detection, equal-level clustering, 3-candle FVG logic, sweep detection, R-math and structural-stop checks). Every claim in the feedback is computed from the visible candles.
4. **Local-first progress.** XP, lesson state, scenario scores, achievements and streaks live in `localStorage` — no signup wall. Export/import as JSON for backup or device transfer. The architecture keeps a future account backend trivially pluggable.
5. **Bilingual by construction.** All content objects carry `{ en, ms }` strings typed as `S`; the language provider switches instantly with zero route changes and zero state loss.

### Chart simulator feature map

- Replay: play / pause / step / rewind / scrub / speed 0.5–4x, future-candles hidden by design
- Tools: cursor (select/move), pan, horizontal line, trendline, zone (rect), Fibonacci, arrow, text note, trade plan (entry→SL→TP with live R:R boxes), eraser
- Undo/redo (Ctrl+Z / Ctrl+Shift+Z), delete key, clear-all
- Zoom (wheel), pan (drag), double-click to fit
- Sidebar: live structural analysis (trend, swings, liquidity pools, FVGs, sweeps), per-drawing feedback, guided data-derived tasks with XP

### Practice Arena

- **Foundation:** support zones, candle rejection reading, trend identification
- **Intermediate:** valid sweep execution, invalid-sweep rejection, FVG identification, CHoCH spotting
- **Advanced:** full trade placement (graded zone/stop/target/R:R), news-event discipline, failure diagnosis
- **Certification:** the complete curriculum compressed into one graded trade decision (70%+ to pass)

---

## Valetax broker integration (optional)

- Iframe embed method (`https://ma.valetax.com/embed/register/block?code=…`) with **all supplied identifiers preserved verbatim**.
- Lazy-loaded only when the embed scrolls near the viewport (third-party resources are never fetched up front).
- Safe fallback: timeout detection plus a direct link to `https://ma.valetax.com/` if the embed fails; a fallback link is always shown.
- Referral/affiliate disclosure and trading-risk information are displayed on the page.
- The learning platform is 100% functional without it. We never intercept, collect or store broker credentials.

---

## Testing status (honest disclosure)

| Check | Status |
|---|---|
| `tsc --noEmit` (strict) | ✅ Passes clean |
| `next build` production | ✅ Passes clean, 11/11 pages generated |
| All routes HTTP 200 (prod server) | ✅ Verified (/, /learn, /learn/l1, /learn/l1/l1-candles, /simulator, /arena, /dashboard, /glossary, /tools, /broker) |
| Deterministic content generation | ✅ All scenario/lesson charts are seeded pure functions |
| Browser E2E (clicks, canvas input, i18n toggle) | ⚠️ Not automated — no browser test runner in the build environment; interactive behaviour verified by TypeScript guarantees and component-level logic review |
| Real Valetax iframe round-trip | ⚠️ Cannot be executed from the build sandbox (third-party domain); fallback + timeout handling implemented per spec |
| Mobile browsers (real devices) | ⚠️ Responsive layout implemented and reviewed via breakpoints; not tested on physical devices |
| Cross-browser (Firefox/Safari) | ⚠️ Built with standard Canvas2D/PointerEvents/Intl APIs; Chromium verified, others not physically tested |

Known limitations (documented, not hidden):

- Progress is device-local (no cross-device sync) — export/import JSON provided as the workaround.
- The chart engine supports one chart layer (no multi-pane layouts).
- Economic news guide lists **recurring typical events** with MYT conversions — it is explicitly not a live calendar feed.
- The session clock uses IANA timezone data via `Intl`, so DST is handled by the platform, but broker-specific session hours can differ slightly.

---

## Accessibility & responsiveness

- Semantic landmarks, `aria-*` labels on toggles, keyboard support on charts (Delete, Ctrl+Z/Y), visible `focus-visible` rings, `prefers-reduced-motion` honoured.
- Mobile-first responsive grids; simulator toolbar wraps; charts resize via `ResizeObserver`.

## Licence note

All original code and content in this repository is created for TIGERFX Academy. No proprietary third-party educational material or artwork is included. The Valetax embed is the client-supplied integration snippet.
