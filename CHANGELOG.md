# CompTIA Trainer — Changelog

All notable changes to this project are documented here.
Format: **[Version] — Date — Author(s) — What changed and why.**

---

## [Unreleased] — In Progress

*Nothing pending — all work committed and pushed.*

---

## [1.2.0] — 2026-06-02 — UI Scrum Sprint

### Infrastructure
- **Shared component library** — extracted `ProgressBar`, `MenuCard`, `BackBtn`, `ThemeToggle`, `Celebration`, `Loading` into `src/ui.jsx`. Eliminates 15 duplicate definitions across 3 cert apps. Single source of truth. *(Casey, Infra)*
- **Team skill files** — created `.claude/commands/` with 11 skill files (one per team role). Each documents domain ownership, process, and cross-references. *(Marcus, PM — all team members authored their own)*
- **HOW TO USE extracted** — moved hardcoded instructional text to `HOW_TO_USE` constants at the top of each cert app for easy future updates. *(Logan, Ops)*

### Security
- **CSP regression fixed** — moved anti-FOUC theme init from inline `<script>` to `public/theme-init.js`. Restores `script-src 'self'` without `'unsafe-inline'`. SRI hash auto-injected. *(Evan, App Security)*
- **SECURITY.md updated** — documented `theme` localStorage key, `prevScore` field, and full study progress data model shape. *(Priya, Security Architect)*

### Features
- **In-quiz quick reference** — 📖 button in quiz header opens searchable term/acronym overlay. Searches all flashcard data client-side without leaving the quiz. *(Sasha, Sec+ Dev)*
- **Weak spots accordion** — expandable missed questions on results screen. Shows exact wrong answers per weak topic without navigating to full review. *(Devon, Sec+ D1-2)*
- **Progress delta indicators** — `+N%` / `-N%` badge on domain progress bars shows trend vs previous attempt. `prevScore` persisted in domain quiz save. *(Taylor, Sec+ D3-5)*
- **Practice test domain checklist** — locked practice card shows inline domain completion checklist instead of plain "complete all N domains" text. *(Taylor, Sec+ D3-5)*

### UI / UX
- **Full UI overhaul shipped** — Poppins font replacing Courier New, light/dark mode toggle (☀️/🌙) fixed bottom-right on every screen, CSS custom properties for theme colors. *(UI Overhaul branch merged)*
- **Light mode border fix** — `--c-border` in light theme darkened from `#dde3f8` to `#a8b8d8` for visible card definition. *(Marcus, PM)*
- **Mobile tap targets** — answer option `marginBottom` 10→14px, BackBtn font 10→13px. *(Riley, Team Lead)*
- **Quiz progress bar** — 4→8px for better mid-quiz readability. *(Jordan, QA)*
- **Confidence buttons stacked** — full-width vertical layout replacing side-by-side to prevent mobile mis-taps. *(Jordan, QA)*
- **Confirm hint text** — dynamic hint below disabled CONFIRM ANSWER explains what's still needed. *(Jordan, QA)*
- **A+ Switch Exam relocated** — moved from cramped absolute header to inline underline link beside mode label. *(Alex, A+ Dev)*
- **Domain progress bars thickened** — 3→5px on home screen for consistency with quiz bar. *(Alex, A+ Dev)*
- **Flashcard Study Aids redesigned** — Memory Trick and Analogy buttons now full-width, 15px, with ▼/▲ indicator. Fill with color when expanded. "Study Aids" section header added. *(Kai, Core 1)*
- **Explanation panel structured** — dividers between Explanation / Analogy / In Your Work. Analogy anchored to domain color, In Your Work gets green accent bar. 12→13px text. *(Morgan, Core 2)*

### New Team Members (2026-06-02)
- Sam (GRC Analyst), Avery (UX Designer), River (Growth & Marketing), Quinn (Accessibility Specialist), Blake (Data Analyst) — all onboarded with skill files and work assignments.

---

## [0.9.0] — 2026-06-01 — Tier 2 Part 3 of 3

