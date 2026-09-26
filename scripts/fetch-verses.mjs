// fetch-verses.mjs — build content/verses.json with exact World English Bible text.
// Sources refs from content/chapters.json (scene.verse + choice.memoryVerse) plus a
// curated base list. Fetches the (public-domain) WEB text from the getbible API v2
// (https://api.getbible.net/), caching per book+chapter under scripts/.cache/web/.
//
// Run: node scripts/fetch-verses.mjs

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(ROOT, 'scripts', '.cache', 'web');
mkdirSync(CACHE, { recursive: true });

const BOOKS = {
  'genesis': 1, 'exodus': 2, 'leviticus': 3, 'numbers': 4, 'deuteronomy': 5,
  'joshua': 6, 'judges': 7, 'ruth': 8, '1 samuel': 9, '2 samuel': 10,
  '1 kings': 11, '2 kings': 12, '1 chronicles': 13, '2 chronicles': 14,
  'ezra': 15, 'nehemiah': 16, 'esther': 17, 'job': 18, 'psalms': 19, 'psalm': 19,
  'proverbs': 20, 'ecclesiastes': 21, 'song of solomon': 22,
  'isaiah': 23, 'jeremiah': 24, 'lamentations': 25, 'ezekiel': 26, 'daniel': 27,
  'hosea': 28, 'joel': 29, 'amos': 30, 'obadiah': 31, 'jonah': 32, 'micah': 33,
  'nahum': 34, 'habakkuk': 35, 'zephaniah': 36, 'haggai': 37, 'zekariah': 38,
  'zechariah': 38, 'malachi': 39,
  'matthew': 40, 'mark': 41, 'luke': 42, 'john': 43, 'acts': 44, 'romans': 45,
  '1 corinthians': 46, '2 corinthians': 47, 'galatians': 48, 'ephesians': 49,
  'philippians': 50, 'colossians': 51, '1 thessalonians': 52, '2 thessalonians': 53,
  '1 timothy': 54, '2 timothy': 55, 'titus': 56, 'philemon': 57, 'hebrews': 58,
  'james': 59, '1 peter': 60, '2 peter': 61, '1 john': 62, '2 john': 63,
  '3 john': 64, 'jude': 65, 'revelation': 66, 'revelations': 66
};

// Verse references that anchor the base scripture panel + wisdom quotes.
const BASE_REFS = [
  'Ephesians 2:8', '2 Timothy 3:16', 'Hebrews 13:8', 'John 3:16', 'John 14:6',
  'Romans 3:23', 'Romans 5:8', '1 John 1:9', 'Romans 6:23', '2 Corinthians 5:17',
  'Proverbs 9:10', 'Proverbs 3:5', 'Psalm 119:105', 'Matthew 22:39', 'Psalm 46:10',
  'James 5:16', 'Romans 12:2', '2 Timothy 1:7', '1 Corinthians 15:3-4', 'John 4:13-14'
];

function parseRef(ref) {
  const trimmed = ref.trim();
  const colIdx = trimmed.lastIndexOf(':');

  if (colIdx === -1) {
    // "Jude 3" -> book = "Jude", chapter 1, verse 3
    const bm = trimmed.match(/^(.*?)\s+(\d+)$/);
    if (!bm) throw new Error('Unparseable ref: ' + ref);
    const num = BOOKS[bm[1].toLowerCase()];
    if (!num) throw new Error('Unknown book in ref: ' + ref);
    return { book: bm[1], num, chapter: 1, start: Number(bm[2]), end: Number(bm[2]) };
  }

  const verseToken = trimmed.slice(colIdx + 1);
  const vm = verseToken.match(/^(\d+)(?:-(\d+))?$/);
  if (!vm) throw new Error('Unparseable ref: ' + ref);

  const beforeColon = trimmed.slice(0, colIdx); // e.g. "Ephesians 2"
  const bm = beforeColon.match(/^(.*?)\s+(\d+)$/);
  if (!bm) throw new Error('Unparseable ref: ' + ref);
  const num = BOOKS[bm[1].toLowerCase()];
  if (!num) throw new Error('Unknown book in ref: ' + ref);
  return {
    book: bm[1],
    num,
    chapter: Number(bm[2]),
    start: Number(vm[1]),
    end: Number(vm[2] || vm[1])
  };
}

