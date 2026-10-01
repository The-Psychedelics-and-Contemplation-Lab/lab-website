// Screenshots of every page at 1400 and 390 px (top of page + full page after scrolling so the reveals
// fired), one reduced-motion shot, one print preview, plus a contrast measurement of the white text
// over the marbled backgrounds (the darkest 5 % of the pixels under the text are taken as the worst
// case). Run: `npx astro preview --port 4331 &` then `node scripts/screenshots.mjs`.
import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const port = process.env.PORT ?? 4331;
const base = `http://localhost:${port}/lab-website`;
const out = 'screenshots';
mkdirSync(out, { recursive: true });
const pages = [
  ['home', '/'], ['research', '/research/'], ['psychedelic', '/psychedelic-research/'], ['contemplative', '/contemplative-research/'],
  ['people', '/people/'], ['publications', '/publications/'], ['media', '/media/'], ['contact', '/contact/'],
];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];

const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
/** Contrast of white against the darkest-5 %-percentile and the mean background inside a text box. */
async function contrast(page, selector) {
  const el = page.locator(selector).first();
  if (!(await el.count())) return null;
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const box = await el.boundingBox();
  if (!box) return null;
  // Hide the text itself, measure the background behind its box, then restore.
  await page.evaluate((s) => { document.querySelectorAll(s).forEach((e) => (e.style.visibility = 'hidden')); }, selector);
  const buf = await page.screenshot({ clip: { x: box.x, y: box.y, width: Math.max(1, box.width), height: Math.max(1, box.height) } });
  await page.evaluate((s) => { document.querySelectorAll(s).forEach((e) => (e.style.visibility = '')); }, selector);
  const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ls = [];
  for (let i = 0; i < data.length; i += 3) ls.push(lum(data[i], data[i + 1], data[i + 2]));
  ls.sort((a, b) => b - a);
  const p95 = ls[Math.floor(ls.length * 0.05)];      // 5 % brightest pixels = worst case for white text
  const mean = ls.reduce((a, b) => a + b, 0) / ls.length;
  return { worst: (1.05 / (p95 + 0.05)).toFixed(2), mean: (1.05 / (mean + 0.05)).toFixed(2) };
}

for (const [name, path] of pages) {
  for (const width of [1400, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 1400 ? 900 : 844 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`${name}@${width}: ${m.text()}`); });
    page.on('pageerror', (e) => errors.push(`${name}@${width}: ${e.message}`));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/${name}-${width}-top.png` });
    if (width === 1400) {
      const checks = { home: ['.hero--marble h1', '.hero--marble .lead'], research: ['.band-header h1', '.strand__panel h2', '.strand__panel p'], psychedelic: ['.band-header h1', '.band-header .lead', '.tab-row a'], people: ['.band-header h1', '.person--director .person__bio', '.person--olive .person__summary'] };
      for (const sel of checks[name] ?? ['.band-header h1', '.band-header .lead']) {
        const c = await contrast(page, sel);
        if (c) console.log(`contrast ${name} ${sel}: worst ${c.worst}:1, mean ${c.mean}:1`);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    // Scroll in steps so every reveal fires, then full page
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-${width}.png`, fullPage: true });
    await ctx.close();
  }
}
// Reduced motion: everything visible without any animation
{
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/home-1400-reduced-motion.png`, fullPage: true });
  await page.goto(base + '/people/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/people-1400-reduced-motion.png`, fullPage: true });
  await ctx.close();
}
// Print preview of the longest page
{
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await ctx.newPage();
  await page.goto(base + '/psychedelic-research/', { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/psychedelic-print.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors.');