### Feature — Spaced Repetition & Missed Question Tracker
- Implemented missed question tracking across all three cert trainers *(Jordan, QA / Integration)*
- **Tracking logic (QuizScreen):** Wrong answer → question flagged in `save.weakQuestions`. Correct on a flagged question → streak incremented. Two consecutive correct answers → question cleared (mastered).
- **Daily practice prioritization (DailyScreen):** Weak questions fill up to 7 of 10 daily slots. Remaining slots filled from regular pool. Flagged questions keep surfacing until mastered.
- **Home screen indicator:** Daily Practice card shows "N weak questions flagged" when weak questions exist. Reverts to standard subtitle when slate is clean.
- Applies to: `src/App.jsx` (Network+), `src/a-plus/App.jsx`, `src/security-plus/App.jsx`
- Progress persists to localStorage per cert via existing `save` object (`weakQuestions` key)
- **Commit:** `170e5fe`

---

## [0.8.0] — 2026-06-01 — Tier 2 Part 2 of 3

### Performance — Code Splitting
- Replaced static imports in `Landing.jsx` with `React.lazy()` + `Suspense` *(Casey, Infrastructure)*
- Each cert trainer is now a separate JS chunk loaded on demand when the user selects it
- Initial bundle: 519KB (1 chunk) → 148KB landing page + 3 cert chunks fetched on click
- Initial load time reduced ~71%. Vite chunk-size warning fully resolved.
- Loading spinner displayed while cert chunk downloads on slower connections
- **Commit:** `4b1517d`

---

## [0.7.0] — 2026-06-01 — Tier 2 Part 1 of 3

### CI/CD — GitHub Actions Pipeline
- Added `.github/workflows/ci.yml` — runs on every push and PR to `main` *(Riley, Team Lead)*
- Pipeline: install → build (with SRI) → Playwright install → start preview server → wait for readiness → run smoke tests
- Fails automatically if build errors or any of 11 smoke tests fail — broken code cannot reach main
- Added `e2e/smoke.mjs` — canonical 11-check smoke test owned by Jordan (QA)
- Added `playwright` and `wait-on` as dev dependencies
- **Commit:** `30471ad`

---

## [0.6.0] — 2026-06-01 — Tier 2 Part 2 of 3

### Performance
- Code-split all three cert trainers via `React.lazy()` + `Suspense` in `Landing.jsx` *(Casey, Infrastructure)*
- Each cert App.jsx is now a separate chunk loaded on demand — only downloaded when the user selects that cert
- Initial bundle: 519KB (1 chunk) → 148KB landing + 3 cert chunks loaded on click
- Initial load time reduced by ~71% on first visit
- Vite chunk-size warning fully resolved
- Loading spinner displayed during cert chunk fetch on slower connections
- **Commit:** `4b1517d`

---

## [0.5.0] — 2026-06-01 — Tier 2 Part 1 of 3

### CI/CD
- Added `.github/workflows/ci.yml` — GitHub Actions pipeline runs on every push and PR to main *(Riley, Team Lead)*
  - Installs dependencies, builds the app, starts `vite preview`, waits for server readiness, runs E2E smoke tests
  - Pipeline fails automatically if build breaks or any smoke test fails
  - Prevents broken code from ever reaching main undetected
- Added `e2e/smoke.mjs` — 11-check Playwright smoke test, owned by Jordan (QA)
  - Tests: all 3 cert cards visible, each cert launches with correct header, ← ALL CERTS navigation, A+ quiz flow, localStorage key isolation, zero console errors
  - Exits non-zero on any failure — CI blocks the merge
- Added `playwright` and `wait-on` as dev dependencies for CI compatibility
- **Commit:** `30471ad`

---

## [0.4.1] — 2026-06-01 — Tier 1 Security & Documentation