async function fetchChapter(num, chapter) {
  const cacheFile = join(CACHE, `${num}-${chapter}.json`);
  if (existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, 'utf8'));
  }
  const url = `https://api.getbible.net/v2/web/${num}/${chapter}.json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'the-divine-quest-content-builder' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const json = await res.json();
  writeFileSync(cacheFile, JSON.stringify(json), 'utf8');
  return json;
}

async function build() {
  const chapters = JSON.parse(readFileSync(join(ROOT, 'content', 'chapters.json'), 'utf8'));

  // Multipart packs (mergeInto chapters) also contribute their verse refs.
  const mergedChapters = [...(chapters.chapters || [])];
  const merges = readdirSync(join(ROOT, 'content')).filter((f) => f.endsWith('.json')).sort();
  for (const f of merges) {
    if (f === 'chapters.json') continue;
    const parsed = JSON.parse(readFileSync(join(ROOT, 'content', f), 'utf8'));
    if (parsed && parsed.mergeInto === 'chapters') mergedChapters.push(...(parsed.chapters || []));
  }

  const want = new Set(BASE_REFS);
  for (const ch of mergedChapters || []) {
    if (ch.verse) want.add(ch.verse);
    for (const scene of ch.scenes || []) {
      if (scene.verse) want.add(scene.verse);
      for (const c of scene.choices || []) {
        if (c.memoryVerse) want.add(c.memoryVerse);
      }
    }
  }

  const byRef = new Map();
  const fetched = new Map(); // `${num}:${chapter}` -> chapter json

  for (const ref of want) {
    if (byRef.has(ref)) continue;
    const p = parseRef(ref);
    const cacheKey = `${p.num}:${p.chapter}`;
    if (!fetched.has(cacheKey)) fetched.set(cacheKey, await fetchChapter(p.num, p.chapter));
    const chapterJson = fetched.get(cacheKey);
    const verses = chapterJson.verses || [];

    if (p.start === p.end) {
      const v = verses.find((x) => x.verse === p.start);
      if (!v) throw new Error(`Verse not found: ${ref}`);
      byRef.set(ref, { ref, book: p.book, chapter: p.chapter, verse: p.start, text: String(v.text).trim() });
    } else {
      for (let vn = p.start; vn <= p.end; vn++) {
        const v = verses.find((x) => x.verse === vn);
        if (!v) throw new Error(`Verse not found in range: ${ref} (${vn})`);
      }
    }
  }

  const out = [];
  for (const v of byRef.values()) out.push(v);

  // Rebuild single-verse entries inside ranges with their own verse text.
  const bySingle = new Map();
  for (const ref of want) {
    const p = parseRef(ref);
    if (p.start !== p.end) {
      const cacheKey = `${p.num}:${p.chapter}`;
      const chapterJson = fetched.get(cacheKey);
      for (let vn = p.start; vn <= p.end; vn++) {
        const item = chapterJson.verses.find((x) => x.verse === vn);
        if (item) {
          const singleRef = `${p.book} ${p.chapter}:${vn}`;
          bySingle.set(singleRef, { ref: singleRef, book: p.book, chapter: p.chapter, verse: vn, text: String(item.text).trim() });
        }
      }
    }
  }

  const final = [];
  const seen = new Set();
  for (const v of out) {
    let entry = v;
    if (bySingle.has(v.ref)) entry = bySingle.get(v.ref);
    if (!seen.has(entry.ref)) { final.push(entry); seen.add(entry.ref); }
  }
  // Ensure all ranges also present as exact range refs.
  for (const ref of want) {
    if (!seen.has(ref)) {
      const p = parseRef(ref);
      if (p.start !== p.end) {
        const texts = [];
        for (let vn = p.start; vn <= p.end; vn++) {
          const k = `${p.num}:${p.chapter}`;
          const item = (fetched.get(k) || { verses: [] }).verses.find((x) => x.verse === vn);
          if (item) texts.push(String(item.text).trim());
        }
        if (texts.length) {
          final.push({ ref, book: p.book, chapter: p.chapter, verse: p.start, text: texts.join(' ') });
          seen.add(ref);
        }
      }
    }
  }

  final.sort((a, b) =>
    (BOOKS[a.book.toLowerCase()] || 0) - (BOOKS[b.book.toLowerCase()] || 0) ||
    a.chapter - b.chapter ||
    a.verse - b.verse
  );

  const payload = { version: 1, verses: final };
  const target = join(ROOT, 'content', 'verses.json');
  writeFileSync(target, JSON.stringify(payload, null, 2), 'utf8');
  const finalRefs = new Set(final.map((f) => f.ref));
  const missing = [...want].filter((r) => !finalRefs.has(r));
  console.log(`Wrote ${final.length} verses -> content/verses.json`);
  if (missing.length) {
    console.warn(`Missing refs (${missing.length}): ${missing.join(', ')}`);
    process.exitCode = 1;
  }
}

build().catch((e) => { console.error(e); process.exit(1); });