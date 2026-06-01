# CompTIA Trainer — Project Structure
**Maintained by:** Casey (Infrastructure & Knowledge)

---

## File Map

```
comptia-trainer/
├── index.html                        # Vite entry HTML — mounts #root
├── package.json                      # react + react-dom only; vite dev build
├── vite.config.js                    # standard @vitejs/plugin-react config
├── README.md                         # full technical docs + Team Charter
├── SECURITY.md                       # security model, CSP, checklist
└── src/
    ├── main.jsx                      # ReactDOM.createRoot → <Landing />
    ├── Landing.jsx                   # cert selector + routing state machine
    ├── App.jsx                       # Network+ trainer (N10-009) — canonical template
    ├── network-plus/
    │   └── App.jsx                   # shim: export { default } from '../App.jsx'
    ├── a-plus/
    │   └── App.jsx                   # A+ trainer (220-1101/220-1102, 9 domains)
    └── security-plus/
        └── App.jsx                   # Security+ trainer (SY0-701, 5 domains)

.claude/
├── settings.json                     # project-level tool permissions for subagents
├── PROJECT_STRUCTURE.md              # this file
└── STATUS.md                         # Logan's ops digest
```

### The Network+ Shim Pattern
`src/network-plus/App.jsx` contains only:
```js
export { default } from '../App.jsx';
```
This lets `Landing.jsx` import all certs from consistent paths (`./a-plus/App.jsx`, `./network-plus/App.jsx`, `./security-plus/App.jsx`) without duplicating the Network+ source. `src/App.jsx` remains the canonical Network+ implementation.

---

## Shared Patterns

Every cert App.jsx uses these identical helpers — copy them verbatim when adding a new cert.

### Color Palette
```js
const C = {
  bg:"#08090f", surface:"#0d1120", border:"#1a2540", muted:"#2a3a55",
  text:"#c8d8f0", dim:"#4a6080", d1:"#00b4d8", d2:"#f77f00", d3:"#4cc9f0",
  d4:"#e63946", d5:"#06d6a0", gold:"#ffd166", green:"#06d6a0", red:"#e63946",
  orange:"#f77f00", purple:"#9b5de5",
};
```

### Utility Functions
```js
function hexRgb(hex) { /* converts #rrggbb → "r,g,b" for rgba() use */ }
function scoreColor(p) { return p>=80 ? C.green : p>=65 ? C.orange : C.red; }
function shuffle(arr) { /* Fisher-Yates in-place shuffle, returns new array */ }
```

### localStorage Save/Load
```js
const SK = "netplus-v2";  // MUST be unique per cert — see key registry below

async function loadSave() {
  // tries window.storage (embedded shim) first, falls back to localStorage
  // returns parsed object or {}
}
async function writeSave(d) {
  // writes JSON blob to window.storage or localStorage under SK key
}
```

### Style System
```js
const S = {
  app:    { minHeight:"100vh", background:C.bg, fontFamily:"'Courier New',monospace", ... },
  scan:   { /* fixed scanline overlay, pointerEvents:none, zIndex:1 */ },
  wrap:   { maxWidth:740, margin:"0 auto", padding:"20px 16px", zIndex:2 },
  divider:{ height:1, background:"linear-gradient(90deg,transparent,#00b4d8,transparent)" },
  card:   (border=C.border) => ({ border, borderRadius:10, padding:"18px 20px", ... }),
  label:  (color=C.dim) => ({ fontSize:10, letterSpacing:3, color, textTransform:"uppercase" }),
  btn:    (color, fill) => ({ /* outlined or filled button styles */ }),
  optionBtn: (state, color) => ({ /* quiz answer button — states: default/selected/correct/wrong */ }),
  row:    { display:"flex", gap:10, flexWrap:"wrap", marginTop:14 },
  tag:    (color) => ({ fontSize:10, padding:"3px 9px", border:`1px solid ${color}`, borderRadius:12 }),
};
```

---

## Screen State Machine

The `screen` state string inside each cert's `App` component controls which component renders. Navigation is done by calling `setScreen(name)`.