### Security
- Added `window.storage` shim validation in all three cert App.jsx files — validates type signature and parsed object shape before trusting injected global *(Priya, Security Architect)*
- Corrected localStorage key names in SECURITY.md: `aplus-v1`, `secplus-v1` (docs previously said v2) *(Priya, Security Architect)*
- Added `scripts/add-sri.js` — post-build script injects `sha384` integrity attributes into `dist/index.html` automatically on every `npm run build` *(Evan, App Security)*
- Bound dev server to `127.0.0.1` only in `vite.config.js` — prevents dev server from binding to all interfaces *(Evan, App Security)*
- Added `<meta>` Content-Security-Policy tag to `index.html` — hosting-independent CSP baseline regardless of server header config *(Evan, App Security)*
- Fixed page title: "CompTIA Network+ Trainer" → "CompTIA Trainer" *(Marcus, PM)*

### Documentation
- Added `CHANGELOG.md` — full project history with version tags and per-team-member attribution *(Logan, Operations)*
- **Commit:** `b904532`

---

## [0.4.0] — 2026-06-01

### Added — A+ Question Bank Expansion
- A+ question bank expanded from 90 to 144 questions (16 per domain across all 9 domains)
- Core 1 additions (domains 1–5): display types, USB-C Alt Mode, SO-DIMM, cloud sync, MDM, NFC, APIPA diagnosis, RDP port, DHCP DORA, 802.11n dual-band, M.2 PCIe-only slot, Mini-ITX, PSU connectors, NVMe vs SATA, RAID 0, HDMI, thermal shutdown, fuser failure, Type 1/2 hypervisors, containers vs VMs, IaaS, SaaS, private cloud, cloud elasticity, VM snapshots, CASB, 7-step methodology, POST beep codes, tracert, cable certifier, MemTest86 *(Kai, Core 1 Specialist; Morgan, Core 2 Specialist)*
- Core 2 additions (domains 6–9): domain join requirements, DISM before sfc, chkdsk, temporary profile fix, FileVault, chmod 755, exFAT, driver rollback, LDAP port, Trojan definition, phishing vs spear phishing, BitLocker, mantrap, DoD wipe, least privilege, biometrics, smishing, UAC, cable lock, boot failure repair, malware quarantine, 32-bit app location, Event Viewer, rollback plan, SOP, ESD wrist strap, HVAC, HIPAA media disposal, incident vs service request, full+differential restore, CRT capacitor safety, msinfo32 *(Kai, Core 1 Specialist; Morgan, Core 2 Specialist)*

### Added — Security+ Question Bank Expansion
- Security+ question bank expanded from 50 to 84 questions
- D1 General Security Concepts: 10 → 18 (+8) — non-repudiation, PFS/ECDHE, certificate types, salting, ECC, RADIUS/TACACS+, MAC access control, steganography *(Devon, Sec+ D1-2 Specialist)*
- D2 Threats, Vulnerabilities & Mitigations: 10 → 18 (+8) — fileless malware, BEC, supply chain attacks, credential stuffing, CSRF, DNS poisoning, AiTM phishing, IoC vs IoA *(Devon, Sec+ D1-2 Specialist)*
- D3 Security Architecture: 10 → 16 (+6) — SD-WAN, IaC security, DNSSEC, honeypots, load balancer security, threat modeling *(Taylor, Sec+ D3-5 Specialist)*
- D4 Security Operations: 10 → 16 (+6) — EPM, DLP, log sources, TIP/STIX/TAXII, eDiscovery, risk-based patch prioritization *(Taylor, Sec+ D3-5 Specialist)*
- D5 Security Program Management: 10 → 16 (+6) — quantitative risk/ALE, BIA, privacy by design, MTTD/MTTR, tabletop exercises, data retention and legal holds *(Taylor, Sec+ D3-5 Specialist)*

---

## [0.3.0] — 2026-06-01

### Added
- `CHANGELOG.md` — this file *(Logan, Operations)*
- `SECURITY.md` — security model, CSP, data storage, deployment checklist, vulnerability disclosure policy *(Priya, Security Architect)*
- `.gitignore` — excludes node_modules/, dist/, .DS_Store *(Marcus, PM)*

