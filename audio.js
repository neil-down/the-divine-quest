/**
 * DivineAudio — self-contained WebAudio ambient + SFX for The Divine Quest.
 * No external assets. Hooks existing globals without editing them.
 */
class DivineAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientEnabled = true;
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.ambientNodes = [];
    this.started = false;

    // One-time unlock on user interaction (browser autoplay policy)
    this._ensureStarted = this._ensureStarted.bind(this);
    window.addEventListener('click', this._ensureStarted, { once: true });
    window.addEventListener('keydown', this._ensureStarted, { once: true });
  }

  _ensureStarted() {
    if (this.started) return;
    this.started = true;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(this.ctx.destination);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.6;
    this.sfxGain.connect(this.masterGain);

    if (this.ambientEnabled) {
      this._startAmbient();
    }
    window.removeEventListener('click', this._ensureStarted);
    window.removeEventListener('keydown', this._ensureStarted);
  }

  _createOsc(type, freq, detune = 0, gainVal = 0.02) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    gain.gain.value = gainVal;
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    return { osc, gain };
  }

  _startAmbient() {
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.18;
    this.ambientGain.connect(this.masterGain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.5;
    filter.connect(this.ambientGain);

    // Gentle root chord: C3, G3, E3, G4, C5 (add2-suspended warmth)
    const freqs = [130.81, 196.0, 164.81, 392.0, 523.25];
    freqs.forEach((f, i) => {
      const detune = (Math.random() - 0.5) * 6;
      const { osc, gain } = this._createOsc(i < 2 ? 'sine' : 'triangle', f, detune, 0.025);
      osc.disconnect();
      osc.connect(filter);
      this.ambientNodes.push(osc, gain);

      // Slow LFO for movement
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + Math.random() * 0.1;
      lfoGain.gain.value = 0.004;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      this.ambientNodes.push(lfo, lfoGain);
    });
  }

  stopAmbient() {
    this.ambientNodes.forEach(node => {
      try { node.stop && node.stop(); } catch (e) { /* ignore */ }
    });
    this.ambientNodes = [];
  }

  // Ambient toggle API — respects existing mute/volume model
  isAmbientEnabled() {
    return this.ambientEnabled;
  }

  setAmbientEnabled(enabled) {
    this.ambientEnabled = !!enabled;
    if (!this.started) return;
    if (this.ambientEnabled && !this.muted) {
      if (this.ambientNodes.length === 0) {
        this._startAmbient();
      }
    } else {
      this.stopAmbient();
    }
    this._safeCallback(this._onAmbientChanged, this.ambientEnabled);
  }

  toggleAmbient() {
    this.setAmbientEnabled(!this.ambientEnabled);
    return this.ambientEnabled;
  }

  // Callback hook for UI to react to ambient changes (e.g., update button icon)
  _onAmbientChanged() {}

  setMute(muted) {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.3);
    }
    // If unmuting and ambient is enabled, start ambient if it's not running
    if (!muted && this.ambientEnabled && this.ambientNodes.length === 0 && this.started) {
      this._startAmbient();
    }
  }

  toggleMute() {
    this.setMute(!this.muted);
    return this.muted;
  }

  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
    }
  }

  _safeCallback(cb, ...args) {
    if (typeof cb === 'function') {
      try { cb(...args); } catch (e) { /* ignore */ }
    }
  }

  play(name) {
    this._ensureStarted();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    const out = (osc, gainNode, dest = this.sfxGain) => {
      osc.connect(gainNode);
      gainNode.connect(dest);
    };

    switch (name) {
      case 'select': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        out(osc, g);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'achievement': {
        // Gentle ascending major arpeggio (reverent)
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.08;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.14, t + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
          out(osc, g);
          osc.start(t);
          osc.stop(t + 0.65);
        });
        break;
      }
      case 'battle-hit': {
        // Soft thud, not jarring
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        out(osc, g);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'victory': {
        // Gentle resolved cadence
        [392, 494, 587, 784].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.12;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.15, t + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
          out(osc, g);
          osc.start(t);
          osc.stop(t + 1.0);
        });
        break;
      }
      case 'puzzle-solve': {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.10, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        out(osc, g);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'chapter': {
        // Soft pad swell
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 196;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.5);
        g.gain.linearRampToValueAtTime(0.0001, now + 2.0);
        out(osc, g);
        osc.start(now);
        osc.stop(now + 2.1);
        break;
      }
      case 'prayer': {
        // Soft bell-like chime — reverent, gentle
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.06;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
          out(osc, g);
          osc.start(t);
          osc.stop(t + 0.85);
        });
        break;
      }
      case 'revelation': {
        // Rising shimmer — ascending gentle sparkle
        [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.07;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.10, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
          out(osc, g);
          osc.start(t);
          osc.stop(t + 0.75);
        });
        break;
      }
      case 'scripture': {
        // Deep resonant tone — warm, grounding
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 146.83; // D3
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        out(osc, g);
        osc.start(now);
        osc.stop(now + 1.3);
        break;
      }
      default:
        break;
    }
  }
}