| Screen Name | Component | Notes |
|---|---|---|
| `"home"` | `HomeScreen` | Dashboard — progress, menu cards, domain list |
| `"domainSelect"` | `DomainSelectScreen` | Pick a domain to study |
| `"domainQuiz"` | `QuizScreen` (mode="domain") | Requires `quizState` set first |
| `"daily"` | `DailyScreen` | Pick focus for 10-question daily practice |
| `"dailyQuiz"` | `QuizScreen` (mode="daily") | Requires `quizState` set first |
| `"practiceGate"` | `PracticeGate` | Locked/unlocked gate + start button |
| `"practiceQuiz"` | `QuizScreen` (mode="practice") | Requires `quizState` set first |
| `"result"` | `ResultScreen` | Score, domain breakdown, weak spots |
| `"review"` | `ReviewScreen` | Step through every Q with answers |
| `"flashcards"` | `FlashcardHome` | Mode selector + deck selector |
| `"fc-flip"` | `FlashcardFlip` | Tap-to-reveal card mode |
| `"fc-drill"` | `FlashcardDrill` | Self-graded drill mode |
| `"fc-browse"` | `FlashcardBrowse` | Searchable scrollable reference |

---

## Data Structures

### DOMAINS entry
```js
{
  id: 1,                          // integer, must be unique within cert
  name: "Networking Concepts",    // display name
  weight: "23%",                  // exam domain weight
  color: C.d1,                    // accent color from C palette
  icon: "🌐",                     // emoji icon
  desc: "OSI model, protocols...",// short description
  questions: [                    // array of question objects (see below)
    {
      topic: "OSI Model",         // topic label shown as tag
      q: "What does...?",         // question text
      options: ["A","B","C","D"], // exactly 4 answer choices
      answer: 0,                  // 0-indexed correct answer
      explanation: "...",         // shown after answering
      analogy: "...",             // real-world analogy
      realWorld: "...",           // practical application context
    }
  ]
}
```

### FLASHCARD_DOMAINS entry
```js
{
  id: "fc1",                      // string ID, unique within cert
  name: "OSI & TCP/IP Models",    // deck display name
  color: C.d1,                    // accent color
  icon: "🧱",                     // emoji icon
  cards: [
    {
      term: "OSI Model — All 7 Layers",
      definition: "Physical · Data Link · Network...",
      acronym: "Memory trick / mnemonic...",
      analogy: "Real-world comparison...",
      category: "Memorization",   // tag shown in browse/flip
    }
  ]
}
```

### quizState object
```js
{
  mode: "domain" | "daily" | "practice",
  domain: { ...DOMAINS entry },   // domain mode only
  questions: [...],               // array of question objects with domainId/domainName/domainColor injected
  qIdx: 0,                        // current question index
  answers: [],                    // grows as user answers: [{qIdx, selected, correct, confidence}]
  score: 0,                       // running correct count
  confidence: [],                 // "sure" | "guess" per answer
  domainIds: [...],               // daily mode only
  startTime: Date.now(),          // practice mode only
  finalPct: 85,                   // set on completion
  finishedAt: Date.now(),         // set on completion
}
```

### save object (localStorage)
```js
{
  streak: 3,                      // consecutive days with activity
  lastActive: "2026-05-31",       // ISO date string YYYY-MM-DD
  domainProgress: {
    1: { bestScore: 85, attempts: 2, lastPct: 80 },  // keyed by domain id
    // ...one entry per completed domain
  },
  practiceHistory: [
    { pct: 78, date: 1748700000000, total: 90 },     // timestamp ms
  ],
  starredCards: ["OSI Model — All 7 Layers", ...],   // card.term strings
}
```

---

## Adding a New Cert — Technical Checklist

1. **Create directory and file:**
   ```
   src/your-cert/App.jsx
   ```

2. **Set a unique localStorage key** (first thing in the file):
   ```js
   const SK = "yourcert-v1";  // see key registry — must not collide
   ```

3. **Define DOMAINS** — set correct domain count. A+ has 9; Network+ and Sec+ have 5.

4. **Fix `practiceUnlocked` check** to match your domain count:
   ```js
   const practiceUnlocked = DOMAINS.every(d => dp[d.id]);
   // This is correct as-is — just make sure DOMAINS has the right entries
   ```

5. **Fix `PracticeGate` startPractice** — update the domain distribution array to list ALL your domain IDs:
   ```js
   // Network+ example (5 domains):
   [{d:1,n:21},{d:2,n:17},{d:3,n:15},{d:4,n:18},{d:5,n:19}]
   // A+ needs 9 entries; adjust n values so they sum to ~90
   ```

