# CompTIA Trainer

A free, client-side study platform for CompTIA certification exams. No account required. No ads. Works offline after first load.

**Live:** [comptia-trainer.vercel.app](https://comptia-trainer.vercel.app)

---

## What's Inside

| Cert | Exam Code | Questions | Domains |
|------|-----------|-----------|---------|
| CompTIA A+ | 220-1101 / 220-1102 | 144 | 9 (Core 1 & Core 2 split) |
| CompTIA Network+ | N10-009 | 60+ | 5 |
| CompTIA Security+ | SY0-701 | 84 | 5 |

Each cert includes:
- **Domain quizzes** — work through domains in order, confidence rating per answer
- **Daily quick practice** — 10 questions, prioritizes your weak spots automatically
- **Flashcards** — flip, drill, and browse modes with memory tricks and analogies
- **Full practice test** — timed simulation, unlocks after completing all domains
- **Results & weak spots** — domain breakdown, confidence calibration, expandable missed questions
- **In-quiz reference** — 📖 quick lookup overlay for acronyms without leaving the quiz
- **Light / dark mode** — toggle persists across sessions

---

## Tech Stack

- **React 18** + **Vite 5** — client-side only, no backend
- **Poppins** (Google Fonts) — typography
- **CSS custom properties** — light/dark theme system
- **localStorage** — progress persistence (never leaves the browser)
- **Playwright** — E2E smoke tests
- **GitHub Actions** — CI on every push to `main`
- **Vercel** — production hosting with branch preview deployments

---

## Run Locally

```bash
git clone https://github.com/TheTundramang/comptia-trainer.git
cd comptia-trainer
npm install
npm run dev
```

Opens at `http://127.0.0.1:5173`

```bash
npm run build    # production build + SRI hash injection
npm run preview  # serve the built dist/
```

**E2E smoke test** (requires a running preview server):
```bash
npm run build
npx vite preview --port 5174 &
npx wait-on http://localhost:5174 --timeout 15000
TEST_URL=http://localhost:5174 node e2e/smoke.mjs
```

---

## Security

This application is purely client-side. No server, no database, no user accounts, no data leaves the browser. See [SECURITY.md](SECURITY.md) for the full security model and responsible disclosure policy.

---

## Adding a New Cert

See [SECURITY.md](SECURITY.md) Section 6 for the checklist. At minimum:

1. Create `src/<cert-name>/App.jsx` following the existing pattern
2. Register in `src/Landing.jsx` under the `CERTS` array
3. Use a unique `localStorage` key (e.g. `yourcert-v1`)
4. Run `npm run build` and the smoke test before shipping

---

## Project Structure

```
src/
├── Landing.jsx           — cert selector, lazy-loads cert apps
├── ui.jsx                — shared components (ProgressBar, MenuCard, etc.)
├── useTheme.js           — light/dark mode hook
├── App.jsx               — Network+ trainer
├── network-plus/App.jsx  — re-export shim
├── a-plus/App.jsx        — A+ trainer (Core 1/2 split)
└── security-plus/App.jsx — Security+ trainer
public/
└── theme-init.js         — anti-FOUC theme script
scripts/
└── add-sri.js            — injects SRI integrity hashes post-build
e2e/
└── smoke.mjs             — Playwright smoke test (11 checks)
.github/workflows/
└── ci.yml                — build + test on every push to main
```

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full release history.

---

## Team Charter

This project is maintained by a virtual development team. Below is the current team structure and working agreement.

### Current Team

| Name | Role |
|------|------|
| Marcus | Project Manager |
| Riley | Team Lead |
| Alex | A+ Developer |
| Kai | Core 1 Specialist |
| Morgan | Core 2 Specialist |
| Sasha | Security+ Developer |
| Devon | Sec+ D1–D2 Specialist |
| Taylor | Sec+ D3–D5 Specialist |
| Jordan | QA / Integration |
| Priya | Security Architect |
| Evan | App Security Reviewer |
| Casey | Infrastructure & Knowledge |
| Logan | Operations Runner |
| Sam | GRC Analyst |
| Avery | UX Designer |
| River | Growth & Marketing |
| Quinn | Accessibility Specialist |
| Blake | Data Analyst |

### Reporting Chain

- Workers → Lead Developer → Team Lead → Marcus (PM) → Founder

### Workflow Rules

- Keep work scoped and intentional
- QA (Jordan) validates after meaningful changes — run `/jordan-qa`
- Security changes require Evan's review — run `/evan-security`
- Ship via Riley's sequence — run `/riley-ship`
- CHANGELOG updated after every ship — run `/logan-changelog`
- PROJECT_STRUCTURE.md updated when files change — run `/casey-structure`

### Team Skills

Each team member has a skill file in `.claude/commands/`. Invoke `/team` for the full ownership map and handoff protocol.

### Escalation Path

Specialist → Lead Developer → Team Lead → Marcus → Founder

No one skips levels unless explicitly directed.

### Working Style

Be clear. Be efficient. Ask when blocked. Keep documentation in sync with reality.
