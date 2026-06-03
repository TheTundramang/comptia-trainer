// CompTIA Trainer — E2E Smoke Test
// Runs against the preview server (built dist) on port 5174
// Jordan (QA) owns this file — update when new certs or screens are added
import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://localhost:5174';
let passed = 0;
let failed = 0;

function pass(msg) { console.log('[ PASS ]', msg); passed++; }
function fail(msg) { console.error('[ FAIL ]', msg); failed++; }

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', e => consoleErrors.push(e.message));

// 1 — Landing page: all 3 cert cards visible
await page.goto(BASE, { waitUntil: 'networkidle' });
const hasAplus = await page.locator('text=CompTIA A+').count();
const hasNet   = await page.locator('text=CompTIA Network+').count();
const hasSec   = await page.locator('text=CompTIA Security+').count();
(hasAplus && hasNet && hasSec)
  ? pass('Landing: all 3 cert cards visible (A+, Network+, Security+)')
  : fail(`Landing: missing cert cards — A+:${hasAplus} Net+:${hasNet} Sec+:${hasSec}`);

// 2 — A+ launches to exam selector (CoreSelectScreen)
await page.locator('text=CompTIA A+').first().click();
await page.waitForTimeout(600);
const aplusBody = await page.textContent('body');
(aplusBody.includes('SELECT EXAM') && aplusBody.includes('220-1101') && aplusBody.includes('220-1102'))
  ? pass('A+: exam selector visible (SELECT EXAM · Core 1 · Core 2 options)')
  : fail('A+: exam selector not shown');

// 3 — ALL CERTS returns from A+
await page.locator('text=← ALL CERTS').click();
await page.waitForTimeout(400);
(await page.locator('text=CompTIA A+').count()) > 0
  ? pass('A+: ← ALL CERTS returns to landing')
  : fail('A+: ← ALL CERTS did not return to landing');

// 4 — Network+ launches
await page.locator('text=CompTIA Network+').first().click();
await page.waitForTimeout(600);
const netBody = await page.textContent('body');
(netBody.includes('N10-009') || netBody.includes('ALL 5 DOMAINS'))
  ? pass('Network+: trainer launches correctly')
  : fail('Network+: header not found');

// 5 — ALL CERTS returns from Network+
await page.locator('text=← ALL CERTS').click();
await page.waitForTimeout(400);
(await page.locator('text=CompTIA Network+').count()) > 0
  ? pass('Network+: ← ALL CERTS returns to landing')
  : fail('Network+: ← ALL CERTS did not return to landing');

// 6 — Security+ launches with correct header
await page.locator('text=CompTIA Security+').first().click();
await page.waitForTimeout(600);
const secBody = await page.textContent('body');
(secBody.includes('SY0-701') && (secBody.includes('5 DOMAINS') || secBody.includes('EXAM-ALIGNED')))
  ? pass('Security+: header correct (SY0-701 · 5 DOMAINS · EXAM-ALIGNED)')
  : fail('Security+: header incorrect');

// 7 — ALL CERTS returns from Security+
await page.locator('text=← ALL CERTS').click();
await page.waitForTimeout(400);
(await page.locator('text=CompTIA Security+').count()) > 0
  ? pass('Security+: ← ALL CERTS returns to landing')
  : fail('Security+: ← ALL CERTS did not return to landing');

// 8 — A+ domain study flow (select Full A+ from CoreSelectScreen first)
await page.locator('text=CompTIA A+').first().click();
await page.waitForTimeout(600);
await page.locator('text=Full A+').first().click();
await page.waitForTimeout(400);
await page.locator('text=Domain Study').click();
await page.waitForTimeout(400);
(await page.locator('text=Mobile Devices').count()) > 0
  ? pass('A+: domain list loaded (Mobile Devices visible)')
  : fail('A+: domain list did not load');

await page.locator('text=Mobile Devices').first().click();
await page.waitForTimeout(400);
const optA = page.locator('button').filter({ hasText: /^A\./ }).first();
if (await optA.count()) {
  await optA.click();
  await page.waitForTimeout(200);
  const knowIt = page.locator('button', { hasText: 'I Know This' }).first();
  if (await knowIt.count()) await knowIt.click();
  await page.waitForTimeout(200);
  const confirm = page.locator('button', { hasText: 'CONFIRM ANSWER' }).first();
  if (await confirm.count()) {
    await confirm.click();
    await page.waitForTimeout(400);
    (await page.locator('text=Explanation').count()) > 0
      ? pass('A+: quiz flow complete (answer → confidence → confirm → explanation)')
      : fail('A+: explanation panel did not appear');
  } else { fail('A+: CONFIRM ANSWER button not found'); }
} else { fail('A+: no answer options found in quiz'); }

// 9 — localStorage keys isolated
await page.goto(BASE);
await page.waitForTimeout(400);
await page.locator('text=CompTIA Network+').first().click();
await page.waitForTimeout(700);
await page.locator('text=← ALL CERTS').click();
await page.waitForTimeout(300);
await page.locator('text=CompTIA Security+').first().click();
await page.waitForTimeout(700);
const lsKeys = await page.evaluate(() => Object.keys(localStorage));
const hasAplusKey = lsKeys.includes('aplus-v1');
const hasNetKey   = lsKeys.includes('netplus-v2');
const hasSecKey   = lsKeys.includes('secplus-v1');
(hasAplusKey && hasNetKey && hasSecKey)
  ? pass(`localStorage: keys isolated — aplus-v1 ✓  netplus-v2 ✓  secplus-v1 ✓`)
  : fail(`localStorage: missing keys — aplus-v1:${hasAplusKey}  netplus-v2:${hasNetKey}  secplus-v1:${hasSecKey}`);

// 10 — No console errors
consoleErrors.length === 0
  ? pass('No console errors across entire test run')
  : fail(`Console errors detected: ${consoleErrors.slice(0, 3).join(' | ')}`);

await browser.close();

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('SMOKE TEST FAILED');
  process.exit(1);
}
console.log('SMOKE TEST PASSED');