6. **Wire the `onExit` prop** — App component must accept it:
   ```js
   export default function App({ onExit }) { ... }
   // Pass it to HomeScreen:
   <HomeScreen ... onExit={onExit} />
   // HomeScreen renders the back button:
   {onExit && <button onClick={onExit}>← ALL CERTS</button>}
   ```

7. **Update HomeScreen header text:**
   ```js
   <div>COMPTIA YOUR-EXAM-CODE</div>      // subtitle
   <div>COMPTIA TRAINER</div>             // main title (same for all)
   <div>YOUR TAGLINE · ALL N DOMAINS</div> // tagline
   ```

8. **Register in `Landing.jsx`:**
   ```js
   import YourCertApp from "./your-cert/App.jsx";
   // Add routing:
   if (selected === "yourcert") return <YourCertApp onExit={() => setSelected(null)} />;
   // Add to CERTS array with status: "available"
   ```

9. **Run `npm run dev`** and verify:
   - Landing page shows new cert card
   - Selecting it launches the trainer
   - `← ALL CERTS` button returns to landing
   - Progress saves to localStorage under the new key

---

## Known Gotchas

| Gotcha | Symptom | Fix |
|---|---|---|
| **SK key collision** | Two certs share progress data | Every cert must have a unique `SK` constant |
| **Leftover Network+ text** | A+ shows "N10-009" or "ALL 5 DOMAINS" | Search cloned file for "N10-009", "netplus", "5 DOMAINS" |
| **Wrong domain count in header** | A+ says "ALL 5 DOMAINS" | Update HomeScreen tagline to match actual domain count |
| **PracticeGate missing domains** | Practice test skips some domains | Update `[{d:N,n:X}...]` array to include ALL domain IDs |
| **starredCards ID collision** | Starring a card in one cert affects another | `starredCards` uses `card.term` strings — keep terms unique across decks, or scope by cert via SK |
| **Empty stub crashes Vite** | Import resolves but component throws | Never leave an App.jsx as an empty file or stub |
| **`window.storage` shim** | Unexpected behavior in some environments | The `loadSave`/`writeSave` functions try `window.storage` first — this is for embedded deployments, not a bug |

---

## localStorage Key Registry

| Cert | Key | Version Notes |
|---|---|---|
| Network+ (N10-009) | `netplus-v2` | v2 added streak + confidence tracking |
| A+ (220-1101/1102) | `aplus-v1` | — |
| Security+ (SY0-701) | `secplus-v1` | — |

**Do not reuse or rename keys** without migrating existing user data. Changing a key silently creates a fresh save, losing all progress.

---

## Component Reference

| Component | Location | Purpose |
|---|---|---|
| `App` | default export | Root — loads save, owns screen state, routes to screens |
| `HomeScreen` | App.jsx | Dashboard: streak, overall %, menu cards, domain progress list |
| `DomainSelectScreen` | App.jsx | List of domains with progress; launches domainQuiz |
| `DailyScreen` | App.jsx | Domain selector for 10-question daily practice |
| `PracticeGate` | App.jsx | Locked/unlocked gate; builds 90-question practice pool |
| `QuizScreen` | App.jsx | Shared quiz UI for domain/daily/practice modes |
| `ResultScreen` | App.jsx | Score display, domain breakdown, confidence calibration, weak spots |
| `ReviewScreen` | App.jsx | Step through all Q&A with explanations and analogies |
| `FlashcardHome` | App.jsx | Mode picker (Flip/Drill/Browse) + deck selector |
| `FlashcardFlip` | App.jsx | Tap-to-reveal with star, shuffle, keyboard nav |
| `FlashcardDrill` | App.jsx | Self-graded drill with missed-card review at end |
| `FlashcardBrowse` | App.jsx | Searchable/filterable scrollable reference |
| `Celebration` | App.jsx | Confetti animation shown on passing score |
| `ProgressBar` | App.jsx | Reusable animated progress bar |
| `MenuCard` | App.jsx | Home screen menu item card |
| `BackBtn` | App.jsx | Reusable back button |
| `LandingScreen` | Landing.jsx | Cert selector cards |
