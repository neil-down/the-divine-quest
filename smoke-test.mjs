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
  runScripts: 'dangerously',
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

// Fire the bundle by injecting it; jsdom then dispatches DOMContentLoaded
// naturally (dispatching it manually here would double-fire bootstraps).
const scriptEl = doc.createElement('script');
scriptEl.textContent = bundleJs;
doc.body.appendChild(scriptEl);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSmokeTest() {
  const probe = {};
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

  // Step 2: Drive a full battle to prove the loop completes without throwing
  // and that the double-victory guard blocks double rewards.
  probe.battleLoopCompletes = false;
  probe.battleDoubleVictoryBlocked = false;
  if (win.battleEncounters && win.battleEncounters.battleSystem) {
    const bs = win.battleEncounters.battleSystem;
    const priorOverlay = doc.getElementById('battle-overlay');
    if (priorOverlay) priorOverlay.remove();
    bs.inBattle = false;
    bs.battleEnded = false;
    try {
      bs.currentEnemy = { ...bs.enemies[0] };
      bs.inBattle = true;
      bs.battleEnded = false;
      bs.playerHP = 100;
      bs.playerMP = 50;
      bs.combo = 0;
      bs.battleTurn = 0;
      const enemy = bs.currentEnemy;
      bs.createBattleUI();
      bs.showBattleIntro();
      const faithBefore = win.game.playerStats.faith;
      let guard = 0;
      while ((enemy.hp || 0) > 0 && guard < 12) {
        bs.useSkill('prayer');
        guard++;
      }
      probe.battleLoopCompletes = (enemy.hp <= 0) && win.game.playerStats.faith > faithBefore;
      const afterReward = win.game.playerStats.faith;
      bs.victory();
      probe.battleDoubleVictoryBlocked = win.game.playerStats.faith === afterReward;
      const bOverlay = doc.getElementById('battle-overlay');
      if (bOverlay) bOverlay.remove();
      bs.inBattle = false;
      bs.battleEnded = false;
    } catch (e) {
      win._smokeTestErrors.push({ type: 'battle-crash', message: e.message, stack: e.stack });
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

  // Step 4: Verify core globals are wired (regression gate for the systems
  // that have previously shipped broken: visual cow, nightmare aliases).
  const requiredGlobals = [
    'game', 'battleEncounters', 'divineAudio', 'factionSystem', 'I18N',
    'infiniteLoop', 'puzzleSystem', 'progressionSystem', 'SETTINGS',
    'studyGuide', 'visualEffects'
  ];
  for (const g of requiredGlobals) {
    probe[g] = typeof win[g] !== 'undefined';
  }
  probe.nightmareAliases = win.nightmare === win.nightmareMode && win.challenge === win.nightmareMode && !!win.nightmareMode;
  for (const [key, ok] of Object.entries(probe)) {
    if (!ok) {
      win._smokeTestErrors.push({ type: 'missing-global', message: key });
    }
  }

  // Step 5: Content-pack pipeline probes (chapters, WEB verses, gifts, gates).
  const content = win.__TDQ_CONTENT && win.__TDQ_CONTENT.packs;
  probe.contentBridge = !!content;
  probe.chapterCount30 = !!content && !!content.chapters && Array.isArray(content.chapters.chapters) && content.chapters.chapters.length >= 30;
  probe.verseSystem = typeof win.VerseSystem !== 'undefined';
  probe.giftSystem = typeof win.GiftSystem !== 'undefined';
  if (probe.verseSystem) {
    const v = win.VerseSystem.lookup('John 3:16');
    probe.webJohn316 = !!(v && /God so loved the world/i.test(v.text));
    const mem = win.VerseSystem.unlock('John 3:16');
    probe.memoryVerseUnlock = !!(mem && win.VerseSystem.isUnlocked('John 3:16'));
  }
  if (probe.giftSystem) {
    const before = win.GiftSystem.summary().gifts.faith;
    win.GiftSystem.gift('faith', 1);
    probe.giftsAdvance = win.GiftSystem.summary().gifts.faith === before + 1;
  }
  // Theme verse from the WEB registry should be rendered on the current scene
  // (whichever chapter the earlier choice step landed on).
  const refEl = doc.getElementById('scripture-reference');
  const knownRefs = new Set([
    'John 14:6', 'James 5:16', '2 Timothy 3:16', 'Romans 10:14', 'Romans 11:36',
    '2 Corinthians 5:17', 'John 4:14', 'Acts 2:4', 'Hebrews 11:1', 'Ephesians 6:12',
    '1 Peter 1:3', 'Hebrews 12:1', 'Revelation 21:4', 'Galatians 2:16', 'Jude 3',
    'Philippians 1:6', 'Ephesians 2:8',
    'Luke 14:27', 'Romans 4:3', 'Hebrews 6:19', 'Titus 2:11', 'Psalm 23:1',
    'Matthew 28:19', '1 Corinthians 12:12', '1 Corinthians 12:13', 'James 1:2',
    'Romans 12:2', 'Revelation 19:9', 'Revelation 22:13',
    'Ephesians 1:13', 'Revelation 22:20', 'Proverbs 18:10', 'Romans 8:23'
  ]);
  probe.themeVerseRendered = !!refEl && knownRefs.has(refEl.textContent.trim());
  if (!probe.themeVerseRendered && refEl) {
    win._smokeTestErrors.push({ type: 'theme-verse-actual', message: `rendered="${refEl.textContent.trim()}"` });
  }
  // Attribute gates: chapter 13 choice 0 requires wisdom >= 55 (player starts at 50).
  if (win.game && win.game.storyChapters) {
    const gated = win.game.storyChapters[13] && win.game.storyChapters[13].scenes[0].choices[0];
    probe.gateRequirementData = !!(gated && gated.requirement && gated.requirement.attribute === 'wisdom');
    win.game.playerStats.wisdom = 50;
    win.game.loadChapter(13, 0);
    const s0 = doc.querySelectorAll('#choices-container .choice-button');
    if (s0.length > 0) probe.gateDisablesButton = s0[0].disabled === true;
    if (s0.length > 1) probe.gateKeepsEligible = s0[1].disabled === false;
  }
  // Act II: flags ledger + flag-variant scenes + explicit faction influence.
  probe.flagsLedger = !!(win.game && win.game.flags && win.game.flags instanceof win.Set);
  if (win.game && win.game.flags) {
    win.game.flags.add('valleyWalk');
    win.game.loadChapter(21, 0);
    const storyEl = doc.getElementById('story-text');
    probe.flagVariantScene = !!storyEl && storyEl.textContent.includes('the valley you walked through');
    win.game.flags.delete('valleyWalk');
    win.game.loadChapter(21, 0);
    probe.flagVariantReset = !!storyEl && !storyEl.textContent.includes('the valley you walked through');
    win.game.flags.add('pathDiscipleship');
  }
  if (win.factionSystem && win.game) {
    win.game.currentChapter = 16;
    win.game.currentScene = 0;
    const fx = win.factionSystem._choiceFactionEffect(0);
    probe.explicitFactionApplied = !!(fx && fx['The Faithful'] === 6 && fx['The Doubting'] === 0);
  } else {
    probe.explicitFactionApplied = false;
  }

  // Ending resolution renders overlay, restart, faction + echoes blocks.
  if (win.game && typeof win.game.showEnding === 'function') {
    win.game.showEnding('glory');
    const ending = doc.getElementById('ending-overlay');
    probe.endingOverlayRenders = !!ending;
    probe.endingRestartButton = !!ending && !!ending.querySelector('#ending-restart');
    probe.endingFactionsBlock = !!ending && ending.textContent.includes('Faction Standing');
    probe.endingEchoesBlock = !!ending && ending.textContent.includes('Echoes of Your Walk');
    probe.endingStatsLedger = !!ending && ending.textContent.includes('Pilgrim');
    ending && ending.remove();
  }

  // Wave 2: Devotion Center (daily devotional + memory-verse review).
  probe.devotionCenter = !!(win.DevotionCenter && typeof win.DevotionCenter.open === 'function');
  if (probe.devotionCenter) {
    const a = win.DevotionCenter.verseOfDay(new Date(2026, 8, 24));
    const b = win.DevotionCenter.verseOfDay(new Date(2026, 8, 24));
    probe.devotionalDeterministic = !!(a && b && a.ref === b.ref && typeof a.reflection === 'string' && a.reflection.length > 0);
    probe.devotionalWebText = !!(a && a.text && a.text.length > 0);
    const streak = win.DevotionCenter.checkIn(new Date(2026, 8, 24));
    probe.devotionStreak = typeof streak === 'number' && streak >= 1;
    const modal = win.DevotionCenter.open();
    probe.devotionModalRenders = !!doc.getElementById('devotion-modal');
    probe.devotionCloseWorks = !!(modal && modal.querySelector('[data-devotion-close]'));
  }

  // Wave 4: Study Guide Act II topics.
  probe.studyGuideActII = false;
  probe.studyGuideRendersChapterTopic = false;
  if (win.studyGuide && win.studyGuide.content) {
    const c17 = win.studyGuide.content[17];
    const c25 = win.studyGuide.content[25];
    probe.studyGuideActII = !!(c17 && c25 && c17.title && c17.commentary && c17.scripture && c17.scripture.text.length > 0 && c17.questions.length === 3);
    const sg = win.studyGuide;
    if (!sg.isOpen) sg.openPanel();
    if (typeof sg.browseIndex === 'number') sg.browseIndex = 17;
    sg.renderContent(17);
    const sgArea = doc.getElementById('study-guide-content');
    probe.studyGuideRendersChapterTopic = !!sgArea && sgArea.textContent.includes('Faith Counted as Righteousness');
    if (sg.isOpen) sg.closePanel();
  }

  // Wave 4: Pilgrim's Journal records chapters and renders the log.
  probe.journalCenter = false;
  probe.journalRecordsChapters = false;
  probe.journalModalRenders = false;
  probe.journalShowsEntry = false;
  probe.journalButton = false;
  if (win.PilgrimJournal && typeof win.PilgrimJournal.open === 'function') {
    probe.journalCenter = true;
    doc.dispatchEvent(new win.CustomEvent('chapterChanged', { detail: { chapter: 6, scene: 0 } }));
    const jl = win.PilgrimJournal.load();
    probe.journalRecordsChapters = jl.some((e) => e.index === 6) && jl.some((e) => e.index === 0);
    const jModal = win.PilgrimJournal.open();
    probe.journalModalRenders = !!doc.getElementById('journal-modal');
    probe.journalShowsEntry = !!jModal && jModal.textContent.includes('Chapter 7');
    probe.journalButton = !!doc.querySelector('#journal-btn');
    win.PilgrimJournal.close();
  }

  // Wave 4: milestone achievements register correctly.
  probe.achievementMilestones = false;
  if (win.game && typeof win.game.checkAchievements === 'function' && win.game.flags instanceof win.Set) {
    win.game.flags.add('journalProbeA');
    win.game.flags.add('journalProbeB');
    win.game.currentChapter = 25;
    win.game.checkAchievements();
    const ea = win.game.earnedAchievements;
    probe.achievementMilestones = ea.has('Pathfinder') || ea.has('Face to Face') || ea.has('Act II: The Deeper Walk');
  }

  // Wave 5: Grace Shop wiring — milestone grace-point currency, starting-faith
  // perk, and Pathfinder's Sight (variant reveal without the flag).
  probe.graceMilestoneGrant = false;
  probe.faithHeadStart = false;
  probe.pathfinderSight = false;
  probe.pathfinderSightReset = false;
  for (let i = 0; i < 30 && !win.progressionSystem; i++) await wait(150);
  if (win.progressionSystem && typeof win.progressionSystem.awardMilestone === 'function') {
    const g0 = win.progressionSystem.gracePoints;
    win.progressionSystem.awardMilestone('__graceProbe__');
    const g1 = win.progressionSystem.gracePoints;
    win.progressionSystem.awardMilestone('__graceProbe__');
    const g2 = win.progressionSystem.gracePoints;
    probe.graceMilestoneGrant = g1 === g0 + 1 && g2 === g1;
  }
  if (win.game && win.questPerks) {
    win.questPerks.faithHeadStart = 7;
    win.game.resetGame();
    probe.faithHeadStart = win.game.playerStats.faith === 57;
    win.questPerks.faithHeadStart = 0;
  }
  if (win.game && win.questPerks && win.game.storyChapters[21] && win.game.storyChapters[21].scenes[0] && win.game.storyChapters[21].scenes[0].variant) {
    win.game.flags.delete('valleyWalk');
    win.questPerks.pathfinder = true;
    win.game.goToChapter(21, 0);
    let st = doc.getElementById('story-text');
    probe.pathfinderSight = !!st && st.textContent.includes('the valley you walked through');
    win.questPerks.pathfinder = false;
    win.game.goToChapter(21, 0);
    st = doc.getElementById('story-text');
    probe.pathfinderSightReset = !!st && !st.textContent.includes('the valley you walked through');
    win.game.flags.add('valleyWalk');
  }

  // Robustness: settings gear must be injected into the DOM itself (the old
  // probe called togglePanel directly, which masked a missing button).
  probe.settingsButton = !!doc.getElementById('settings-toggle');
  probe.settingsPanelOpens = false;
  if (probe.settingsButton) {
    try {
      doc.getElementById('settings-toggle').click();
      probe.settingsPanelOpens = !!win.settings && !win.settings.panel.classList.contains('hidden');
      win.settings.closePanel();
    } catch (e) {
      win._smokeTestErrors.push({ type: 'settings-crash', message: e.message, stack: e.stack });
    }
  }

  // Occlusion: fixed corner widgets must occupy distinct slots.
  probe.audioToggleSpacing = false;
  probe.ritualRaised = false;
  probe.studyGuideRaised = false;
  const audioMute = doc.getElementById('divine-audio-toggle');
  const audioAmbient = doc.getElementById('divine-ambient-toggle');
  const settingsGear = doc.getElementById('settings-toggle');
  probe.audioToggleSpacing = !!(audioMute && audioAmbient &&
    audioMute.style.right === '144px' && audioAmbient.style.right === '208px' &&
    settingsGear && settingsGear.style.right === '272px');
  const ritualBtn = doc.getElementById('ritual-button');
  if (ritualBtn) probe.ritualRaised = /bottom-32/.test(ritualBtn.className);
  const sgBtn = doc.getElementById('study-guide-btn');
  if (sgBtn) probe.studyGuideRaised = /bottom-44/.test(sgBtn.className);

  // Robustness: creed_match must render and solve (previously unhandled type);
  // solas_match must no longer crash on click (option.effect dereference).
  probe.puzzleCreedRenders = false;
  probe.puzzleCreedSolved = false;
  probe.puzzleSolasNoCrash = false;
  probe.puzzleSolasSolved = false;
  if (win.puzzleSystem && win.game) {
    const pOverlay = doc.getElementById('puzzle-overlay');
    if (pOverlay) pOverlay.remove();
    win.game.playerStats.wisdom = 50;
    const creed = win.puzzleSystem.puzzles.find(p => p.id === 'creed_match');
    if (creed) {
      try {
        win.puzzleSystem.currentPuzzle = creed;
        win.puzzleSystem.showPuzzle(creed);
        const po = doc.getElementById('puzzle-overlay');
        probe.puzzleCreedRenders = !!po && po.textContent.includes('Creed Match');
        const before = win.puzzleSystem.solvedPuzzles.length;
        win.puzzleSystem.submitAnswer(creed.options.findIndex(o => o.correct));
        probe.puzzleCreedSolved = win.puzzleSystem.solvedPuzzles.length > before;
        win.puzzleSystem.closePuzzle();
      } catch (e) {
        win._smokeTestErrors.push({ type: 'puzzle-creed-crash', message: e.message, stack: e.stack });
      }
    }
    const solas = win.puzzleSystem.puzzles.find(p => p.id === 'solas_match');
    if (solas) {
      try {
        win.puzzleSystem.currentPuzzle = solas;
        win.puzzleSystem.showPuzzle(solas);
        win.puzzleSystem.makeChoice(1);
        probe.puzzleSolasNoCrash = !!doc.getElementById('puzzle-overlay');
        const correct = solas.options.findIndex(o => o.correct);
        win.puzzleSystem.currentPuzzle = solas;
        win.puzzleSystem.makeChoice(correct);
        probe.puzzleSolasSolved = win.puzzleSystem.solvedPuzzles.includes('solas_match');
        win.puzzleSystem.closePuzzle();
      } catch (e) {
        win._smokeTestErrors.push({ type: 'puzzle-solas-crash', message: e.message, stack: e.stack });
      }
    }
  }

  // Robustness: endNightmare must only clear nightmare-scoped overlays, never
  // full-screen overlays owned by other systems (battle/puzzle/ritual).
  probe.nightmareScopedCleanup = false;
  if (win.nightmare) {
    try {
      const foreign = doc.createElement('div');
      foreign.className = 'fixed inset-0 z-50';
      foreign.id = 'foreign-overlay';
      doc.body.appendChild(foreign);
      const owned = doc.createElement('div');
      owned.className = 'fixed inset-0 z-50';
      owned.dataset.tdqNightmare = '1';
      owned.id = 'owned-overlay';
      doc.body.appendChild(owned);
      win.nightmare.endNightmare();
      probe.nightmareScopedCleanup = !!doc.getElementById('foreign-overlay') && !doc.getElementById('owned-overlay');
      foreign.remove();
    } catch (e) {
      win._smokeTestErrors.push({ type: 'nightmare-cleanup-crash', message: e.message, stack: e.stack });
    }
  }

  for (const [key, ok] of Object.entries(probe)) {
    if (!ok) {
      win._smokeTestErrors.push({ type: 'failed-probe', message: key });
    }
  }

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
