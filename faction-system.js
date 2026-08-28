// Faction / Ally System for The Divine Quest
// Tracks standing with 3 spiritual factions and exposes a small UI panel.

class FactionSystem {
    constructor(game) {
        this.game = game;
        this.factions = {
            'The Faithful': {
                standing: 50,
                min: 0,
                max: 100,
                color: 'blue',
                icon: 'fa-pray'
            },
            'The Doubting': {
                standing: 20,
                min: 0,
                max: 100,
                color: 'gray',
                icon: 'fa-question-circle'
            },
            'The World': {
                standing: 30,
                min: 0,
                max: 100,
                color: 'red',
                icon: 'fa-globe'
            }
        };
        this.panel = null;
    }

    init() {
        this.createPanel();
        this.wireIntoGame();
        this.render();
    }

    // ---------- Faction logic ----------
    adjust(name, delta) {
        const f = this.factions[name];
        if (!f) return;
        f.standing = Math.min(f.max, Math.max(f.min, f.standing + delta));
        this.render();
        document.dispatchEvent(new CustomEvent('factionChanged', { detail: { name, standing: f.standing } }));
    }

    get(name) {
        return this.factions[name] ? { ...this.factions[name] } : null;
    }

    // Minimal hook: override makeChoice to apply standing changes.
    wireIntoGame() {
        const self = this;
        const original = this.game.makeChoice.bind(this.game);
        this.game.makeChoice = function (choiceIndex) {
            const effect = self._choiceFactionEffect(choiceIndex);
            Object.entries(effect).forEach(([name, delta]) => self.adjust(name, delta));
            return original(choiceIndex);
        };
    }

    _choiceFactionEffect(choiceIndex) {
        const chapter = this.game.storyChapters[this.game.currentChapter];
        const scene = chapter.scenes[this.game.currentScene];
        const choice = scene.choices[choiceIndex];
        const text = choice.text.toLowerCase();
        const effects = choice.effects || {};

        const result = { 'The Faithful': 0, 'The Doubting': 0, 'The World': 0 };

        // Heuristic mapping from choice text to factions
        if (/devotion|prayer|faith|worship|gospel|christ|scripture|truth|righteousness/.test(text)) {
            result['The Faithful'] += 3;
            result['The Doubting'] -= 2;
        }
        if (/study|scholarship|wisdom|question|doubt|honest|silence|library|doctrine|reformed/.test(text)) {
            result['The Doubting'] += 3;
            result['The Faithful'] -= 1;
        }
        if (/service|compassion|care|world|mission|field|fellowship|serve|generosity/.test(text)) {
            result['The World'] += 3;
            result['The Faithful'] += 1;
            result['The Doubting'] -= 1;
        }

        // Fallback: infer from stat deltas
        if (result['The Faithful'] === 0 && result['The Doubting'] === 0 && result['The World'] === 0) {
            const faith = effects.faith || 0;
            const wisdom = effects.wisdom || 0;
            const compassion = effects.compassion || 0;
            if (faith >= compassion && faith >= wisdom) result['The Faithful'] += 2;
            if (wisdom >= faith && wisdom >= compassion) result['The Doubting'] += 2;
            if (compassion >= faith && compassion >= wisdom) result['The World'] += 2;
        }

        // Clamp small drift to at least 1 if any faction is touched
        Object.keys(result).forEach(k => {
            if (result[k] === 0 && Math.random() < 0.25) result[k] = 1;
        });

        return result;
    }

    // ---------- UI ----------
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'faction-panel';
        this.panel.className =
            'fixed bottom-4 left-4 bg-black bg-opacity-75 backdrop-filter backdrop-blur-lg border border-yellow-500 border-opacity-30 rounded-xl p-4 z-40 text-white shadow-lg';
        this.panel.style.maxWidth = '280px';
        document.body.appendChild(this.panel);
    }

    render() {
        if (!this.panel) return;
        const entries = Object.entries(this.factions).map(([name, data]) => {
            const pct = data.standing;
            const barColor =
                data.color === 'blue'
                    ? 'bg-blue-500'
                    : data.color === 'gray'
                    ? 'bg-gray-400'
                    : 'bg-red-500';
            return `
                <div class="mb-2">
                    <div class="flex items-center justify-between text-xs mb-1">
                        <span><i class="fas ${data.icon} text-${data.color}-400 mr-1"></i>${name}</span>
                        <span>${pct}</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2">
                        <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        this.panel.innerHTML = `
            <h4 class="cinzel text-sm font-bold text-yellow-400 mb-2">Faction Standing</h4>
            ${entries}
            <p class="text-[10px] text-gray-400 mt-2 italic">Your choices shift the hearts of factions...</p>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.factionSystem = new FactionSystem(window.game);
            window.factionSystem.init();
        }
    }, 2000);
});
