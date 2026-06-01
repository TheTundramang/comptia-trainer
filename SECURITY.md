# Security Policy

CompTIA Trainer is an open-source, client-side study tool. This document describes the security model honestly and proportionately. It is not a bank or a healthcare system — but it is maintained software, and these guidelines exist to keep it safe for everyone who uses it.

---

## 1. Security Model

This application is **purely client-side**. There is no backend server, no database, no API server, no authentication system, and no network services to attack. The entire application is a collection of static files (HTML, JS, CSS) delivered to the browser.

Implications:

- No server-side attack surface (no SQL injection, no SSRF, no server RCE, no auth bypass).
- No user accounts, no passwords, and no personally identifiable information (PII) of any kind is collected, transmitted, or stored.
- No third-party analytics, tracking scripts, or data brokers.
- The application works fully offline after the initial page load.

---

## 2. Data Storage

Study progress is persisted exclusively in the browser's `localStorage` under cert-specific keys (e.g., `netplus-v2`, `aplus-v2`, `secplus-v2`). The stored data consists only of:

- Quiz scores and streak counters
- Starred / bookmarked flashcard IDs
- Session timestamps for streak tracking

**This data never leaves the browser.** It is not transmitted to any server. It contains no credentials, no personal details, and nothing sensitive. A user can clear it at any time via their browser's site-data settings.

The `window.storage` check in `loadSave` / `writeSave` is a compatibility shim for sandboxed environments (e.g., desktop webview wrappers). The fallback is always `localStorage`. Neither path sends data off-device.

---

## 3. Content Security

All question banks, flashcard content, and domain data are **hardcoded compile-time constants** inside each cert's `App.jsx`. There is:

- No user-generated content of any kind.
- No external API calls or dynamic data fetching at runtime.
- No `eval()`, `new Function()`, `innerHTML` string injection, or dynamic `<script>` tag insertion.
- No third-party CDN dependencies loaded at runtime — all assets are bundled by Vite at build time.

The application cannot render attacker-controlled content because there is no mechanism to introduce external content.

---

## 4. Dependency Security

Runtime dependencies are minimal by design:

| Package | Role |
|---|---|
| `react` | UI rendering |
| `react-dom` | DOM bindings |

Dev dependencies (`vite`, `@vitejs/plugin-react`) are build-time only and are not present in the production bundle.

Maintenance checklist:

- Run `npm audit` regularly and resolve high/critical advisories promptly.
- Keep `react` and `react-dom` on a current minor release.
- Keep `vite` updated — build-tool vulnerabilities can affect build output integrity.
- Review `npm audit` output before every release tag.

---

## 5. Deployment Security

When deploying as a static site, configure the following HTTP response headers on your hosting provider (Netlify, Vercel, GitHub Pages, Cloudflare Pages, nginx, etc.):

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none';
```

Notes on the CSP above:

- `connect-src 'none'` is appropriate because the app makes no network requests at runtime.
- `'unsafe-inline'` is required for `style-src` because all styles are applied via React inline style objects. If this is a concern, a future refactor to CSS modules or a stylesheet would allow removing it.
- `object-src 'none'` and `form-action 'none'` close common injection vectors even though neither is used.

Additional deployment requirements:

- **HTTPS is required.** Never serve this (or any web app) over plain HTTP, even though no credentials are transmitted. HTTPS prevents content injection by network intermediaries.
- **No secrets belong in the codebase or build output.** There are none today. Keep it that way — do not add API keys, tokens, or credentials to any source file or environment config that gets bundled.
- Verify `dist/` output before publishing. Run `npm run build` and inspect the bundle to confirm no sensitive strings were accidentally included.

---

## 6. Adding a New Certification

When adding a new cert module (a new `App.jsx` inside its own `src/<cert-name>/` directory), review the following checklist before merging:

- [ ] No `eval()` or `new Function()` calls anywhere in the new file.
- [ ] No `fetch()`, `XMLHttpRequest`, `import()` (dynamic), or WebSocket calls — all content must be static constants.
- [ ] No hardcoded API keys, tokens, passwords, or license keys.
- [ ] No `innerHTML` or `dangerouslySetInnerHTML` used with any non-literal string.
- [ ] `localStorage` key is unique (e.g., `aplus-v2`, `secplus-v2`) to prevent data collisions between certs.
- [ ] New cert is registered in `src/Landing.jsx` under the `CERTS` array with a correct `id` and matching `status`.
- [ ] `npm audit` passes with no high or critical findings after adding any new dev dependency.

---

## 7. Reporting a Vulnerability

If you discover a security issue in this project, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Email the maintainer directly at **mrmikerobertson6@gmail.com** with:

- A brief description of the issue and potential impact
- Steps to reproduce or a proof-of-concept (if applicable)
- Any suggested remediation

You can expect an acknowledgement within a few days. Because this is a client-side study tool with no backend and no user accounts, the realistic blast radius of most findings is limited — but all reports are taken seriously and will be addressed in good faith.

---

*Last reviewed: 2026-05-31*
