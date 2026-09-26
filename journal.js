// Pilgrim's Journal — logs every chapter first visited during the quest.
// Listens for the game's chapterChanged event and persists on this device.
window.PilgrimJournal = (function () {
    const KEY = 'tdq_journal';
    const BTN_ID = 'journal-btn';
    let modal = null;

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
        catch (e) { return []; }
    }

    function save(list) {
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
    }

    function chapters() {
        const c = (window.__TDQ_CONTENT && window.__TDQ_CONTENT.chapters) || [];
        return Array.isArray(c) ? c : [];
    }

    function chapterNumberFrom(event) {
        if (typeof event === 'number') return event;
        if (event && event.detail) {
            const d = event.detail;
            if (typeof d === 'number') return d;
            if (typeof d.chapter === 'number') return d.chapter;
        }
        return -1;
    }

    function record(index) {
        if (typeof index !== 'number' || index < 0) return;
        const list = load();
        if (list.some((e) => e.index === index)) return;
        const ch = chapters()[index];
        list.push({
            index: index,
            title: ch ? ch.title : 'Chapter ' + (index + 1),
            firstSeen: Date.now()
        });
        list.sort((a, b) => a.index - b.index);
        save(list);
        document.dispatchEvent(new CustomEvent('journalUpdated', { detail: { entries: list.length } }));
    }

    document.addEventListener('chapterChanged', (e) => {
        const n = chapterNumberFrom(e);
        if (n >= 0) record(n);
    });

    function open() {
        const list = load();
        const total = chapters().length;
        const progress = total ? Math.round((list.length / total) * 100) : 0;

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'journal-modal';
            modal.className = 'fixed inset-0 z-[55] overflow-y-auto';
            document.body.appendChild(modal);
        }

        const rows = list.length
            ? list.map((e, i) => `
                <li class="flex items-center gap-3 py-2 border-b border-white border-opacity-10">
                    <span class="w-8 h-8 rounded-full bg-amber-500 bg-opacity-20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">${i + 1}</span>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-amber-100 truncate">${e.title}</p>
                        <p class="text-xs text-gray-400">Chapter ${e.index + 1}${e.index + 1 === total ? ' · The Consummation' : ''}</p>
                    </div>
                    ${e.index + 1 === total ? '<span class="ml-auto text-xs text-yellow-300">🏁 Quest End</span>' : ''}
                </li>`).join('')
            : '<li class="text-gray-400 text-sm italic py-4">Your journal is empty. Begin the quest and the chapters you visit will be recorded here.</li>';

        modal.innerHTML = `
            <div class="absolute inset-0 bg-black bg-opacity-70" data-journal-close></div>
            <div class="relative min-h-full flex items-center justify-center p-4 pointer-events-none">
                <div class="pointer-events-auto w-full max-w-lg bg-gradient-to-br from-slate-900 to-indigo-950 border border-amber-500 border-opacity-30 rounded-2xl p-6 text-white shadow-2xl">
                    <div class="flex items-center justify-between mb-1">
                        <h2 class="cinzel text-2xl font-bold scripture-text">Pilgrim&#39;s Journal</h2>
                        <button class="text-3xl leading-none text-gray-400 hover:text-white" data-journal-close aria-label="Close">×</button>
                    </div>
                    <p class="text-xs text-amber-300 font-semibold mb-4">${list.length} of ${total} chapters visited · ${progress}%</p>
                    <div class="h-2 bg-white bg-opacity-10 rounded-full overflow-hidden mb-5">
                        <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" style="width:${progress}%"></div>
                    </div>
                    <ul class="list-none p-0 m-0 max-h-72 overflow-y-auto">${rows}</ul>
                    <p class="text-xs text-gray-500 mt-4 italic">Journal entries persist on this device. Reaching a chapter — by any path — records it here.</p>
                </div>
            </div>
        `;
        modal.querySelectorAll('[data-journal-close]').forEach((el) => el.addEventListener('click', close));
        document.dispatchEvent(new CustomEvent('journalOpened', { detail: { entries: list.length } }));
        return modal;
    }

    function close() {
        if (modal) modal.remove();
        modal = null;
    }

    function mountButton() {
        if (document.querySelector('#' + BTN_ID)) return;
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.className = 'fixed bottom-20 right-4 z-40 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm font-bold px-4 py-3 rounded-full shadow-xl border border-yellow-500 border-opacity-40 hover:scale-105 transition-transform';
        btn.innerHTML = '📕 <span class="hidden sm:inline">Journal</span>';
        btn.addEventListener('click', () => {
            if (document.getElementById('journal-modal')) close();
            else open();
        });
        document.body.appendChild(btn);
    }

    document.addEventListener('DOMContentLoaded', mountButton);

    return { open, close, record, load };
})();