// Singleton
window.divineAudio = new DivineAudio();

// Ambient toggle button
(function () {
  function injectAmbientToggle() {
    if (document.getElementById('divine-ambient-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'divine-ambient-toggle';
    btn.textContent = '🎵';
    btn.title = window.I18N ? window.I18N.t('Ambient music') : 'Ambient music';
    btn.setAttribute('aria-label', window.I18N ? window.I18N.t('Ambient music') : 'Toggle ambient music');
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '16px',
      right: '72px',
      zIndex: '9999',
      background: 'rgba(0,0,0,0.55)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      padding: '10px 14px',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      fontSize: '18px',
      lineHeight: '1',
      userSelect: 'none'
    });
    const audio = window.divineAudio;
    btn.addEventListener('click', () => {
      const enabled = audio.toggleAmbient();
      btn.textContent = enabled ? '🎵' : '🔇';
      btn.title = window.I18N ? window.I18N.t('Ambient music') : 'Ambient music';
      btn.setAttribute('aria-label', window.I18N ? window.I18N.t('Ambient music') : 'Toggle ambient music');
    });
    // Sync initial state
    if (!audio.isAmbientEnabled()) {
      btn.textContent = '🔇';
    }
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAmbientToggle);
  } else {
    injectAmbientToggle();
  }
})();

// Mute toggle button
(function () {
  function injectToggle() {
    if (document.getElementById('divine-audio-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'divine-audio-toggle';
    btn.textContent = '🔊';
    btn.title = window.I18N ? window.I18N.t('Mute / Unmute') : 'Mute / Unmute';
    btn.setAttribute('aria-label', window.I18N ? window.I18N.t('Mute / Unmute') : 'Toggle audio');
    Object.assign(btn.style, {
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
      fontSize: '18px',
      lineHeight: '1',
      userSelect: 'none'
    });
    btn.addEventListener('click', () => {
      const muted = window.divineAudio.toggleMute();
      btn.textContent = muted ? '🔇' : '🔊';
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectToggle);
  } else {
    injectToggle();
  }
})();

// Hook existing globals without editing their source
(function () {
  const audio = window.divineAudio;

  function hookShowAchievement() {
    if (!window.game || typeof window.game.showAchievement !== 'function') return false;
    const original = window.game.showAchievement.bind(window.game);
    window.game.showAchievement = function (title, description) {
      audio.play('achievement');
      return original(title, description);
    };
    return true;
  }

  function hookTriggerAttackEffect() {
    if (!window.visualEffects || typeof window.visualEffects.triggerAttackEffect !== 'function') return false;
    const original = window.visualEffects.triggerAttackEffect.bind(window.visualEffects);
    window.visualEffects.triggerAttackEffect = function (attacker, target, damage) {
      audio.play('battle-hit');
      return original(attacker, target, damage);
    };
    return true;
  }

  function hookTriggerVictoryEffect() {
    if (!window.visualEffects || typeof window.visualEffects.triggerVictoryEffect !== 'function') return false;
    const original = window.visualEffects.triggerVictoryEffect.bind(window.visualEffects);
    window.visualEffects.triggerVictoryEffect = function () {
      audio.play('victory');
      return original();
    };
    return true;
  }

  // Wait for globals to be defined by other scripts
  function tryHook() {
    if (hookShowAchievement() || hookTriggerAttackEffect() || hookTriggerVictoryEffect()) {
      clearInterval(timer);
      timer = null;
    }
  }

  let timer = setInterval(tryHook, 100);

  // Final fallback after 5s
  setTimeout(() => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
      hookShowAchievement();
      hookTriggerAttackEffect();
      hookTriggerVictoryEffect();
    }
  }, 5000);
})();
