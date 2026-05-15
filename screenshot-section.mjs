import puppeteer from 'puppeteer-core';
import fs from 'fs';

const url    = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] || 'section';
const scrollY = parseInt(process.argv[4] || '0');
const dir = './temporary screenshots';

const existing = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || 0));
const n = (nums.length ? Math.max(...nums) : 0) + 1;
const outPath = `${dir}/screenshot-${n}-${label}.png`;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible')));
await new Promise(r => setTimeout(r, 500));
if (scrollY) await page.evaluate(y => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: outPath });
await browser.close();
console.log(`Saved: ${outPath}`);
