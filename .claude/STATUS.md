# CompTIA Trainer — Project Status Digest
**Last updated:** 2026-05-31 | **Maintained by:** Logan (Ops)

---

## What's Done

These are shipped, stable, and not on fire.

| Item | Owner | Notes |
|------|-------|-------|
| Network+ trainer (N10-009) | Alex (original) | Fully operational. Lives at `src/App.jsx`. |
| `src/Landing.jsx` | Team | Multi-cert landing page. Routes to all 3 cert trainers. |
| `src/main.jsx` | Team | Entry point updated to mount Landing. |
| `src/network-plus/App.jsx` | Team | Re-export shim. Confirmed working. |
| `README.md` | Marcus | Full technical docs + Team Charter. Solid work. |
| `SECURITY.md` | Priya | Written and delivered. CSP, data model, checklist — done right. |

---

## What's In Flight

Active builds happening right now. Don't merge yet.

| Item | Owner | Status |
|------|-------|--------|
| `src/a-plus/App.jsx` | Alex | Session reset — actively writing. |
| `src/security-plus/App.jsx` | Sasha | Actively writing. |
| `.claude/PROJECT_STRUCTURE.md` | Casey | In progress. |

---

## What's Blocked and Why

Nobody's stuck because they did anything wrong — it's just queue order.

| Item | Owner | Blocked By |
|------|-------|-----------|
| Merge pass | Riley | Waiting on Alex and Sasha to land their builds. |
| QA check | Jordan | Waiting on Riley's merge pass. |
| App security review | Evan | Waiting on merge + QA sign-off. |

Short version: A+ and Sec+ builds are the critical path. Once those land, Riley unblocks, Jordan unblocks, Evan unblocks — dominos fall.

---

## Team Roster

| Name | Role | Current Status |
|------|------|---------------|
| Marcus | PM | README shipped. Big picture in focus. |
| Riley | Team Lead | Queued for merge pass — on standby. |
| Alex | A+ Dev | Actively building `src/a-plus/App.jsx`. |
| Kai | Core 1 Specialist | Standing by for Alex's build. |
| Morgan | Core 2 Specialist | Standing by for Alex's build. |
| Sasha | Sec+ Dev | Actively building `src/security-plus/App.jsx`. |
| Devon | Sec+ D1-2 Specialist | Standing by for Sasha's build. |
| Taylor | Sec+ D3-5 Specialist | Standing by for Sasha's build. |
| Jordan | QA / Integration | Queued — waiting on merge. Wiring is solid. |
| Priya | Security Architect | SECURITY.md delivered. First task: complete. |
| Evan | App Security Reviewer | Queued — waiting on merge + QA. |
| Casey | Infra & Knowledge | Writing PROJECT_STRUCTURE.md. |
| Logan | Operations Runner | Keeping this digest alive and the hallway clear. |

---

## Next Up

After Alex and Sasha's builds land:

1. **Riley** — merge pass, integrate A+ and Sec+ builds
2. **Jordan** — QA check, smoke test all three cert trainers
3. **Evan** — app security review on merged codebase
4. **Kai + Morgan** — content pass on A+ Core 1 and Core 2
5. **Devon + Taylor** — content pass on Sec+ domains
6. **Casey** — finalize PROJECT_STRUCTURE.md once structure stabilizes
7. **Marcus** — final sign-off, update changelog, launch prep

---

## Office Bulletin

Hey team — Logan here.

**Pizza party is ON.** The moment Alex and Sasha push their builds, we're calling it. Marcus said he'd cover the Hawaiian pizza. We're not litigating the toppings. It's happening.

**Big welcome to the newest crew:**

- **Priya** — Security Architect. Already shipped SECURITY.md on day one. The project is safer with you on it.
- **Evan** — App Security. Your review pass is going to be crucial. We saved you the good chair.
- **Casey** — Infra. Mapping out the project so nobody ever has to ask "wait, where does this go?" again.
- **Logan** — That's me. Ops. I keep the trains running and the status current.

**Shoutout to Jordan** — QA is the least glamorous seat and the most important one. The wiring has been rock solid. When the pizza lands, Jordan picks toppings first.

Keep building. We're close.

— *Logan, Ops*
*"If it's not in STATUS.md, it didn't happen."*
