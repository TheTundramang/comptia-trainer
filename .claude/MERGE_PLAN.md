# CompTIA Trainer — Merge Plan
**Owner:** Riley (Team Lead) | **Status:** STANDING BY — waiting on Alex and Sasha

---

## When Alex Delivers `src/a-plus/App.jsx`

**Step 1 — Verify file is present and non-empty**
```bash
wc -l /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# Minimum 200 lines
```

**Step 2 — QA Checks**
```bash
# SK key
grep "const SK" src/a-plus/App.jsx
# Expected: const SK="aplus-v1";

# 9 domains
grep "^  {id:" src/a-plus/App.jsx | wc -l
# Expected: 9

# onExit wired (need 3 hits: signature, passthrough, button)
grep "onExit" src/a-plus/App.jsx

# No leftover Network+ strings
grep -in "n10-009\|netplus\|all 5 domains\|netplus-v2" src/a-plus/App.jsx
# Expected: no output

# PracticeGate has 9 domain entries
grep "{d:" src/a-plus/App.jsx
# Count must be 9, summing to ~90 questions

# SK collision check
grep "const SK" src/App.jsx src/a-plus/App.jsx src/security-plus/App.jsx 2>/dev/null
# Must show: netplus-v2, aplus-v1, secplus-v1 — all distinct
```

**Step 3 — Integrate staging files**
Read `/tmp/aplus-core1-staging.js` and `/tmp/aplus-core2-staging.js`. For each question, find its `domainId`, locate that domain in the DOMAINS array, append the question to `domain.questions`. Write merged file back.

---

## When Sasha Delivers `src/security-plus/App.jsx`

Same process with:
- SK must be `secplus-v1`
- Exactly 5 domains
- PracticeGate has 5 domain entries
- Staging files: `/tmp/secplus-d12-staging.js` and `/tmp/secplus-d345-staging.js`
- Header references `SY0-701` and `ALL 5 DOMAINS`

---

## Post-Merge Verification

```bash
# Both files non-empty
wc -l src/a-plus/App.jsx src/security-plus/App.jsx

# Landing imports intact
grep "import\|selected ===" src/Landing.jsx

# main.jsx still mounts Landing
grep "Landing" src/main.jsx

# Full SK collision sweep
grep "const SK" src/App.jsx src/a-plus/App.jsx src/security-plus/App.jsx

# Network+ shim intact
cat src/network-plus/App.jsx

# Build passes
npm run build 2>&1 | tail -20
```

---

## Escalation Criteria

**Riley handles independently:** missing onExit, leftover header text, low-but-acceptable question count, minor formatting.

**Escalate to Marcus:** file not a valid React component, SK collision, fewer than 5 domains on A+ or 3 on Sec+, build fails and can't resolve in 10 min.

---

## Sign-Off Checklist

**A+**
- [ ] File present (200+ lines)
- [ ] `const SK="aplus-v1"`
- [ ] 9 domains
- [ ] `onExit` wired
- [ ] No leftover Network+ strings
- [ ] PracticeGate has 9 domain entries
- [ ] Staging files integrated
- [ ] No duplicate questions
- [ ] SK collision check passed

**Sec+**
- [ ] File present (200+ lines)
- [ ] `const SK="secplus-v1"`
- [ ] 5 domains
- [ ] `onExit` wired
- [ ] No leftover strings
- [ ] PracticeGate has 5 domain entries
- [ ] Staging files integrated
- [ ] SK collision check passed

**Post-merge**
- [ ] Landing.jsx imports/routing unmodified
- [ ] `main.jsx` mounts `<Landing />`
- [ ] Network+ shim intact
- [ ] `npm run build` clean

When all checked: message Marcus "merge complete" with final question counts.

*— Riley, Team Lead*
