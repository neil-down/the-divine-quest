import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const file = path.join(DIST, urlPath);
  if (!file.startsWith(DIST) || !existsSync(file)) {
    res.writeHead(404); res.end('not found'); return;
  }
  const data = await readFile(file);
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  res.end(data);
});

async function rectanglesFor(page, selectors) {
  return page.evaluate((sels) => {
    const out = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) { out[s] = null; continue; }
      const r = el.getBoundingClientRect();
      out[s] = { left: r.left, top: r.top, right: r.right, bottom: r.bottom, w: r.width, h: r.height, visible: el.offsetWidth > 0 || el.offsetHeight > 0 };
    }
    return out;
  }, selectors);
}

function overlaps(a, b) {
  if (!a || !b) return false;
  return a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
}

const errors = [];
const results = {};
const step = (name, ok, detail = '') => {
  results[name] = ok;
  if (!ok) errors.push({ type: 'failed-probe', message: `${name}${detail ? ` (${detail})` : ''}` });
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const port = 18734;
await new Promise((r) => server.listen(port, r));

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleErrors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
page.on('requestfailed', (req) => {
  if (req.url().startsWith(`http://localhost:${port}`)) {
    consoleErrors.push(`requestfailed: ${req.url()} ${req.failure() && req.failure().errorText}`);
  }
});

try {
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
  await wait(7000); // let all module init timers (max +6000ms) settle

  const title = await page.title();
  step('browserTitle', title.includes('The Divine Quest'), title);

  const meta = await page.evaluate(() => ({
    version: window.APP_VERSION,
    game: !!window.game,
    story: (document.getElementById('story-text') || {}).textContent || '',
    faith: document.getElementById('faith') && document.getElementById('faith').textContent,
    wisdom: document.getElementById('wisdom') && document.getElementById('wisdom').textContent,
    compassion: document.getElementById('compassion') && document.getElementById('compassion').textContent
  }));
  step('browserBoot', meta.game && meta.version === '1.0.2', `v=${meta.version}`);
  step('browserStoryRendered', meta.story.trim().length > 50, `len=${meta.story.trim().length}`);
  step('browserStatsRender', meta.faith === '50' && meta.wisdom === '50' && meta.compassion === '50',
    `faith=${meta.faith} wisdom=${meta.wisdom} compassion=${meta.compassion}`);

  // --- Settings: single gear, opens + closes
  const gearCount = await page.locator('#settings-toggle').count();
  step('browserSettingsSingleton', gearCount === 1, `count=${gearCount}`);
  await page.locator('#settings-toggle').click();
  const panelVisible = await page.evaluate(() => {
    const p = window.settings && window.settings.panel;
    if (!p) return false;
    const r = p.getBoundingClientRect();
    return p.classList.contains('hidden') === false && r.width > 0 && r.height > 0;
  });
  step('browserSettingsOpens', panelVisible);
  await page.locator('#settings-toggle').click();
  const panelClosed = await page.evaluate(() =>
    !!(window.settings && window.settings.panel && window.settings.panel.classList.contains('hidden')));
  step('browserSettingsCloses', panelClosed);

  // --- Puzzle: creed_match renders in DOM, solves on real click, VFX fires
  const creed = await page.evaluate(() =>
    window.puzzleSystem && window.puzzleSystem.puzzles.find((p) => p.id === 'creed_match'));
  step('browserCreedData', !!creed);
  if (creed) {
    await page.evaluate(() => {
      const p = window.puzzleSystem.puzzles.find((x) => x.id === 'creed_match');
      window.puzzleSystem.currentPuzzle = null;
      window.puzzleSystem.showPuzzle(p);
    });
    await wait(50);
    const creedRendered = await page.evaluate(() => {
      const overlay = document.getElementById('puzzle-overlay');
      return !!overlay && overlay.querySelectorAll('[onclick^="window.puzzles.submitAnswer"]').length > 0;
    });
    step('browserCreedRenders', creedRendered);
    const vfxBefore = await page.evaluate(() =>
      (document.getElementById('puzzle-overlay') || { childElementCount: 0 }).childElementCount);
    const creedCorrect = creed.options.findIndex((o) => o.correct);
    await page.locator(`[onclick="window.puzzles.submitAnswer(${creedCorrect})"]`).click();
    await wait(300); // let mystic rings (t+200ms) append
    const creedSolved = await page.evaluate(() => window.puzzleSystem.solvedPuzzles.includes('creed_match'));
    step('browserCreedSolved', creedSolved);
    const vfxAfter = await page.evaluate(() => {
      const count = (document.getElementById('puzzle-overlay') || { childElementCount: 0 }).childElementCount;
      const orbLive = !!document.querySelector('#puzzle-overlay *[style*="orbFloat"]') ||
        Array.from(document.querySelectorAll('#puzzle-overlay *')).some((el) => (el.style && el.style.animation || '').includes('orbFloat'));
      return { count, orbLive };
    });
    step('browserVfxFired', vfxAfter.count > vfxBefore || vfxAfter.orbLive, `before=${vfxBefore} ${JSON.stringify(vfxAfter)}`);
    await page.evaluate(() => window.puzzles.closePuzzle());
  }

  // --- solas_match: wrong click safe, correct click solves
  const solas = await page.evaluate(() =>
    window.puzzleSystem && window.puzzleSystem.puzzles.find((p) => p.id === 'solas_match'));
  step('browserSolasData', !!solas);
  if (solas) {
    const correctIdx = solas.options.findIndex((o) => o.correct);
    const wrongIdx = solas.options.findIndex((o, i) => i !== correctIdx);
    await page.evaluate(() => {
      const p = window.puzzleSystem.puzzles.find((x) => x.id === 'solas_match');
      window.puzzleSystem.currentPuzzle = null;
      window.puzzleSystem.showPuzzle(p);
    });
    await wait(50);
    await page.locator(`[onclick="window.puzzles.submitAnswer(${wrongIdx})"]`).click();
    await wait(50);
    const solasStillOpen = await page.evaluate(() => {
      const o = document.getElementById('puzzle-overlay');
      return !!o && !o.classList.contains('hidden');
    });
    step('browserSolasWrongSafe', solasStillOpen);
    await page.locator(`[onclick="window.puzzles.submitAnswer(${correctIdx})"]`).click();
    await wait(100);
    const solasSolved = await page.evaluate(() => window.puzzleSystem.solvedPuzzles.includes('solas_match'));
    step('browserSolasSolved', solasSolved);
    await page.evaluate(() => window.puzzles.closePuzzle());
  }

  // --- Battle: real fight via clicks, single victory, overlay cleaned up
  const battleStarted = await page.evaluate(() => {
    window.battleEncounters.battleSystem.startBattle();
    return true;
  });
  step('browserBattleStart', battleStarted);
  await wait(100);
  const battleOverlay = await page.evaluate(() => {
    const o = document.getElementById('battle-overlay');
    if (!o) return { exists: false };
    const r = o.getBoundingClientRect();
    return { exists: true, w: Math.round(r.width), h: Math.round(r.height) };
  });
  step('browserBattleOverlayVisible', battleOverlay.exists && battleOverlay.w > 200, JSON.stringify(battleOverlay));

  const faithBefore = await page.evaluate(() => window.game.playerStats.faith);
  const prayerBtn = page.locator('#battle-overlay button', { hasText: 'Prayer' }).first();
  await prayerBtn.click().catch(() => {});
  await wait(800);
  await page.locator('#battle-overlay button', { hasText: 'Prayer' }).first().click().catch(() => {});
  await wait(4000); // victory pause (3s) + cleanup
  const battleOver = await page.evaluate(() => ({
    overlayGone: !document.getElementById('battle-overlay') ||
      document.getElementById('battle-overlay').classList.contains('hidden'),
    faith: window.game.playerStats.faith,
    battleEnded: !!window.battle && window.battle.battleEnded,
    inBattle: !!(window.battle && window.battle.inBattle)
  }));
  step('browserBattleWon', battleOver.overlayGone && battleOver.faith > faithBefore,
    `faith ${faithBefore}->${battleOver.faith}`);
  // attempted double victory must be a no-op (guarded)
  await page.evaluate(() => { if (window.battle) window.battle.victory(); });
  await wait(200);
  const battleGuard = await page.evaluate(() => ({
    faith: window.game.playerStats.faith, inBattle: !!(window.battle && window.battle.inBattle)
  }));
  step('browserDoubleVictoryBlocked', battleGuard.faith === battleOver.faith && !battleGuard.inBattle,
    `faith ${battleOver.faith}->${battleGuard.faith}`);

  // --- Layout collision check: bottom-right row at mobile + desktop
  for (const vp of [{ width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    await page.setViewportSize(vp);
    await wait(200);
    const rects = await rectanglesFor(page, [
      '#devotions-btn', '#audio-toggle', '#ambient-toggle', '#settings-toggle',
      '#ritual-button', '#study-guide-btn'
    ]);
    const cornerRight = ['#devotions-btn', '#audio-toggle', '#ambient-toggle', '#settings-toggle'];
    const cornerLeft = ['#ritual-button', '#study-guide-btn'];
    let collide = false;
    for (let i = 0; i < cornerRight.length; i++) {
      for (let z = i + 1; z < cornerRight.length; z++) {
        if (overlaps(rects[cornerRight[i]], rects[cornerRight[z]])) { collide = true; break; }
      }
      if (collide) break;
    }
    for (let i = 0; i < cornerLeft.length; i++) {
      for (let z = i + 1; z < cornerLeft.length; z++) {
        if (overlaps(rects[cornerLeft[i]], rects[cornerLeft[z]])) { collide = true; break; }
      }
      if (collide) break;
    }
    step(`browserLayoutNoOverlap_${vp.width}`, !collide,
      JSON.stringify(Object.fromEntries(Object.entries(rects).map(([k, v]) => [k, v && { l: Math.round(v.left), t: Math.round(v.top), r: Math.round(v.right), b: Math.round(v.bottom) }]))));
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  const shotDir = path.join(process.env.TEMP || __dirname, 'opencode', 'divine-quest-shots');
  const { mkdirSync } = await import('fs');
  mkdirSync(shotDir, { recursive: true });
  const shotPath = path.join(shotDir, 'browser-smoke.png');
  await page.screenshot({ path: shotPath, fullPage: true });
} catch (e) {
  errors.push({ type: 'browser-crash', message: e.message, stack: e.stack });
} finally {
  step('browserZeroConsoleErrors', consoleErrors.length === 0, consoleErrors.join(' | ').slice(0, 400));
  await browser.close();
  server.close();
}

const result = {
  errors,
  total: errors.length,
  probes: Object.keys(results).filter((k) => results[k]).length
};
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length === 0 ? 0 : 1);