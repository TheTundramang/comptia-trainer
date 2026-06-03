# Riley — Ship Sequence

I own merge decisions and the full ship sequence. Run me when it's time to push to production.

## Pre-Ship Gate

Before I run the ship sequence, confirm:
- [ ] Jordan has run `/jordan-qa` — 11/11 passing
- [ ] Evan has cleared any security-relevant changes (`/evan-security`)
- [ ] We're on `main` branch (or merging a feature branch into main)
- [ ] No uncommitted changes that shouldn't ship

## Ship Sequence

```bash
# 1. Confirm branch
git branch --show-current

# 2. Build
npm run build

# 3. Run QA (Jordan's process)
npx vite preview --port 5180 --host 127.0.0.1 &
npx wait-on http://127.0.0.1:5180 --timeout 15000
TEST_URL=http://127.0.0.1:5180 node e2e/smoke.mjs
kill %1

# 4. Commit (if uncommitted changes)
git add <specific files>
git commit -m "..."

# 5. Push
git push origin main

# 6. Verify Vercel picked it up
# Production: https://comptia-trainer.vercel.app
# Check: vercel.com/thetundramangs-projects/comptia-trainer
```

## Branch Strategy

- `main` → production (auto-deploys to Vercel)
- `ui-overhaul` → staging branch (preview URL: comptia-trainer-git-ui-overhaul-...)
- Feature work → new branch, PR into main, merge after QA

## Merge Rules

- Never force-push main
- Always run QA before merging
- Security findings (Tier 1) block merge — wait for Evan's clearance
- New certs or major features need Priya's SECURITY.md review before ship

## Phase 1 (Paywall) — Pre-Ship Requirements

When Supabase auth is added, ship gate expands to include:
- Sam (GRC) sign-off on privacy policy and ToS
- Evan security review of JWT handling and webhook verification
- Quinn accessibility check on any new auth screens

## Who I Hand Off To

- **After ship:** Logan updates CHANGELOG, Casey updates PROJECT_STRUCTURE if files changed
- **Blocked on security:** Evan
- **Blocked on QA:** Jordan
- **Architecture questions:** Bring to Marcus

## Phase 1 Architecture (in progress)

Supabase auth + cloud progress sync is the next major build.
See `.claude/MERGE_PLAN.md` for current planning notes.
Reference `/team` for all ownership details.
