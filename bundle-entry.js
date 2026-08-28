// Build-only entry: imports all game files in the exact load order
// so esbuild produces a single bundle while preserving global assignments.
import './game.js';
import './enhancements.js';
import './battle-system.js';
import './puzzle-system.js';
import './progression-system.js';
import './visual-effects.js';
import './nightmare-system.js';
import './infinite-loop.js';
import './i18n.js';
import './study-guide.js';
import './settings.js';
import './audio.js';
import './faction-system.js';
