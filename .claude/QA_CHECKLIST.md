# CompTIA Trainer — QA Checklist
**Owner:** Jordan (QA / Integration Engineer)

---

## Part 1 — Pre-Merge Checks (run before Riley merges any new cert)

**1. SK key is unique**
```bash
grep -rn "const SK" /home/mikeyrobby/Documents/comptia-trainer/src/
# All three values must be distinct: netplus-v2 / aplus-v1 / secplus-v1
```

**2. No leftover Network+ strings**
```bash
grep -in "n10-009\|netplus-v2\|all 5 domains\|5 domains·\|professor messer aligned.*5" \
  /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# Expected: no output
```

**3. practiceUnlocked uses DOMAINS.every() — not a hardcoded number**
```bash
grep "practiceUnlocked" /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# Must show: DOMAINS.every(d=>dp[d.id])
```

**4. PracticeGate domain IDs match actual DOMAINS array**
```bash
grep "{d:" /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# A+: must have 9 entries; Sec+: must have 5 entries
```

**5. onExit prop in App function signature**
```bash
grep "export default function App" /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# Must show: function App({onExit})
```

**6. ← ALL CERTS button conditionally rendered**
```bash
grep "ALL CERTS\|onExit&&\|onExit &&" /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# Must show the conditional render
```

**7. All DOMAINS have at least 10 questions**
```bash
# Count questions per domain — look for question array lengths in source
grep -c '"q":' /home/mikeyrobby/Documents/comptia-trainer/src/a-plus/App.jsx
# A+: minimum 90 total; Sec+: minimum 50 total
```

**8. Syntax check**
```bash
cd /home/mikeyrobby/Documents/comptia-trainer && npx vite build 2>&1 | grep -E "error|Error|✓"
```

---

## Part 2 — Integration Checks (after merge)

```bash
# Landing imports the cert
grep "import.*App" /home/mikeyrobby/Documents/comptia-trainer/src/Landing.jsx

# CERTS array has status "available"
grep -A5 "aplus\|secplus" /home/mikeyrobby/Documents/comptia-trainer/src/Landing.jsx | grep "status"

# Routing branch exists
grep 'selected === "aplus"\|selected === "secplus"' /home/mikeyrobby/Documents/comptia-trainer/src/Landing.jsx

# main.jsx still mounts Landing
grep "Landing" /home/mikeyrobby/Documents/comptia-trainer/src/main.jsx
```

---

## Part 3 — Runtime Smoke Test (browser)

- [ ] Landing page loads, shows all 3 cert cards
- [ ] Each cert card is clickable and launches trainer
- [ ] `← ALL CERTS` button returns to landing from each cert
- [ ] Domain study: select domain → answer questions → see result → progress saved
- [ ] Open DevTools → Application → localStorage: verify cert keys are separate (`aplus-v1`, `netplus-v2`, `secplus-v1`)
- [ ] Completing one cert does not affect another cert's localStorage data
- [ ] Flashcard Flip mode: tap reveals definition, arrows navigate, star works
- [ ] Flashcard Drill mode: reveal → Got It / Missed It → summary shows
- [ ] Flashcard Browse mode: search filters results
- [ ] Practice test locked until all domains complete
- [ ] Practice test unlocks after completing all domains
- [ ] Results screen shows correct score, domain breakdown, weak spots

---

## Part 4 — Common Bugs

| Bug | Symptom | Fix |
|-----|---------|-----|
| SK key collision | Two certs share progress (completing A+ shows on Network+) | Make SK unique in new cert |
| PracticeGate ID mismatch | Practice test skips domains or crashes | Update `[{d:N,n:X}]` array to list all domain IDs |
| starredCards cross-contamination | Starring a card in one cert stars it in another | SK keys fix this — different keys = different save objects |
| Screen stuck after quiz exit | Clicking exit leaves blank screen | Verify `setScreen("home")` is called on exit, not a missing screen name |

---

## Quick-Reference Commands

```bash
# Full pre-merge sweep (A+)
FILE=src/a-plus/App.jsx
grep "const SK" $FILE
grep "^  {id:" $FILE | wc -l
grep "onExit" $FILE | head -5
grep -cin "n10-009\|netplus" $FILE
grep "{d:" $FILE
grep -c '"q":' $FILE

# SK collision check (all certs)
grep "const SK" src/App.jsx src/a-plus/App.jsx src/security-plus/App.jsx

# Build
npm run build 2>&1 | tail -5
```

*— Jordan, QA / Integration Engineer*
