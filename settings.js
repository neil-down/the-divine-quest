/**
 * Settings — save-slot-aware preferences for The Divine Quest.
 *
 * Features:
 *  - Volume slider (master volume)
 *  - Text-speed selector (slow / normal / fast) via CSS class + window.SETTINGS
 *  - Reduced-motion toggle (adds `reduced-motion` class to body)
 *  - Mute toggle
 *  - All values persisted in localStorage under a slot-scoped key
 *  - Fixed ⚙️ button + panel injected on DOMContentLoaded
 *  - Close via button / Escape key
 */
class Settings {
  constructor(slotName) {
    this.slotName = slotName || this._detectSlot() || 'default';
    this.prefix = `divineQuestSettings_${this.slotName}`;

    this.defaults = {
      volume: 0.35,
      textSpeed: 'normal',
      reducedMotion: false,
      mute: false
    };

    this.settings = this._load();
    this._applyReducedMotion();
    this._applyTextSpeed();
    this._syncAudio();

    this.panel = null;
    this.button = null;
  }

  /* ------------------------------------------------------------------ slot awareness */
  _detectSlot() {
    try {
      if (localStorage.getItem('divineQuestSave')) {
        return 'divineQuestSave';
      }
    } catch (e) {}
    return 'default';
  }

  /* ------------------------------------------------------------------ persistence */
  _key(k) { return `${this.prefix}_${k}`; }

