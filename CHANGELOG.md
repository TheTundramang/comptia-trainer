# CompTIA Trainer — Changelog

All notable changes to this project are documented here.
Format: **[Version] — Date — Author(s) — What changed and why.**

---

## [Unreleased] — In Progress

### Security
- Added `window.storage` shim validation in all three cert App.jsx files — validates type signature and parse shape before trusting injected global *(Priya, Security Architect)*
- Corrected localStorage key names in SECURITY.md (aplus-v1, secplus-v1) *(Priya, Security Architect)*
- Added `<meta>` Content-Security-Policy tag to index.html as a hosting-independent baseline *(Evan, App Security)*
- Fixed page title from "CompTIA Network+ Trainer" → "CompTIA Trainer" *(Marcus, PM)*

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
