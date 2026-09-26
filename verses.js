// DivineVerses — World English Bible verse database + memory-verse tracker.
// Reads the content-pack verse registry (public-domain WEB text) exposed by
// window.__TDQ_CONTENT; persists unlocked memory verses in localStorage.
class DivineVerses {
    constructor() {
        this._memKey = 'tdq_memory_verses';
        const packs = (window.__TDQ_CONTENT && window.__TDQ_CONTENT.packs) || {};
        const verses = (packs.verses && packs.verses.verses) || [];
        this._repo = Object.create(null);
        for (const v of verses) this._repo[this.normalize(v.ref)] = v;
        this._unlocked = new Set(this._load());
    }

    normalize(ref) {
        if (typeof ref !== 'string') return '';
        const canonical = {
            '1 john': '1 John', '2 john': '2 John', '3 john': '3 John',
            '1 peter': '1 Peter', '2 peter': '2 Peter',
            '1 corinthians': '1 Corinthians', '2 corinthians': '2 Corinthians',
            '1 thessalonians': '1 Thessalonians', '2 thessalonians': '2 Thessalonians',
            '1 timothy': '1 Timothy', '2 timothy': '2 Timothy',
            '1 samuel': '1 Samuel', '2 samuel': '2 Samuel',
            '1 kings': '1 Kings', '2 kings': '2 Kings',
            '1 chronicles': '1 Chronicles', '2 chronicles': '2 Chronicles',
            'song of solomon': 'Song of Solomon', 'psalm': 'Psalm', 'psalms': 'Psalm'
        };
        const words = ref.trim().replace(/\s+/g, ' ').split(' ');
        if (canonical[ref.trim().toLowerCase()]) return canonical[ref.trim().toLowerCase()];
        if (words.length >= 2 && canonical[words.slice(0, 2).join(' ').toLowerCase()]) {
            return canonical[words.slice(0, 2).join(' ').toLowerCase().replace(/^i /, '1 ')] + ' ' + words.slice(2).join(' ');
        }
        return ref.trim();
    }

    lookup(ref) {
        return this._repo[this.normalize(ref)] || null;
    }

    has(ref) {
        return !!this.lookup(ref);
    }

    unlock(ref) {
        const verse = this.lookup(ref);
        if (!verse) return null;
        if (!this._unlocked.has(this.normalize(verse.ref))) {
            this._unlocked.add(this.normalize(verse.ref));
            this._save();
            document.dispatchEvent(new CustomEvent('memoryVerseUnlocked', { detail: { verse } }));
        }
        return verse;
    }

    isUnlocked(ref) {
        return this._unlocked.has(this.normalize(ref));
    }

    memoryVerses() {
        return Array.from(this._unlocked)
            .map((r) => this._repo[r])
            .filter(Boolean)
            .sort((a, b) => (a.ref < b.ref ? -1 : 1));
    }

    _load() {
        try { return JSON.parse(localStorage.getItem(this._memKey) || '[]'); } catch (e) { return []; }
    }

    _save() {
        try { localStorage.setItem(this._memKey, JSON.stringify(Array.from(this._unlocked))); } catch (e) { /* ignore */ }
    }
}

window.VerseSystem = new DivineVerses();