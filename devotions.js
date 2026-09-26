// Devotion Center — daily devotional + memory-verse review.
// Reads the devotionals content pack (window.__TDQ_CONTENT.packs.devotionals)
// and Word-based verses via window.VerseSystem; tracks a check-in streak.
window.DevotionCenter = (function () {
    const STREAK_KEY = 'tdq_devotion';
    let modal = null;

    function packs() {
        return (window.__TDQ_CONTENT && window.__TDQ_CONTENT.packs) || {};
    }

    function devotionals() {
        const d = packs().devotionals;
        return (d && Array.isArray(d.devotionals) ? d.devotionals : []);
    }

    function dateStamp(d) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    // Deterministic daily pick rotating through the devotionals pack.
    function verseOfDay(now) {
        now = now || new Date();
        const pool = devotionals();
        if (!pool.length) return null;
        const ordinal = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
        const entry = pool[ordinal % pool.length];
        const verse = window.VerseSystem ? window.VerseSystem.lookup(entry.ref) : null;
        return {
            ref: entry.ref,
            title: entry.title || null,
            reflection: entry.reflection || '',
            text: verse ? verse.text : null
        };
    }

    function readStreak() {
        try {
            return JSON.parse(localStorage.getItem(STREAK_KEY) || 'null');
        } catch (e) { return null; }
    }

    // Check in for today; returns the current streak after the visit.
    function checkIn(now) {
        now = now || new Date();
        const today = dateStamp(now);
        const prev = readStreak();
        let streak = 1;
        if (prev && prev.last === today) {
            streak = prev.streak;
        } else if (prev && prev.last === dateStamp(new Date(now.getTime() - 86400000))) {
            streak = prev.streak + 1;
        }
        try { localStorage.setItem(STREAK_KEY, JSON.stringify({ last: today, streak })); } catch (e) { /* ignore */ }
        return streak;
    }

    function open() {
        const streak = checkIn();
        const daily = verseOfDay();
        const verses = window.VerseSystem ? window.VerseSystem.memoryVerses() : [];
        const today = dateStamp(new Date());

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'devotion-modal';
            modal.className = 'fixed inset-0 z-[55] overflow-y-auto';
            document.body.appendChild(modal);
        }

        const dailyCard = daily
            ? `<div class="bg-black bg-opacity-40 border border-yellow-500 border-opacity-30 rounded-2xl p-6 mb-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-amber-300 uppercase tracking-widest">Daily Devotion · ${today}</span>
                    <span class="text-xs text-yellow-300 font-semibold" title="Consecutive days">🔥 ${streak} day${streak === 1 ? '' : 's'}</span>
                </div>
                ${daily.title ? `<h3 class="cinzel text-xl font-bold scripture-text mb-1">${daily.title}</h3>` : ''}
                <p class="text-sm text-indigo-300 font-semibold mb-3">${daily.ref}</p>
                ${daily.text ? `<p class="italic text-indigo-100 leading-relaxed mb-4">"${daily.text}"</p>` : ''}
                ${daily.reflection ? `<p class="text-sm text-gray-200 leading-relaxed">${daily.reflection}</p>` : ''}
            </div>`
            : '<div class="text-gray-400 mb-6">No devotionals available yet.</div>';

        const review = verses.length
            ? `<div class="bg-black bg-opacity-40 border border-indigo-500 border-opacity-20 rounded-2xl p-6">
                <h3 class="cinzel font-bold text-amber-300 mb-3">🗝️ Memory Verses <span class="text-xs text-gray-400 font-normal">(${verses.length} unlocked)</span></h3>
                <div class="space-y-3">
                    ${verses.map((v) => `
                        <div class="border-l-4 border-indigo-500 pl-3">
                            <p class="text-sm italic text-gray-200">"${v.text}"</p>
                            <p class="text-xs text-indigo-300 mt-1 font-semibold">${v.ref}</p>
                        </div>`).join('')}
                </div>
            </div>`
            : '<div class="text-gray-400 text-sm italic">Choose a path that teaches a memory verse (look for the 🗝️) to begin your review shelf.</div>';

        modal.innerHTML = `
            <div class="absolute inset-0 bg-black bg-opacity-70" data-devotion-close></div>
            <div class="relative min-h-full flex items-center justify-center p-4 pointer-events-none">
                <div class="pointer-events-auto w-full max-w-2xl bg-gradient-to-br from-indigo-900 to-purple-950 border border-indigo-500 border-opacity-30 rounded-2xl p-6 text-white shadow-2xl">
                    <div class="flex items-center justify-between mb-5">
                        <h2 class="cinzel text-2xl font-bold scripture-text">Devotion & Review</h2>
                        <button class="text-3xl leading-none text-gray-400 hover:text-white" data-devotion-close aria-label="Close">×</button>
                    </div>
                    ${dailyCard}
                    ${review}
                </div>
            </div>
        `;
        modal.querySelectorAll('[data-devotion-close]').forEach((el) => el.addEventListener('click', close));
        document.dispatchEvent(new CustomEvent('devotionOpened', { detail: { streak, ref: daily ? daily.ref : null } }));
        return modal;
    }

    function close() {
        if (modal) modal.remove();
        modal = null;
    }

    // Floating launcher button.
    function mountButton() {
        if (document.querySelector('#devotions-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'devotions-btn';
        btn.className = 'fixed bottom-4 right-4 z-40 bg-gradient-to-r from-indigo-700 to-purple-800 text-white text-sm font-bold px-4 py-3 rounded-full shadow-xl border border-yellow-500 border-opacity-40 hover:scale-105 transition-transform';
        btn.innerHTML = '📖 <span class="hidden sm:inline">Devotion & Memory</span>';
        btn.addEventListener('click', () => {
            if (document.getElementById('devotion-modal')) close();
            else open();
        });
        document.body.appendChild(btn);
    }

    document.addEventListener('DOMContentLoaded', mountButton);

    return { open, close, verseOfDay, checkIn, readStreak };
})();