// Post-build script: injects SRI integrity attributes into dist/index.html
// Run automatically via `npm run build` (see package.json)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const distDir = path.join(__dirname, '..', 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('[sri] dist/index.html not found — run npm run build first');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

// Match all <script src="..."> and <link rel="stylesheet" href="..."> tags
const scriptRe = /<script([^>]*)\ssrc="([^"]+)"([^>]*)>/g;
const linkRe = /<link([^>]*)\shref="([^"]+)"([^>]*\brel="stylesheet"[^>]*)>/g;

function injectIntegrity(tag, before, assetPath, after) {
  if (tag.includes('integrity=')) return tag; // already has SRI
  const fullPath = path.join(distDir, assetPath.startsWith('/') ? assetPath.slice(1) : assetPath);
  if (!fs.existsSync(fullPath)) return tag;
  const hash = crypto.createHash('sha384').update(fs.readFileSync(fullPath)).digest('base64');
  const integrity = `sha384-${hash}`;
  return tag.replace(/>$/, ` integrity="${integrity}" crossorigin="anonymous">`);
}

html = html.replace(scriptRe, (match, before, src, after) =>
  injectIntegrity(match, before, src, after)
);
html = html.replace(linkRe, (match, before, href, after) =>
  injectIntegrity(match, before, href, after)
);

fs.writeFileSync(htmlPath, html);
console.log('[sri] Integrity attributes injected into dist/index.html');
