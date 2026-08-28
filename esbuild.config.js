import { build } from 'esbuild';
import { copyFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = [
  'game.js',
  'enhancements.js',
  'battle-system.js',
  'puzzle-system.js',
  'progression-system.js',
  'visual-effects.js',
  'nightmare-system.js',
  'infinite-loop.js',
  'i18n.js',
  'study-guide.js',
  'settings.js',
  'audio.js',
  'faction-system.js',
];

const outDir = `${__dirname}/dist`;
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

build({
  entryPoints: [`${__dirname}/bundle-entry.js`],
  bundle: true,
  format: 'iife',
  outfile: `${outDir}/bundle.js`,
  minify: true,
  write: true,
}).then(() => {
  console.log('Build complete: dist/bundle.js');

  // Copy styles.css
  copyFileSync(`${__dirname}/styles.css`, `${outDir}/styles.css`);
  console.log('Copied styles.css -> dist/');

  // Write dist/index.html referencing the bundled script
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Divine Quest - A Journey Through Faith and Reason</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        
        body {
            font-family: 'Crimson Text', serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .cinzel {
            font-family: 'Cinzel', serif;
        }
        
        .divine-glow {
            animation: divineGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes divineGlow {
            from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
            to { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3); }
        }
        
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .scripture-text {
            background: linear-gradient(45deg, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .choice-button {
            transition: all 0.3s ease;
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }
        
        .choice-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.4), transparent);
            transition: width 0.6s, height 0.6s;
            transform: translate(-50%, -50%);
        }
        
        .choice-button:hover::before {
            width: 400px;
            height: 400px;
        }
        
        .choice-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
            background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15));
        }
        
        .wisdom-orb {
            background: radial-gradient(circle, rgba(255,215,0,0.8), rgba(255,215,0,0.2));
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }
        
        .theology-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,215,0,0.3);
        }
        
        .faith-bar {
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
            transition: width 0.5s ease;
        }
        
        .wisdom-bar {
            background: linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d);
            transition: width 0.5s ease;
        }
        
        .compassion-bar {
            background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
            transition: width 0.5s ease;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
    <!-- Header -->
    <header class="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border-b border-yellow-500 border-opacity-30">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="cinzel text-3xl font-bold text-yellow-400 divine-glow">The Divine Quest</h1>
                <div class="flex space-x-6">
                    <div class="text-white">
                        <i class="fas fa-pray text-blue-400"></i>
                        <span class="ml-2">Faith: <span id="faith">50</span></span>
                    </div>
                    <div class="text-white">
                        <i class="fas fa-brain text-yellow-400"></i>
                        <span class="ml-2">Wisdom: <span id="wisdom">50</span></span>
                    </div>
                    <div class="text-white">
                        <i class="fas fa-heart text-green-400"></i>
                        <span class="ml-2">Compassion: <span id="compassion">50</span></span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Game Area -->
    <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Panel - Character & Stats -->
            <div class="lg:col-span-1">
                <div class="theology-card rounded-xl p-6 mb-6">
                    <h2 class="cinzel text-xl font-bold mb-4 text-gray-800">Your Spiritual Journey</h2>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span><i class="fas fa-pray text-blue-500"></i> Faith</span>
                                <span id="faith-text">50/100</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="faith-bar h-3 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span><i class="fas fa-brain text-yellow-500"></i> Wisdom</span>
                                <span id="wisdom-text">50/100</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="wisdom-bar h-3 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span><i class="fas fa-heart text-green-500"></i> Compassion</span>
                                <span id="compassion-text">50/100</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="compassion-bar h-3 rounded-full" style="width: 50%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Divine Wisdom Orb -->
                <div class="theology-card rounded-xl p-6">
                    <h3 class="cinzel text-lg font-bold mb-3 text-gray-800">Divine Wisdom</h3>
                    <div class="wisdom-orb w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i class="fas fa-lightbulb text-white text-3xl floating"></i>
                    </div>
                    <p id="wisdom-quote" class="text-sm text-gray-700 italic text-center">
                        "The journey of a thousand miles begins with a single step of faith."
                    </p>
                </div>
            </div>

            <!-- Center Panel - Main Story -->
            <div class="lg:col-span-2">
                <div class="theology-card rounded-xl p-8">
                    <div id="story-container" class="mb-8">
                        <h2 class="cinzel text-2xl font-bold mb-4 text-gray-800">The Beginning of Enlightenment</h2>
                        <div id="story-text" class="text-gray-700 leading-relaxed mb-6">
                            <p class="mb-4">You stand at the crossroads of eternity, where the veil between the mortal and divine grows thin. The ancient texts speak of a journey—not of distance, but of understanding. Before you lies a path that will test not just your beliefs, but the very nature of faith itself.</p>
                            
                            <p class="mb-4">The Divine Messenger appears before you, radiating light that seems to contain all the wisdom of the ages. "Seeker," the voice echoes in your soul, "you have been chosen for a quest that transcends time and space. You must navigate the realms of theological understanding, where every choice shapes not just your destiny, but your very understanding of the divine."</p>
                            
                            <p class="mb-4">Three paths present themselves, each representing a different approach to the divine mystery:</p>
                        </div>
                    </div>

                    <!-- Choices -->
                    <div id="choices-container" class="space-y-3">
                        <button onclick="makeChoice(1)" class="choice-button w-full text-left p-4 rounded-lg border border-yellow-500 border-opacity-30 hover:border-opacity-60">
                            <div class="flex items-center">
                                <i class="fas fa-cross text-yellow-500 mr-3"></i>
                                <div>
                                    <h4 class="font-semibold text-white">The Path of Devotion</h4>
                                    <p class="text-sm text-gray-300">Embrace faith through absolute trust and surrender to divine will.</p>
                                </div>
                            </div>
                        </button>
                        
                        <button onclick="makeChoice(2)" class="choice-button w-full text-left p-4 rounded-lg border border-yellow-500 border-opacity-30 hover:border-opacity-60">
                            <div class="flex items-center">
                                <i class="fas fa-book-open text-blue-500 mr-3"></i>
                                <div>
                                    <h4 class="font-semibold text-white">The Path of Scholarship</h4>
                                    <p class="text-sm text-gray-300">Seek understanding through sacred texts, philosophy, and rational inquiry.</p>
                                </div>
                            </div>
                        </button>
                        
                        <button onclick="makeChoice(3)" class="choice-button w-full text-left p-4 rounded-lg border border-yellow-500 border-opacity-30 hover:border-opacity-60">
                            <div class="flex items-center">
                                <i class="fas fa-hands-helping text-green-500 mr-3"></i>
                                <div>
                                    <h4 class="font-semibold text-white">The Path of Service</h4>
                                    <p class="text-sm text-gray-300">Find the divine through compassion and service to all living beings.</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <!-- Scripture Display -->
                    <div id="scripture-container" class="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-500 hidden">
                        <h3 class="cinzel text-lg font-bold mb-2 scripture-text">Sacred Scripture</h3>
                        <p id="scripture-text" class="text-gray-700 italic"></p>
                        <p id="scripture-reference" class="text-sm text-gray-600 mt-2"></p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="mt-12 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border-t border-yellow-500 border-opacity-30">
        <div class="container mx-auto px-4 py-6">
            <div class="text-center text-gray-300">
                <p class="cinzel text-sm">"For in the depth of every question lies the seed of divine understanding"</p>
            </div>
        </div>
    </footer>

    <script src="bundle.js"></script>
</body>
</html>`;

  writeFileSync(`${outDir}/index.html`, html);
  console.log('Wrote dist/index.html referencing bundle.js');
}).catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