  _load() {
    try {
      const raw = localStorage.getItem(this.prefix);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.defaults, ...parsed };
      }
    } catch (e) { /* ignore corrupt data */ }
    return { ...this.defaults };
  }

  _save() {
    try {
      localStorage.setItem(this.prefix, JSON.stringify(this.settings));
    } catch (e) { /* storage full or unavailable */ }
  }

  /* ------------------------------------------------------------------ live apply */
  _applyReducedMotion() {
    if (this.settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  _applyTextSpeed() {
    document.body.classList.remove('text-speed-slow', 'text-speed-normal', 'text-speed-fast');
    document.body.classList.add(`text-speed-${this.settings.textSpeed}`);
    window.SETTINGS = window.SETTINGS || {};
    window.SETTINGS.textSpeed = this.settings.textSpeed;
  }

  _syncAudio() {
    const audio = window.divineAudio;
    if (!audio) return;
    try {
      if (typeof audio.setMasterVolume === 'function') {
        audio.setMasterVolume(this.settings.mute ? 0 : this.settings.volume);
      }
      if (typeof audio.setMute === 'function') {
        audio.setMute(this.settings.mute);
      }
    } catch (e) { /* ignore */ }
  }

  /* ------------------------------------------------------------------ mutators */
  setVolume(v) {
    this.settings.volume = Math.max(0, Math.min(1, Number(v) || 0));
    this._save();
    this._syncAudio();
  }

  setTextSpeed(speed) {
    if (!['slow', 'normal', 'fast'].includes(speed)) speed = 'normal';
    this.settings.textSpeed = speed;
    this._save();
    this._applyTextSpeed();
  }

  setReducedMotion(enabled) {
    this.settings.reducedMotion = Boolean(enabled);
    this._save();
    this._applyReducedMotion();
  }

  setMute(muted) {
    this.settings.mute = Boolean(muted);
    this._save();
    this._syncAudio();
  }

  /* ------------------------------------------------------------------ UI injection */
  injectUI() {
    if (this.button && this.panel) return; // already injected

    this.button = document.createElement('button');
    this.button.textContent = '⚙️ Settings';
    this.button.setAttribute('aria-label', 'Open settings');
    this.button.title = 'Settings';
    Object.assign(this.button.style, {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: '9999',
      background: 'rgba(0,0,0,0.55)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      padding: '10px 14px',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      fontSize: '16px',
      lineHeight: '1',
      userSelect: 'none'
    });
    this.button.addEventListener('click', () => this.togglePanel());
    document.body.appendChild(this.button);

    this.panel = document.createElement('div');
    this.panel.className = 'fixed inset-0 z-50 hidden';
    this.panel.innerHTML = `
      <div class="absolute inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm" data-close="true"></div>
      <div class="relative flex items-center justify-center min-h-screen p-4">
        <div class="w-full max-w-md bg-gray-900 border border-yellow-500 border-opacity-40 rounded-xl shadow-2xl p-6 text-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h2 class="cinzel text-xl font-bold text-yellow-400">Settings</h2>
            <button data-close="true" class="text-gray-400 hover:text-white text-2xl leading-none" aria-label="Close">&times;</button>
          </div>

          <div class="space-y-5">
            <!-- Language -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-300" id="settings-language-label">__LANG_LABEL__</label>
              <div id="settings-lang-buttons" class="flex flex-wrap gap-2"></div>
            </div>

            <!-- Volume -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-300">Master Volume</label>
              <input type="range" id="settings-volume" min="0" max="1" step="0.01" value="${this.settings.volume}" class="w-full" />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span><span id="settings-volume-val">${Math.round(this.settings.volume * 100)}%</span><span>100%</span>
              </div>
            </div>

            <!-- Text Speed -->
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-300">Text Speed</label>
              <select id="settings-text-speed" class="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100">
                <option value="slow">Slow</option>
                <option value="normal" ${this.settings.textSpeed === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <!-- Reduced Motion -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-300">Reduced Motion</label>
              <button id="settings-reduced-motion" role="switch" aria-checked="${this.settings.reducedMotion}" class="relative inline-flex h-6 w-11 items-center rounded-full border border-gray-600 bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <span class="inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${this.settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'}"></span>
              </button>
            </div>

            <!-- Mute -->
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-300">Mute Audio</label>
              <button id="settings-mute" role="switch" aria-checked="${this.settings.mute}" class="relative inline-flex h-6 w-11 items-center rounded-full border border-gray-600 bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <span class="inline-block h-4 w-4 rounded-full bg-white transform transition-transform ${this.settings.mute ? 'translate-x-6' : 'translate-x-1'}"></span>
              </button>
            </div>

            <!-- Slot indicator -->
            <div class="pt-4 border-t border-gray-700">
              <p class="text-xs text-gray-500">Save Slot: <span class="text-gray-300 font-mono">${this.slotName}</span></p>
            </div>
          </div>
        </div>
      </div>
    `;

    this.panel.addEventListener('click', (e) => {
      if (e.target.matches('[data-close="true"]')) this.closePanel();
    });

    this._bindControls();
    document.body.appendChild(this.panel);
  }

  _bindControls() {
    const volume = this.panel.querySelector('#settings-volume');
    const volumeVal = this.panel.querySelector('#settings-volume-val');
    if (volume) {
      volume.addEventListener('input', () => {
        const v = parseFloat(volume.value);
        this.setVolume(v);
        if (volumeVal) volumeVal.textContent = `${Math.round(v * 100)}%`;
      });
    }

    // Build language selector buttons
    const langWrap = this.panel.querySelector('#settings-lang-buttons');
    if (langWrap) {
      const I18N = window.I18N;
      langWrap.innerHTML = '';
      if (I18N) {
        const langs = Object.keys(I18N.strings);
        langs.forEach((code) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('data-lang', code);
          b.textContent = I18N.langNames[code] || code;
          b.className = 'px-3 py-2 rounded border text-sm font-semibold transition-colors ' +
            (code === I18N.lang
              ? 'border-yellow-500 bg-yellow-500 text-black'
              : 'border-gray-600 bg-gray-800 text-gray-100 hover:border-yellow-400');
          b.addEventListener('click', () => {
            I18N.setLanguage(code);
            const all = langWrap.querySelectorAll('button[data-lang]');
            all.forEach((x) => {
              const on = x.getAttribute('data-lang') === code;
              x.className = 'px-3 py-2 rounded border text-sm font-semibold transition-colors ' +
                (on ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-gray-600 bg-gray-800 text-gray-100 hover:border-yellow-400');
            });
            b.blur();
          });
          langWrap.appendChild(b);
        });
      } else {
        langWrap.textContent = 'Language unavailable';
      }
    }

    const speed = this.panel.querySelector('#settings-text-speed');
    if (speed) {
      speed.addEventListener('change', () => this.setTextSpeed(speed.value));
    }

    const rm = this.panel.querySelector('#settings-reduced-motion');
    if (rm) {
      rm.addEventListener('click', () => {
        const next = !this.settings.reducedMotion;
        this.setReducedMotion(next);
        rm.setAttribute('aria-checked', String(next));
        const dot = rm.querySelector('span');
        if (dot) dot.style.transform = next ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
        rm.style.background = next ? '#4b5563' : '#374151';
      });
    }

    const mute = this.panel.querySelector('#settings-mute');
    if (mute) {
      mute.addEventListener('click', () => {
        const next = !this.settings.mute;
        this.setMute(next);
        mute.setAttribute('aria-checked', String(next));
        const dot = mute.querySelector('span');
        if (dot) dot.style.transform = next ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
        mute.style.background = next ? '#4b5563' : '#374151';
      });
    }
  }

  _refreshLanguageUI() {
    if (!this.panel) return;
    const I18N = window.I18N;
    const label = this.panel.querySelector('#settings-language-label');
    if (label && I18N) label.textContent = I18N.t('language');
    const wrap = this.panel.querySelector('#settings-lang-buttons');
    if (!wrap || !I18N) return;
    if (wrap.childElementCount === 0) return; // buttons built in _bindControls
    wrap.querySelectorAll('button[data-lang]').forEach((b) => {
      const on = b.getAttribute('data-lang') === I18N.lang;
      b.className = 'px-3 py-2 rounded border text-sm font-semibold transition-colors ' +
        (on ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-gray-600 bg-gray-800 text-gray-100 hover:border-yellow-400');
    });
  }

  togglePanel() {
    if (!this.panel) this.injectUI();
    if (this.panel.classList.contains('hidden')) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  openPanel() {
    if (!this.panel) this.injectUI();
    this.panel.classList.remove('hidden');
    // re-sync UI controls to current state
    const volume = this.panel.querySelector('#settings-volume');
    const volumeVal = this.panel.querySelector('#settings-volume-val');
    if (volume) {
      volume.value = this.settings.volume;
      if (volumeVal) volumeVal.textContent = `${Math.round(this.settings.volume * 100)}%`;
    }
    const speed = this.panel.querySelector('#settings-text-speed');
    if (speed) speed.value = this.settings.textSpeed;
    this._refreshLanguageUI();
    const rm = this.panel.querySelector('#settings-reduced-motion');
    if (rm) {
      rm.setAttribute('aria-checked', String(this.settings.reducedMotion));
      const dot = rm.querySelector('span');
      if (dot) dot.style.transform = this.settings.reducedMotion ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
      rm.style.background = this.settings.reducedMotion ? '#4b5563' : '#374151';
    }
    const mute = this.panel.querySelector('#settings-mute');
    if (mute) {
      mute.setAttribute('aria-checked', String(this.settings.mute));
      const dot = mute.querySelector('span');
      if (dot) dot.style.transform = this.settings.mute ? 'translateX(1.5rem)' : 'translateX(0.25rem)';
      mute.style.background = this.settings.mute ? '#4b5563' : '#374151';
    }
  }

  closePanel() {
    if (this.panel) this.panel.classList.add('hidden');
  }
}

/* ------------------------------------------------------------------ bootstrap */
document.addEventListener('DOMContentLoaded', () => {
  window.settings = new Settings();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.settings.closePanel();
    }
  });
});
