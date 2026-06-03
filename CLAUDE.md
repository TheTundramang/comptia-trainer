# CompTIA Trainer — Claude Code Context

This file is auto-loaded by Claude Code on every session. Full project context, team, decisions, and roadmap are below. You do not need to ask the user to re-explain anything in this file.

---

## What This Project Is

A free, client-side React + Vite study app for CompTIA certifications. Three cert trainers: **Network+ (N10-009)**, **A+ (220-1101/1102)**, **Security+ (SY0-701)**.

**Live:** https://comptia-trainer.vercel.app
**Repo:** https://github.com/TheTundramang/comptia-trainer
**Local:** `/home/mikeyrobby/Documents/comptia-trainer/`
**Project log:** `/home/mikeyrobby/Documents/comptia-project-log.md`

---

## Current Tech Stack

- React 18 + Vite 5 — fully client-side, no backend today
- Poppins font (self-hosted in `public/fonts/`)
- CSS custom properties for light/dark theming (`useTheme.js`)
- `localStorage` for progress persistence (`aplus-v1`, `netplus-v2`, `secplus-v1`, `theme`)
- Playwright E2E smoke tests (`e2e/smoke.mjs` — 11 checks, run via `/jordan-qa`)
- GitHub Actions CI (`ci.yml` — build + smoke test on every push to main)
- Vercel — production hosting, branch previews on every push

---

## Project Structure

```
src/
├── Landing.jsx           — cert selector, lazy-loads cert apps
├── ui.jsx                — shared components (ProgressBar, MenuCard, BackBtn, ThemeToggle, Celebration, Loading)
├── useTheme.js           — light/dark mode hook
├── App.jsx               — Network+ trainer
├── a-plus/App.jsx        — A+ trainer (Core 1/2 split via CoreSelectScreen)
└── security-plus/App.jsx — Security+ trainer
public/
├── fonts/                — self-hosted Poppins woff2 (400/500/600/700)
└── theme-init.js         — anti-FOUC script (no inline scripts — CSP enforced)
scripts/add-sri.js        — injects SRI hashes into dist/index.html post-build
e2e/smoke.mjs             — Playwright smoke test
.github/workflows/ci.yml  — GitHub Actions CI
.claude/commands/         — team skill files (invoke with /skill-name)
```

---

## Team & Ownership

Run `/team` for the full ownership map. Quick reference:

| Person | Role | Skill |
|--------|------|-------|
| Marcus | PM, round table facilitator | `/marcus-scrum` |
| Riley | Team Lead, architecture, ship sequence | `/riley-ship` |
| Alex | A+ developer | — |
| Kai / Morgan | A+ Core 1 / Core 2 content | — |
| Sasha | Security+ developer | — |
| Devon / Taylor | Sec+ D1-2 / D3-5 content | — |
| Jordan | QA, smoke tests | `/jordan-qa` |
| Priya | Security architecture, SECURITY.md | `/priya-security-doc` |
| Evan | App security reviews, CSP | `/evan-security` |
| Casey | Infra, PROJECT_STRUCTURE.md | `/casey-structure` |
| Logan | Ops, CHANGELOG.md | `/logan-changelog` |
| Sam | GRC, privacy policy, compliance | `/sam-compliance` |
| Avery | UX design, component system | `/avery-audit` |
| River | Growth & marketing | — |
| Quinn | Accessibility (WCAG 2.1 AA) | `/quinn-a11y` |
| Blake | Data & analytics | — |

**Handoff protocol:** Code change → Riley review → Jordan QA → Evan if security-relevant → Logan updates CHANGELOG → Casey updates PROJECT_STRUCTURE if files changed.

**Round table protocol:** One team member at a time. User interacts with each individually before moving to the next. Never dump all responses in one message.

---

## Current Save Data Structure

Each cert writes to localStorage (key per cert). This will migrate to Supabase in Phase 1:

