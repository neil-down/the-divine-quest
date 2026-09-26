// GiftSystem — spiritual gifts (1 Cor 12:4-11, 28; Rom 12:6-8) and the fruit
// of the Spirit (Gal 5:22-23) tracked as the player walks the quest.
// Advances are driven by choice.gift / choice.fruit in the content packs.
window.GiftSystem = (function () {
    const GIFTS = ['faith', 'wisdom', 'knowledge', 'discernment', 'prophecy',
        'teaching', 'exhortation', 'service', 'mercy', 'giving', 'leadership',
        'healing', 'evangelism', 'worship', 'hope'];
    const FRUITS = ['love', 'joy', 'peace', 'patience', 'kindness', 'goodness',
        'faithfulness', 'gentleness', 'self-control'];

    const KEY = 'tdq_gifts';
    let state = load();

    function load() {
        try {
            const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (raw && raw.gifts && raw.fruits) return raw;
        } catch (e) { /* fall through */ }
        const gifts = Object.create(null), fruits = Object.create(null);
        GIFTS.forEach((g) => { gifts[g] = 0; });
        FRUITS.forEach((f) => { fruits[f] = 0; });
        return { gifts, fruits };
    }

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }

    function advance(kind, name, amount) {
        const map = kind === 'fruit' ? state.fruits : state.gifts;
        if (name && Object.prototype.hasOwnProperty.call(map, name)) {
            map[name] = (map[name] || 0) + amount;
            save();
            document.dispatchEvent(new CustomEvent('giftsChanged', { detail: { kind, name, amount } }));
            return map[name];
        }
        return null;
    }

    function summary() {
        return {
            gifts: Object.assign({}, state.gifts),
            fruits: Object.assign({}, state.fruits)
        };
    }

    function giftList() { return GIFTS.slice(); }
    function fruitList() { return FRUITS.slice(); }

    function reset() {
        GIFTS.forEach((g) => { state.gifts[g] = 0; });
        FRUITS.forEach((f) => { state.fruits[f] = 0; });
        save();
        document.dispatchEvent(new CustomEvent('giftsChanged', { detail: { reset: true } }));
    }

    // Refresh any HUD elements rendered from GiftSystem's latest state.
    function refresh() {
        const s = summary();
        document.querySelectorAll('[data-gift-bar]').forEach((el) => {
            const g = el.getAttribute('data-gift-bar');
            const val = s.gifts[g] != null ? s.gifts[g] : 0;
            el.style.width = `${Math.min(100, val * 20)}%`;
            const span = document.querySelector(`[data-gift-val="${g}"]`);
            if (span) span.textContent = val;
        });
        document.querySelectorAll('[data-fruit-bar]').forEach((el) => {
            const f = el.getAttribute('data-fruit-bar');
            const val = s.fruits[f] != null ? s.fruits[f] : 0;
            el.style.width = `${Math.min(100, val * 20)}%`;
            const span = document.querySelector(`[data-fruit-val="${f}"]`);
            if (span) span.textContent = val;
        });
        const unlockedGifts = Object.keys(s.gifts).filter((g) => s.gifts[g] > 0);
        const unlockedFruits = Object.keys(s.fruits).filter((f) => s.fruits[f] > 0);
        document.querySelectorAll('[data-gift-count]').forEach((el) => { el.textContent = unlockedGifts.length; });
        document.querySelectorAll('[data-fruit-count]').forEach((el) => { el.textContent = unlockedFruits.length; });
    }

    return {
        advancedGift: (name, amount = 1) => advance('gift', name, amount),
        advancedFruit: (name, amount = 1) => advance('fruit', name, amount),
        advance: (name, amount = 1) => advance('gift', name, amount),
        gift: (name, amount = 1) => advance('gift', name, amount),
        fruit: (name, amount = 1) => advance('fruit', name, amount),
        summary,
        giftList,
        fruitList,
        reset,
        refresh,
        inFruit: (name) => Object.prototype.hasOwnProperty.call(state.fruits, name)
    };
})();