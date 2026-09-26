// lint-content.mjs — validate the authored content packs before they ship.
// Checks schema, verse availability (vs content/verses.json), routing sanity,
// gift/fruit names, requirement gates, and full reachability from chapter 0.
//
// Run: node scripts/lint-content.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const GIFTS = ['faith', 'wisdom', 'knowledge', 'discernment', 'prophecy', 'teaching',
  'exhortation', 'service', 'mercy', 'giving', 'leadership', 'healing',
  'evangelism', 'worship', 'hope'];
const FRUITS = ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness',
  'faithfulness', 'gentleness', 'self-control'];
const ATTRS = ['faith', 'wisdom', 'compassion'];
const SPECIALS = ['portal_gold', 'portal_blue', 'portal_green', 'ending'];

const errors = [];
const warnings = [];
const push = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

function loadChapters() {
  const all = JSON.parse(readFileSync(join(ROOT, 'content', 'chapters.json'), 'utf8'));
  const chapters = [...(all.chapters || [])];
  const files = readdirSync(join(ROOT, 'content')).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) {
    if (f === 'chapters.json') continue;
    const parsed = JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8'));
    if (parsed && parsed.mergeInto === 'chapters') chapters.push(...(parsed.chapters || []));
  }
  return chapters;
}

function loadVerses() {
  try {
    const v = JSON.parse(readFileSync(join(ROOT, 'content', 'verses.json'), 'utf8'));
    return new Set((v.verses || []).map((x) => x.ref));
  } catch (e) {
    return new Set();
  }
}

function normalizeRef(ref) {
  return String(ref || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^Psalms /, 'Psalm ');
}

const chapters = loadChapters();
const verses = loadVerses();
const effectiveVerse = new Set();
const seenTitles = new Set();

if (chapters.length === 0) push('No chapters found.');
else {
  chapters.forEach((ch, ci) => {
    if (!ch.title) push(`ch ${ci}: missing title`);
    if (seenTitles.has(ch.title)) warn(`ch ${ci}: duplicate title "${ch.title}"`);
    seenTitles.add(ch.title);
    if (!ch.theme) warn(`ch ${ci}: missing theme`);
    if (!Array.isArray(ch.scenes) || ch.scenes.length === 0) {
      push(`ch ${ci} ("${ch.title}"): no scenes`);
      return;
    }
    if (ch.verse) effectiveVerse.add(normalizeRef(ch.verse));

    ch.scenes.forEach((scene, si) => {
      const at = `ch ${ci}/${si} ("${ch.title}")`;
      if (!scene.text || typeof scene.text !== 'string') push(`${at}: scene text missing`);
      if (!Array.isArray(scene.choices) || scene.choices.length < 2 || scene.choices.length > 4) {
        push(`${at}: expected 2-4 choices, got ${scene.choices && scene.choices.length}`);
      }
      if (scene.verse && !verses.has(normalizeRef(scene.verse))) {
        push(`${at}: scene verse "${scene.verse}" not in content/verses.json (run npm run verses)`);
        effectiveVerse.add(normalizeRef(scene.verse));
      }
      (scene.choices || []).forEach((c, k) => {
        const cAt = `ch ${ci}/${si} choice ${k} ("${c.text}")`;
        if (!c.text) push(`${cAt}: choice text missing`);
        if (!c.description) warn(`${cAt}: no description`);
        if (!c.effects || typeof c.effects !== 'object') push(`${cAt}: missing effects`);
        else {
          for (const a of ATTRS) {
            const v2 = c.effects[a];
            if (typeof v2 !== 'number' || v2 < 0 || v2 > 50) push(`${cAt}: effects.${a} = ${v2} (allow 0-50)`);
          }
        }
        if (typeof c.next !== 'number' || c.next < 0 || c.next >= chapters.length) {
          push(`${cAt}: next=${c.next} out of range 0..${chapters.length - 1}`);
        }
        if (c.gift && !GIFTS.includes(c.gift)) push(`${cAt}: unknown gift "${c.gift}"`);
        if (c.fruit && !FRUITS.includes(c.fruit)) push(`${cAt}: unknown fruit "${c.fruit}"`);
        if (c.gift && !c.fruit) warn(`${cAt}: has gift but no fruit`);
        if (c.memoryVerse) {
          if (!verses.has(normalizeRef(c.memoryVerse))) {
            push(`${cAt}: memoryVerse "${c.memoryVerse}" not in content/verses.json (run npm run verses)`);
          }
        }
        if (c.requirement) {
          if (!ATTRS.includes(c.requirement.attribute)) push(`${cAt}: bad requirement attribute`);
          if (!Number.isFinite(c.requirement.min) || c.requirement.min < 1 || c.requirement.min > 100) {
            push(`${cAt}: bad requirement min`);
          }
        }
        if (c.special && !SPECIALS.includes(c.special)) push(`${cAt}: unknown special "${c.special}"`);
        if (c.flags !== undefined && !Array.isArray(c.flags)) push(`${cAt}: flags must be an array`);
      });
    });
  });

  // Routing: every chapter target resolves and is reachable from chapter 0.
  const seen = new Set();
  const stack = [0];
  seen.add(0);
  while (stack.length) {
    const ci = stack.pop();
    const ch = chapters[ci];
    if (!ch) continue;
    for (const scene of ch.scenes || []) {
      for (const c of scene.choices || []) {
        if (typeof c.next === 'number' && !seen.has(c.next)) {
          if (c.next >= 0 && c.next < chapters.length) { seen.add(c.next); stack.push(c.next); }
        }
      }
    }
  }
  const unreachable = chapters.map((_, i) => i).filter((i) => !seen.has(i));
  if (unreachable.length) {
    push(`Unreachable chapters from 0: ${unreachable.join(', ')}`);
  }
}

// Verse integrity: base verse set exists in the WEB registry output.
const missingBase = [];
for (const r of effectiveVerse) if (!verses.has(r)) missingBase.push(r);
if (missingBase.length) {
  push(`Chapter theme verses not in verses.json: ${[...new Set(missingBase)].join(', ')}`);
}

console.log(`lint: ${chapters.length} chapters, ${verses.size} verses loaded`);
if (warnings.length) console.log(`  warnings (${warnings.length}):\n  - ${warnings.join('\n  - ')}`);
if (errors.length) {
  console.log(`  FAIL (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log('  PASS');