```json
{
  "streak": 5,
  "lastActive": "2026-06-02",
  "domainProgress": {
    "1": { "bestScore": 82, "lastPct": 78, "prevScore": 65, "attempts": 3 }
  },
  "weakQuestions": { "question_key_40chars": { "missed": 2, "correct": 0 } },
  "starredCards": ["DDR4 vs DDR5 RAM"],
  "practiceHistory": [{ "pct": 74, "date": 1748000000000, "total": 90 }]
}
```

`loadSave()` and `writeSave()` in each App.jsx are the functions to rewrite for Phase 1.

---

## Monetization Decisions (already made)

- **Model:** Freemium — free first 2 domains per cert, rest paywalled
- **Pricing:** $9.99/month OR $29.99 one-time per cert
- **Auth:** Supabase (email/password + OAuth)
- **Payments:** Stripe Checkout + webhooks
- **Hosting:** Vercel (already live)

---

## Phase 1 Roadmap — NEXT BUILD (Supabase Auth + Cloud Sync)

Riley's approved 4-phase plan:

### Phase 1 — Auth + Cloud Progress Sync
- Supabase project setup (tables, RLS, auth)
- Rewrite `loadSave`/`writeSave` → Supabase with localStorage fallback
- JWT session management
- User accounts (email/password + Google OAuth)
- Free tier still works offline via localStorage
- **Evan must be in this from day one** — new attack surface: JWTs, session tokens, webhook verification

### Phase 2 — Paywall in Landing.jsx
- Gate content past free domains
- Server-side enforcement via Supabase Row Level Security
- `is_paid` flag checked on every protected route
- Sam (GRC) must approve privacy policy + ToS before this ships

### Phase 3 — Stripe Checkout
- Stripe Checkout session → webhook → flip `is_paid` in Supabase
- Webhook signature verification (Evan owns)
- Subscription and one-time payment modes

### Phase 4 — Production Hardening
- Security audit (Evan + Priya)
- Accessibility check on auth screens (Quinn)
- Analytics events wired (Blake)
- CHANGELOG + SECURITY.md updated (Logan + Priya)

---

## Security Constraints (non-negotiable)

- **No card data ever touches our server** — Stripe handles all payment data
- **RLS must be enforced server-side** — client-side gating alone is not sufficient
- **Evan signs off** on JWT handling, session storage, and webhook verification before any phase ships
- **Sam signs off** on privacy policy + ToS before paywall goes live
- **CSP:** `script-src 'self'` — no unsafe-inline. Any new scripts must be served from 'self'
- **Offline fallback required** — free-tier users must be able to use the app without an account

---

## MCP Tools Available

The following MCP integrations may be available in this session. Use them proactively:

- **Supabase MCP** — create projects, run migrations, execute SQL, manage RLS, deploy edge functions
- **Vercel MCP** — list deployments, check build logs, manage projects
- **GitHub** (via `gh` CLI) — PRs, issues, Actions status

If Supabase MCP tools are available, you can start Phase 1 work directly: create the project, design the schema, set up RLS, and generate TypeScript types.

---

## Round Table Status

- **Monetization round table:** Resume with **Kai** (Marcus ✅ Riley ✅ Alex ✅ done)
- **UI scrum:** Complete ✅

## Recently Shipped (2026-06-02)

- Full UI overhaul: Poppins, light/dark mode, bigger text, rounder cards
- Core 1/Core 2 split for A+ (CoreSelectScreen)
- Shared component library (`src/ui.jsx`)
- In-quiz quick reference overlay (📖)
- Weak spots accordion on results screen
- Progress delta indicators on home screen
- 11 team skill files in `.claude/commands/`
- Fonts self-hosted (CI fix — Google Fonts was blocking in GitHub Actions)

---

## How to Run

```bash
npm run dev          # dev server at http://127.0.0.1:5173
npm run build        # production build + SRI injection
npm run preview      # serve dist/
```

**QA:** Run `/jordan-qa` or manually:
```bash
npm run build && npx vite preview --port 5174 &
npx wait-on http://localhost:5174 --timeout 15000
TEST_URL=http://localhost:5174 node e2e/smoke.mjs
```

**Ship:** Run `/riley-ship` or follow the sequence in `.claude/commands/riley-ship.md`
