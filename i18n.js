/**
 * i18n.js — lightweight localization scaffold for The Divine Quest.
 *
 * HOW TO RETROFIT game.js NARRATIVE TEXT:
 *   1. Wrap every user-facing string in window.I18N.t('...').
 *      Example:  const title = 'Chapter One';
 *                ↓
 *                const title = window.I18N.t('chapter1.title');
 *   2. Add the key/value pair to the appropriate language object
 *      inside I18N.strings (e.g. I18N.strings.en['chapter1.title']).
 *   3. For static HTML, add data-i18n="key" to elements. This module
 *      auto-translates any element that declares data-i18n on load and
 *      after every language change (listens for 'languageChanged').
 *   4. Keep keys namespaced by chapter/context to avoid collisions,
 *      e.g. 'settings', 'study', 'achievement', 'victory', 'select',
 *           'mute', 'volume', 'chapter1.opening', etc.
 */

(function () {
  'use strict';

  if (window.I18N && window.I18N.__initialized) {
    return; // guard against double-load
  }

  const STORAGE_KEY = 'tdq_i18n_lang';

  const strings = {
    en: {
      settings: 'Settings',
      study: 'Study',
      achievement: 'Achievement',
      victory: 'Victory',
      select: 'Select',
      mute: 'Mute',
      volume: 'Volume',
      language: 'Language',
    },
    es: {
      settings: 'Ajustes',
      study: 'Estudiar',
      achievement: 'Logro',
      victory: 'Victoria',
      select: 'Seleccionar',
      mute: 'Silenciar',
      volume: 'Volumen',
      language: 'Idioma',
    },
  };

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && strings[stored]) {
        return stored;
      }
    } catch (_e) {
      // localStorage may be unavailable in some contexts
    }
    return 'en';
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_e) {
      // ignore write failures
    }
  }

  const I18N = {
    __initialized: true,
    strings: strings,
    lang: getStoredLang(),

    t: function t(key) {
      if (!key || typeof key !== 'string') {
        return '';
      }
      const byLang = strings[I18N.lang];
      if (byLang && Object.prototype.hasOwnProperty.call(byLang, key)) {
        return byLang[key];
      }
      const byEn = strings.en;
      if (byEn && Object.prototype.hasOwnProperty.call(byEn, key)) {
        return byEn[key];
      }
      return key;
    },

    setLanguage: function setLanguage(lang) {
      if (lang === I18N.lang) {
        return;
      }
      if (!strings[lang]) {
        return;
      }
      I18N.lang = lang;
      setStoredLang(lang);
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { lang: lang },
        bubbles: true,
        composed: true,
      }));
      I18N.applyDocumentTranslations();
    },

    cycleLanguage: function cycleLanguage() {
      const langs = Object.keys(strings);
      const idx = langs.indexOf(I18N.lang);
      const next = langs[(idx + 1) % langs.length];
      I18N.setLanguage(next);
    },

    applyDocumentTranslations: function applyDocumentTranslations() {
      const nodes = document.querySelectorAll('[data-i18n]');
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        const key = el.getAttribute('data-i18n');
        if (key) {
          const text = I18N.t(key);
          if (text !== key) {
            el.textContent = text;
          }
        }
      }
    },
  };

  window.I18N = I18N;

  // Self-inject language switcher
  function injectSwitcher() {
    if (document.getElementById('tdq-i18n-switcher')) {
      return;
    }
    const btn = document.createElement('button');
    btn.id = 'tdq-i18n-switcher';
    btn.type = 'button';
    btn.title = I18N.t('language');
    btn.textContent = '🌐';
    btn.setAttribute('aria-label', I18N.t('language'));
    btn.style.position = 'fixed';
    btn.style.bottom = '12px';
    btn.style.right = '12px';
    btn.style.zIndex = '9999';
    btn.style.background = 'rgba(0,0,0,0.6)';
    btn.style.color = '#fff';
    btn.style.border = '1px solid rgba(255,255,255,0.3)';
    btn.style.borderRadius = '9999px';
    btn.style.padding = '8px 12px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '18px';
    btn.style.lineHeight = '1';
    btn.style.backdropFilter = 'blur(4px)';

    btn.addEventListener('click', function () {
      I18N.cycleLanguage();
    });

    document.addEventListener('languageChanged', function () {
      btn.title = I18N.t('language');
      btn.setAttribute('aria-label', I18N.t('language'));
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      injectSwitcher();
      I18N.applyDocumentTranslations();
    });
  } else {
    injectSwitcher();
    I18N.applyDocumentTranslations();
  }
}());
