import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const htmlPath = path.join(distDir, 'index.html');
const jsPath = path.join(distDir, 'bundle.js');

const html = fs.readFileSync(htmlPath, 'utf-8');
const bundleJs = fs.readFileSync(jsPath, 'utf-8');

// Strip the bundle script tag so JSDOM doesn't try to fetch it
const testHtml = html.replace('<script src="bundle.js"></script>', '');

const dom = new JSDOM(testHtml, {
  runScripts: 'outside-only',
  url: 'http://localhost',
  pretendToBeVisual: true,
  beforeParse(window) {
    window._smokeTestErrors = [];
    window.console = new Proxy(window.console, {
      get(target, prop) {
        const orig = target[prop];
        if (typeof orig === 'function') {
          return (...args) => {
            try {
              orig.apply(target, args);
            } catch (e) {
              window._smokeTestErrors.push({
                type: `console-${String(prop)}-throw`,
                message: e.message,
              });
            }
            const msg = args
              .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
              .join(' ');
            if (prop === 'error' || prop === 'warn') {
              window._smokeTestErrors.push({ type: `console-${String(prop)}`, message: msg });
            }
          };
        }
        return orig;
      },
    });
  },
});

const win = dom.window;
const doc = win.document;

win.addEventListener('error', (e) => {
  win._smokeTestErrors.push({
    type: 'uncaught',
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
  });
});

win.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || String(e.reason);
  win._smokeTestErrors.push({ type: 'unhandledrejection', message: msg });
});

// Suppress confirm/alert to avoid interactive blocks
win.confirm = () => false;
win.alert = () => {};

// Inject the bundle script manually
const scriptEl = doc.createElement('script');
scriptEl.textContent = bundleJs;
doc.body.appendChild(scriptEl);

// Fire DOMContentLoaded immediately after script injection
doc.dispatchEvent(new win.Event('DOMContentLoaded'));

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSmokeTest() {
  await wait(500); // let initial setup run
  await wait(2500); // wait for battle-system override (2s timeout)

  // Step 1: Advance a chapter by clicking the first choice button
  const firstChoiceBtn = doc.querySelector('button[onclick^="makeChoice"]');
  if (firstChoiceBtn) {
    firstChoiceBtn.click();
  } else {
    // fallback: call global directly
    if (typeof win.makeChoice === 'function') win.makeChoice(1);
  }
  await wait(1500);

  // Step 2: Trigger a battle directly if battle system is ready
  if (win.battleEncounters && win.battleEncounters.battleSystem) {
    try {
      win.battleEncounters.battleSystem.startBattle('random');
    } catch (e) {
      win._smokeTestErrors.push({ type: 'battle-start-error', message: e.message, stack: e.stack });
    }
  }
  await wait(1500);

  // Step 3: Open settings
  if (win.settings && typeof win.settings.togglePanel === 'function') {
    win.settings.togglePanel();
  }
  await wait(800);

  // Close settings
  if (win.settings && typeof win.settings.closePanel === 'function') {
    win.settings.closePanel();
  }
  await wait(1000);

  // Let remaining async work flush
  await wait(3000);

  const collectedErrors = win._smokeTestErrors || [];
  return collectedErrors;
}

runSmokeTest()
  .then((errors) => {
    console.log(JSON.stringify({ errors, total: errors.length }, null, 2));
    dom.window.close();
    process.exit(errors.length > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Smoke test crashed:', err);
    dom.window.close();
    process.exit(1);
  });
