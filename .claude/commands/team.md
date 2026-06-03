# CompTIA Trainer — Team Roster & Ownership

Reference this file when handing off work or escalating. Every team member has a skill — invoke them by name.

## Ownership Map

| Domain | Owner | Skill |
|--------|-------|-------|
| Project management, round tables, hiring | Marcus (PM) | `/marcus-scrum` |
| Merge decisions, architecture, ship sequence | Riley (Team Lead) | `/riley-ship` |
| A+ trainer (src/a-plus/App.jsx), CoreSelectScreen | Alex (A+ Dev) | — |
| A+ Core 1 content (domains 1–5) | Kai (Core 1 Specialist) | — |
| A+ Core 2 content (domains 6–9) | Morgan (Core 2 Specialist) | — |
| Security+ trainer (src/security-plus/App.jsx) | Sasha (Sec+ Dev) | — |
| Sec+ D1–D2 content | Devon (Sec+ D1-2) | — |
| Sec+ D3–D5 content | Taylor (Sec+ D3-5) | — |
| QA, smoke tests, e2e/smoke.mjs | Jordan (QA) | `/jordan-qa` |
| SECURITY.md, data model, CSP documentation | Priya (Security Architect) | `/priya-security-doc` |
| App security reviews, CSP enforcement, localStorage | Evan (App Security) | `/evan-security` |
| PROJECT_STRUCTURE.md, file tree, build config | Casey (Infra) | `/casey-structure` |
| CHANGELOG.md, release notes, git history | Logan (Ops) | `/logan-changelog` |
| Privacy policy, ToS, compliance, GRC | Sam (GRC Analyst) | `/sam-compliance` |
| UI design system, component consistency, Figma | Avery (UX Designer) | `/avery-audit` |
| Growth, marketing, community, GTM | River (Marketing) | — |
| WCAG accessibility audits | Quinn (Accessibility) | `/quinn-a11y` |
| Analytics, metrics, conversion tracking | Blake (Data Analyst) | — |

## Key Files

| File | Owner |
|------|-------|
| `src/Landing.jsx` | Riley / Avery |
| `src/App.jsx` (Network+) | Riley |
| `src/a-plus/App.jsx` | Alex |
| `src/security-plus/App.jsx` | Sasha |
| `src/useTheme.js` | Avery / Evan |
| `public/theme-init.js` | Evan |
| `index.html` | Evan (CSP), Avery (fonts/styles) |
| `e2e/smoke.mjs` | Jordan |
| `.github/workflows/ci.yml` | Riley |
| `SECURITY.md` | Priya |
| `CHANGELOG.md` | Logan |
| `.claude/PROJECT_STRUCTURE.md` | Casey |
| `.claude/STATUS.md` | Logan |

## Handoff Protocol

- **After any code change:** Riley signs off → Jordan runs QA → Evan reviews if security-relevant
- **After any ship:** Logan updates CHANGELOG → Casey updates PROJECT_STRUCTURE if files changed
- **Before paywall features:** Sam (GRC) + Evan (security) must both approve
- **UI changes:** Avery reviews component consistency → Quinn checks accessibility

## Round Table Status (2026-06-02)
- Monetization: Marcus ✅ Riley ✅ Alex ✅ | Resume with **Kai**
- UI Scrum: Marcus ✅ Riley ✅ Jordan ✅ Alex ✅ Kai ✅ Morgan ✅ Sasha ✅ Devon ✅ Taylor ✅ Priya ✅ Evan ✅ | Resume with **Casey**