### Security
- `window.storage` shim now validates type before use (initial fix) *(Evan, App Security)*
- CSP meta tag baseline added to index.html *(Evan, App Security)*

---

## [0.2.0] — 2026-06-01

### Added — Full Three-Cert Platform
- `src/Landing.jsx` — multi-cert selector routing all three trainers *(Riley, Team Lead; Marcus, PM)*
- `src/a-plus/App.jsx` — CompTIA A+ (220-1101/1102) trainer, 9 domains, 90 questions, 6 flashcard decks *(Alex, A+ Lead Developer)*
- `src/security-plus/App.jsx` — CompTIA Security+ (SY0-701) trainer, 5 domains, 50 questions, 6 flashcard decks *(Sasha, Security+ Lead Developer)*
- `src/network-plus/App.jsx` — re-export shim for consistent import paths across Landing *(Riley, Team Lead)*
- `src/main.jsx` — updated to mount Landing instead of App directly *(Riley, Team Lead)*
- `package-lock.json` — lockfile committed for reproducible installs *(Casey, Infrastructure)*

### Documentation
- `README.md` — full technical docs, team charter, org chart *(Marcus, PM)*
- `.claude/PROJECT_STRUCTURE.md` — file map, shared patterns, screen state machine, data structures, gotcha registry *(Casey, Infrastructure)*
- `.claude/STATUS.md` — ops digest tracking done/in-flight/blocked work *(Logan, Operations)*
- `.claude/MERGE_PLAN.md` — merge procedures and sign-off checklist *(Riley, Team Lead)*
- `.claude/QA_CHECKLIST.md` — pre-merge and browser smoke test checklist *(Jordan, QA)*

### QA
- Full browser smoke test run via Playwright — 11/11 checks passed *(Jordan, QA)*
- Command-line QA checks — 20/20 passed *(Jordan, QA)*

---

## [0.1.0] — 2026-05-31

### Added — Network+ Foundation
- `src/App.jsx` — CompTIA Network+ (N10-009) trainer, 5 domains, 56 questions, 6 flashcard decks
- Full quiz engine: domain study, daily practice, full practice test (90 questions, timed)
- Flashcard system: Flip, Drill, and Browse modes with starred cards and shuffle
- Result screen: domain breakdown, confidence calibration, weak spot detection, study tips
- Review screen: step through every Q with explanations, analogies, and real-world context
- Streak tracking and progress persistence via localStorage
- Keyboard shortcuts throughout (A/B/C/D select, 1/2 confidence, Enter confirm, arrow keys navigate)
- Celebration animation on passing score
- Practice test locked until all domains completed

---

## Team Roster & Ownership

| Name | Role | Owns |
|------|------|------|
| Marcus | PM | Project direction, README, release coordination, this changelog |
| Riley | Team Lead | Merge passes, Landing.jsx, network-plus shim, MERGE_PLAN.md |
| Alex | A+ Lead Developer | src/a-plus/App.jsx — scaffold, all 9 domains, Core 1 questions |
| Kai | Core 1 Specialist | A+ Core 1 content (domains 1–5) — questions and flashcards |
| Morgan | Core 2 Specialist | A+ Core 2 content (domains 6–9) — questions and flashcards |
| Sasha | Sec+ Lead Developer | src/security-plus/App.jsx — scaffold, all 5 domains |
| Devon | Sec+ D1-2 Specialist | Security+ domains 1–2 content |
| Taylor | Sec+ D3-5 Specialist | Security+ domains 3–5 content |
| Jordan | QA / Integration | QA_CHECKLIST.md, Playwright smoke tests, integration checks |
| Priya | Security Architect | SECURITY.md, window.storage validation, CSP |
| Evan | App Security | Security review, SRI, dev-server hardening |
| Casey | Infrastructure | PROJECT_STRUCTURE.md, file conventions, build config |
| Logan | Operations | STATUS.md, this CHANGELOG, ops coordination |
