// Challenge Mode - Family-Friendly Loop System for The Divine Quest

class ChallengeMode {
    constructor(game) {
        this.game = game;
        this.loopCount = 0;
        this.challengeLevel = 1;
        this.inChallenge = false;
        this.challengeEntities = [];
        this.timeDistortion = false;
        this.realityPuzzles = [];
        this.inNightmare = false;
        this.metaProgress = null;
        this.failureCount = 0;
        this.currentFailures = 0;
        this.init();
    }
    
    init() {
        this.createChallengeUI();
        this.loadMetaProgress();
        this.createMetaHUD();
        this.startRealityMonitoring();
        this.addNightmareTrigger();
    }
    
    loadMetaProgress() {
        try {
            const raw = localStorage.getItem('divine-quest-meta-progress');
            if (raw) {
                this.metaProgress = JSON.parse(raw);
            }
        } catch (e) {
            this.metaProgress = null;
        }
        if (!this.metaProgress || typeof this.metaProgress !== 'object') {
            this.metaProgress = { loopsCompleted: 0, totalClarity: 0, bestEscapes: 0 };
        }
    }

    saveMetaProgress() {
        try {
            localStorage.setItem('divine-quest-meta-progress', JSON.stringify(this.metaProgress));
        } catch (e) {
            // Storage unavailable
        }
    }

    createMetaHUD() {
        if (document.getElementById('meta-progress-hud')) return;
        const hud = document.createElement('div');
        hud.id = 'meta-progress-hud';
        hud.className = 'fixed bottom-4 left-4 bg-gray-900 bg-opacity-80 rounded-lg p-3 text-white text-xs z-40 border border-gray-700';
        hud.innerHTML = '<div class="text-gray-400">Loops Completed</div><div class="text-xl font-bold text-yellow-400" id="meta-loops-count">0</div>';
        document.body.appendChild(hud);
        this.updateMetaHUD();
    }

    updateMetaHUD() {
        if (!this.metaProgress) return;
        const el = document.getElementById('meta-loops-count');
        if (el) el.textContent = this.metaProgress.loopsCompleted;
    }

    recordEscape() {
        if (!this.metaProgress) return;
        this.metaProgress.loopsCompleted = (this.metaProgress.loopsCompleted || 0) + 1;
        this.metaProgress.bestEscapes = Math.max(this.metaProgress.bestEscapes || 0, this.loopCount);
        const clarityGain = (window.game && window.game.playerStats) ? (window.game.playerStats.clarity || window.game.playerStats.wisdom || 0) : 0;
        this.metaProgress.totalClarity = (this.metaProgress.totalClarity || 0) + clarityGain;
        this.saveMetaProgress();
        this.updateMetaHUD();
    }

    recordFailure() {
        this.currentFailures = (this.currentFailures || 0) + 1;
        this.failureCount = (this.failureCount || 0) + 1;
    }

    determineEndingType() {
        const clarity = (window.game && window.game.playerStats) ? (window.game.playerStats.clarity || window.game.playerStats.wisdom || 0) : 0;
        const metaClarity = this.metaProgress ? (this.metaProgress.totalClarity || 0) : 0;
        if (clarity >= 50 || metaClarity >= 150) {
            return 'awakening';
        }
        if (this.currentFailures >= 3 || this.loopCount >= 6) {
            return 'consumption';
        }
        return 'generic';
    }

    createChallengeUI() {
        const ui = document.createElement('div');
        ui.className = 'fixed top-4 right-4 bg-purple-900 bg-opacity-90 rounded-lg p-4 text-white z-50 hidden';
        ui.id = 'challenge-ui';
        ui.innerHTML = `
            <div class="text-center mb-2">
                <div class="text-sm text-purple-400 animate-pulse">CHALLENGE MODE</div>
                <div class="text-2xl font-bold text-purple-500">Loop ${this.loopCount}</div>
                <div class="text-sm text-purple-300">Level ${this.challengeLevel}</div>
            </div>
            <div class="mb-2">
                <div class="text-xs text-purple-400 mb-1">Focus</div>
                <div class="w-full bg-gray-800 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full transition-all duration-300" id="focus-bar" style="width: 100%"></div>
                </div>
            </div>
            <button onclick="window.challenge.attemptBreak()" class="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded text-sm font-bold">
                SOLVE THE PUZZLE
            </button>
        `;
        
        document.body.appendChild(ui);
        window.challenge = this;
    }
    
    startRealityMonitoring() {
        // Monitor for challenge patterns
        setInterval(() => {
            if (this.inChallenge) {
                this.checkRealityPuzzles();
                this.distortTime();
                this.spawnChallengeEntities();
            }
        }, 5000);
        
        // Focus drain
        setInterval(() => {
            if (this.inChallenge) {
                this.drainFocus(2);
            }
        }, 3000);
    }
    
    addNightmareTrigger() {
        // Override makeChoice to potentially trigger nightmare
        const originalMakeChoice = this.game.makeChoice.bind(this.game);
        this.game.makeChoice = (choiceIndex) => {
            const result = originalMakeChoice(choiceIndex);
            
            // 5% chance to trigger nightmare on any choice
            if (!this.inNightmare && Math.random() < 0.05) {
                setTimeout(() => this.triggerNightmare(), 2000);
            }
            
            return result;
        };
    }
    
    triggerNightmare() {
        this.inNightmare = true;
        this.loopCount++;
        this.nightmareLevel = Math.floor(this.loopCount / 3) + 1;

        const roll = Math.random();
        if (roll < 0.15) {
            this.triggerMirroredSelf();
            return;
        }
        if (roll < 0.30) {
            this.triggerUnmaking();
            return;
        }

        // Show nightmare UI
        document.getElementById('nightmare-ui').classList.remove('hidden');

        // Reality breaking effects
        this.breakReality();
        this.showNightmareMessage();

        // Start nightmare music effect
        this.createNightmareAudio();

        // Distort the game world
        this.distortGameWorld();
    }
    
    breakReality() {
        // Glitch the screen
        document.body.style.animation = 'realityGlitch 0.5s infinite';
        
        // Create reality tears
        for (let i = 0; i < 10; i++) {
            setTimeout(() => this.createRealityTear(), i * 100);
        }
        
        // Invert colors randomly
        setInterval(() => {
            if (this.inNightmare && Math.random() < 0.3) {
                document.body.style.filter = `invert(${Math.random() * 100}%) hue-rotate(${Math.random() * 360}deg)`;
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 200);
            }
        }, 8000);
    }
    
    createRealityTear() {
        const tear = document.createElement('div');
        tear.className = 'fixed bg-black z-40';
        tear.style.width = Math.random() * 200 + 50 + 'px';
        tear.style.height = '2px';
        tear.style.left = Math.random() * 100 + '%';
        tear.style.top = Math.random() * 100 + '%';
        tear.style.transform = `rotate(${Math.random() * 360}deg)`;
        tear.style.animation = 'tearExpand 2s ease-out';
        
        document.body.appendChild(tear);
        setTimeout(() => tear.remove(), 2000);
    }
    
    showNightmareMessage() {
        const messages = [
            "The cycle repeats. You've been here before.",
            "Reality is tearing apart at the seams.",
            "The divine presence feels... wrong.",
            "Your choices lead back to the beginning.",
            "The loop is closing in.",
            "Can you feel the pattern repeating?",
            "Time has no meaning here.",
            "The veil between worlds is thinning.",
            "Something is watching from the other side.",
            "Break free before you forget who you are."
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4 animate-pulse">🌀</div>
                <h2 class="text-3xl font-bold text-red-500 mb-4">NIGHTMARE LOOP ${this.loopCount}</h2>
                <p class="text-xl text-gray-300 mb-6">${message}</p>
                <button onclick="this.closest('.fixed').remove()" class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold">
                    Face the Nightmare
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 5000);
    }
    
    createNightmareAudio() {
        // Create unsettling audio effect
        const audio = document.createElement('div');
        audio.innerHTML = `
            <audio loop>
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav">
            </audio>
        `;
        audio.id = 'nightmare-audio';
        document.body.appendChild(audio);
        
        // Try to play (will be muted by browser autoplay policies)
        try {
            audio.querySelector('audio').play();
        } catch (e) {
            console.log('Audio autoplay blocked');
        }
    }
    
    distortGameWorld() {
        // Distort text randomly
        setInterval(() => {
            if (this.inNightmare && Math.random() < 0.2) {
                const texts = document.querySelectorAll('p, h1, h2, h3, h4');
                const randomText = texts[Math.floor(Math.random() * texts.length)];
                if (randomText) {
                    const original = randomText.textContent;
                    const glitched = this.glitchText(original);
                    randomText.textContent = glitched;
                    setTimeout(() => {
                        randomText.textContent = original;
                    }, 100);
                }
            }
        }, 4000);
        
        // Make elements disappear and reappear
        setInterval(() => {
            if (this.inNightmare && Math.random() < 0.1) {
                const elements = document.querySelectorAll('.choice-button, .theology-card');
                const randomElement = elements[Math.floor(Math.random() * elements.length)];
                if (randomElement) {
                    randomElement.style.opacity = '0';
                    setTimeout(() => {
                        randomElement.style.opacity = '1';
                    }, 500);
                }
            }
        }, 6000);
    }
    
    glitchText(text) {
        const glitchChars = ['@', '#', '$', '%', '&', '*', '�', '�', '�'];
        let glitched = '';
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.1) {
                glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
            } else {
                glitched += text[i];
            }
        }
        return glitched;
    }
    
    checkRealityGlitches() {
        // Random reality distortions
        const distortions = [
            () => this.screenGlitch(),
            () => this.textCorruption(),
            () => this.elementDuplication(),
            () => this.colorInversion(),
            () => this.spatialDistortion()
        ];
        
        if (Math.random() < 0.3) {
            const distortion = distortions[Math.floor(Math.random() * distortions.length)];
            distortion();
        }
    }
    
    screenGlitch() {
        const glitch = document.createElement('div');
        glitch.className = 'fixed inset-0 bg-white z-50';
        glitch.style.animation = 'screenGlitch 0.2s';
        
        document.body.appendChild(glitch);
        setTimeout(() => glitch.remove(), 200);
    }
    
    textCorruption() {
        const texts = document.querySelectorAll('p');
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        if (randomText) {
            randomText.style.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            setTimeout(() => {
                randomText.style.color = '';
            }, 1000);
        }
    }
    
    elementDuplication() {
        const buttons = document.querySelectorAll('.choice-button');
        if (buttons.length > 0) {
            const original = buttons[Math.floor(Math.random() * buttons.length)];
            const clone = original.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.top = Math.random() * window.innerHeight + 'px';
            clone.style.left = Math.random() * window.innerWidth + 'px';
            clone.style.zIndex = '1000';
            clone.style.opacity = '0.7';
            
            document.body.appendChild(clone);
            setTimeout(() => clone.remove(), 3000);
        }
    }
    
    colorInversion() {
        document.body.style.filter = 'invert(100%) hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 500);
    }
    
    spatialDistortion() {
        document.body.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Math.random() * 10 - 5}deg)`;
        setTimeout(() => {
            document.body.style.transform = '';
        }, 1000);
    }
    
    distortTime() {
        if (!this.timeDistortion && Math.random() < 0.2) {
            this.timeDistortion = true;
            
            // Slow down animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animationDuration = '10s';
                el.style.transitionDuration = '2s';
            });
            
            setTimeout(() => {
                this.timeDistortion = false;
                document.querySelectorAll('*').forEach(el => {
                    el.style.animationDuration = '';
                    el.style.transitionDuration = '';
                });
            }, 5000);
        }
    }
    
    spawnNightmareEntities() {
        if (Math.random() < 0.3) {
            this.createNightmareEntity();
        }
    }
    
    createNightmareEntity() {
        const entity = document.createElement('div');
        entity.className = 'fixed text-6xl z-50';
        entity.style.left = Math.random() * window.innerWidth + 'px';
        entity.style.top = Math.random() * window.innerHeight + 'px';
        entity.textContent = ['👁️', '🌀', '⚠️', '❓', '🔮'][Math.floor(Math.random() * 5)];
        entity.style.animation = 'entityFloat 3s ease-in-out infinite';
        
        document.body.appendChild(entity);
        
        // Click to destroy
        entity.onclick = () => {
            entity.remove();
            this.game.playerStats.wisdom += 2;
            this.game.updateStats();
        };
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (entity.parentNode) {
                entity.remove();
            }
        }, 5000);
    }
    
    drainSanity(amount) {
        const sanityBar = document.getElementById('sanity-bar');
        if (sanityBar) {
            const currentWidth = parseInt(sanityBar.style.width) || 100;
            const newWidth = Math.max(0, currentWidth - amount);
            sanityBar.style.width = newWidth + '%';
            
            if (newWidth <= 0) {
                this.sanityDepleted();
            } else if (newWidth <= 30) {
                this.intenseNightmare();
            }
        }
    }
    
    sanityDepleted() {
        // Reset to beginning but with nightmare corruption
        this.game.currentChapter = 0;
        this.game.currentScene = 0;
        this.game.loadChapter(0, 0);
        
        // Permanent corruption
        this.corruptGame();
        this.recordFailure();
        
        this.showNightmareEnd("Your sanity is gone. The nightmare has won... for now.");
    }
    
    intenseNightmare() {
        // Increase nightmare intensity
        document.body.style.animation = 'intenseNightmare 1s infinite';
        
        // More frequent glitches
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.screenGlitch(), i * 100);
        }
    }
    
    corruptGame() {
        // Add permanent corruption to game
        const style = document.createElement('style');
        style.textContent = `
            .choice-button {
                animation: corruption 2s infinite;
            }
            @keyframes corruption {
                0%, 100% { filter: hue-rotate(0deg); }
                50% { filter: hue-rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    attemptBreak() {
        // Puzzle to break the loop
        this.createLoopBreakPuzzle();
    }
    
    createLoopBreakPuzzle() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-red-900 rounded-xl p-8 max-w-2xl w-full mx-4 border-2 border-red-500">
                <h2 class="text-3xl font-bold text-red-400 mb-4">BREAK THE LOOP</h2>
                <p class="text-gray-300 mb-6">The nightmare feeds on repetition. Break the pattern by finding the anomaly:</p>
                
                <div class="grid grid-cols-4 gap-2 mb-6" id="loop-puzzle">
                    ${this.generateLoopPuzzle()}
                </div>
                
                <div class="text-center">
                    <button onclick="window.nightmare.checkLoopSolution()" class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold">
                        BREAK FREE
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    generateLoopPuzzle() {
        const symbols = ['🌀', '👁️', '⚠️', '❓', '🔮', '🌟', '⚡', '🔥'];
        const anomalyIndex = Math.floor(Math.random() * 16);
        let puzzle = '';
        
        for (let i = 0; i < 16; i++) {
            const symbol = i === anomalyIndex ? '💀' : symbols[Math.floor(Math.random() * symbols.length)];
            puzzle += `
                <div class="bg-gray-800 p-4 rounded text-2xl cursor-pointer hover:bg-gray-700 transition-colors" 
                     data-index="${i}" onclick="window.nightmare.selectPuzzlePiece(${i})">
                    ${symbol}
                </div>
            `;
        }
        
        this.loopSolution = anomalyIndex;
        return puzzle;
    }
    
    selectPuzzlePiece(index) {
        const pieces = document.querySelectorAll('#loop-puzzle > div');
        pieces.forEach(piece => piece.classList.remove('border-2', 'border-yellow-400'));
        pieces[index].classList.add('border-2', 'border-yellow-400');
        this.selectedPiece = index;
    }
    
    checkLoopSolution() {
        if (this.selectedPiece === this.loopSolution) {
            if (this.inUnmaking) {
                this.endUnmaking(true);
            } else {
                this.breakLoopSuccess();
            }
        } else {
            if (this.inUnmaking) {
                this.endUnmaking(false);
            } else {
                this.breakLoopFailure();
            }
        }
    }
    
    breakLoopSuccess() {
        this.recordEscape();
        this.currentFailures = 0;
        // Remove nightmare overlay
        document.querySelector('.fixed.inset-0').remove();
        
        // Success message
        const success = document.createElement('div');
        success.className = 'fixed inset-0 bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center z-50';
        success.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">✨</div>
                <h2 class="text-3xl font-bold text-green-400 mb-4">LOOP BROKEN!</h2>
                <p class="text-xl text-gray-300 mb-6">You've escaped the nightmare... for now.</p>
                <div class="text-lg text-yellow-400 mb-6">
                    <div>Loops Survived: ${this.loopCount}</div>
                    <div>Nightmare Level: ${this.nightmareLevel}</div>
                    <div>Reward: +${this.loopCount * 10} Wisdom</div>
                </div>
                <button onclick="window.nightmare.endNightmare()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                    Return to Reality
                </button>
            </div>
        `;
        
        document.body.appendChild(success);
        
        // Big reward
        this.game.playerStats.wisdom += this.loopCount * 10;
        this.game.updateStats();
    }
    
    breakLoopFailure() {
        this.recordFailure();
        // Penalty
        this.drainSanity(20);
        
        // Shake screen
        document.body.style.animation = 'screenShake 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        // Show failure
        const failure = document.createElement('div');
        failure.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg z-50';
        failure.textContent = 'WRONG! The nightmare strengthens...';
        document.body.appendChild(failure);
        setTimeout(() => failure.remove(), 2000);
    }

    triggerMirroredSelf() {
        // Break reality before the scenario
        for (let i = 0; i < 6; i++) {
            setTimeout(() => this.createRealityTear(), i * 120);
        }
        this.createNightmareEntity();

        const questions = (Array.isArray(window.game.choices) && window.game.choices.length > 0)
            ? window.game.choices.slice(-5).map(c => {
                const label = typeof c === 'string' ? c : (c.text || c.description || JSON.stringify(c));
                return label;
            })
            : [
                'Do you seek power or surrender it?',
                'Have you loved what was made, or only its reflection?',
                'When the divine speaks, do you obey or question?',
                'Is faith a light you carry, or a light you chase?',
                'Would you repeat the loop, or destroy it?'
            ];

        const chosen = [];
        while (chosen.length < 3 && chosen.length < questions.length) {
            const idx = Math.floor(Math.random() * questions.length);
            if (!chosen.includes(idx)) chosen.push(idx);
        }

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="text-center max-w-2xl w-full mx-4">
                <div class="text-6xl mb-4 animate-pulse">🪞</div>
                <h2 class="text-3xl font-bold text-purple-400 mb-2">THE MIRRORED SELF</h2>
                <p class="text-xl text-gray-300 mb-6">Your reflection asks what you already know.</p>
                <div id="mirror-questions" class="space-y-4 text-left"></div>
                <div class="mt-6">
                    <button onclick="window.nightmare.submitMirrorAnswers()" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold">
                        Reveal Yourself
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const qContainer = overlay.querySelector('#mirror-questions');
        this.mirrorAnswers = {};

        chosen.forEach((qi, i) => {
            const qBlock = document.createElement('div');
            qBlock.className = 'bg-gray-900 bg-opacity-70 p-4 rounded-lg border border-purple-700';
            qBlock.innerHTML = `<div class="text-purple-300 font-bold mb-2">Question ${i + 1}: ${questions[qi]}</div>`;
            const choicesBlock = document.createElement('div');
            choicesBlock.className = 'grid grid-cols-2 gap-2 mt-2';
            ['Yes', 'No', 'I do not know', 'I refuse'].forEach(ans => {
                const btn = document.createElement('button');
                btn.className = 'bg-purple-800 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm';
                btn.textContent = ans;
                btn.onclick = () => {
                    choicesBlock.querySelectorAll('button').forEach(b => b.classList.replace('bg-purple-600', 'bg-purple-800'));
                    btn.classList.replace('bg-purple-800', 'bg-purple-600');
                    this.mirrorAnswers[i] = ans;
                };
                choicesBlock.appendChild(btn);
            });
            qBlock.appendChild(choicesBlock);
            qContainer.appendChild(qBlock);
        });
    }

    submitMirrorAnswers() {
        const total = Object.keys(this.mirrorAnswers).length;
        if (total < 3) {
            const warn = document.createElement('div');
            warn.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg z-50';
            warn.textContent = 'Answer all three questions before facing yourself.';
            document.body.appendChild(warn);
            setTimeout(() => warn.remove(), 2000);
            return;
        }

        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());

        const success = document.createElement('div');
        success.className = 'fixed inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center z-50';
        success.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🪞</div>
                <h2 class="text-3xl font-bold text-purple-300 mb-4">REFLECTION ACCEPTED</h2>
                <p class="text-xl text-gray-300 mb-6">The mirror shatters. Clarity pierces the loop.</p>
                <div class="text-lg text-yellow-400 mb-6">
                    <div>Boon: Clarity (+15 Wisdom, -1 Nightmare Level)</div>
                </div>
                <button onclick="window.nightmare.endNightmare()" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold">
                    Return to Reality
                </button>
            </div>
        `;
        document.body.appendChild(success);

        this.game.playerStats.wisdom = (this.game.playerStats.wisdom || 0) + 15;
        this.nightmareLevel = Math.max(1, (this.nightmareLevel || 1) - 1);
        this.game.updateStats();
        this.inNightmare = false;
        this.recordEscape();
        this.currentFailures = 0;
        this.endNightmare();
    }

    triggerUnmaking() {
        this.inUnmaking = true;
        this.unmakingStep = 0;
        this.maxUnmakingSteps = 5;
        this.showUnmakingOverlay();
        this.runUnmakingDecay();
    }

    showUnmakingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        overlay.id = 'unmaking-overlay';
        overlay.innerHTML = `
            <div class="text-center max-w-xl w-full mx-4">
                <div class="text-6xl mb-4 animate-pulse">🌑</div>
                <h2 class="text-3xl font-bold text-red-500 mb-2">THE UNMAKING</h2>
                <p class="text-xl text-gray-300 mb-2">Reality is being unwritten.</p>
                <div class="w-full bg-gray-800 rounded-full h-3 mb-4">
                    <div id="unmaking-bar" class="bg-red-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <div id="unmaking-stage" class="text-sm text-red-300 mb-4">Stage 1 of ${this.maxUnmakingSteps}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    runUnmakingDecay() {
        if (!this.inUnmaking) return;

        this.unmakingStep++;

        // Escalating visual decay each stage
        if (this.unmakingStep >= 1) {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => this.createRealityTear(), i * 90);
            }
            document.body.style.filter = `invert(${Math.min(100, 15 * this.unmakingStep)}%) hue-rotate(${30 * this.unmakingStep}deg)`;
        }
        if (this.unmakingStep >= 2) {
            this.showNightmareMessage();
        }
        if (this.unmakingStep >= 3) {
            this.createNightmareEntity();
        }
        if (this.unmakingStep >= 4) {
            document.body.style.animation = 'realityGlitch 0.4s infinite';
        }

        // Update progress
        const pct = Math.min(100, Math.round((this.unmakingStep / this.maxUnmakingSteps) * 100));
        const bar = document.getElementById('unmaking-bar');
        const stage = document.getElementById('unmaking-stage');
        if (bar) bar.style.width = pct + '%';
        if (stage) stage.textContent = `Stage ${this.unmakingStep} of ${this.maxUnmakingSteps}`;

        if (this.unmakingStep >= this.maxUnmakingSteps) {
            // Final stage: force loop-break puzzle
            this.createLoopBreakPuzzle();
        } else {
            setTimeout(() => this.runUnmakingDecay(), 2200);
        }
    }

    endUnmaking(success) {
        this.inUnmaking = false;
        document.querySelectorAll('#unmaking-overlay, .fixed.inset-0').forEach(el => el.remove());
        document.body.style.animation = '';
        document.body.style.filter = '';
        document.body.style.transform = '';

        if (success) {
            const msg = document.createElement('div');
            msg.className = 'fixed inset-0 bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center z-50';
            msg.innerHTML = `
                <div class="text-center">
                    <div class="text-6xl mb-4">🛡️</div>
                    <h2 class="text-3xl font-bold text-green-400 mb-4">THE UNMAKING HALTED</h2>
                    <p class="text-xl text-gray-300 mb-6">You stitched reality back together, thread by thread.</p>
                    <div class="text-lg text-yellow-400 mb-6">
                        <div>Reward: +20 Wisdom</div>
                    </div>
                    <button onclick="window.nightmare.endNightmare()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Return to Reality
                    </button>
                </div>
            `;
            document.body.appendChild(msg);
            this.game.playerStats.wisdom = (this.game.playerStats.wisdom || 0) + 20;
            this.game.updateStats();
            this.inNightmare = false;
            this.recordEscape();
            this.currentFailures = 0;
            this.endNightmare();
        } else {
            this.recordFailure();
            this.showNightmareEnd('The unmaking consumes all. The loop tightens.');
        }
    }

    endNightmare() {
        this.inNightmare = false;
        this.currentFailures = 0;
        
        // Remove nightmare UI
        document.getElementById('nightmare-ui').classList.add('hidden');
        
        // Remove overlays
        document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
        
        // Reset reality
        document.body.style.animation = '';
        document.body.style.filter = '';
        document.body.style.transform = '';
        
        // Remove nightmare audio
        const audio = document.getElementById('nightmare-audio');
        if (audio) audio.remove();
        
        // Clean up entities
        document.querySelectorAll('.text-6xl').forEach(el => el.remove());
        
        // Show achievement
        this.game.showAchievement('Nightmare Survivor', `Escaped loop ${this.loopCount}!`);
    }
    
    showNightmareEnd(message) {
        const type = this.determineEndingType();
        this.showNightmareEnding(type, message);
    }

    showNightmareEnding(type, message) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black flex items-center justify-center z-50';
        let icon = '💀';
        let title = 'NIGHTMARE CONSUMES';
        let titleColor = 'text-red-500';
        let btnClass = 'bg-red-600 hover:bg-red-700';
        let btnText = 'Face the Dawn';

        if (type === 'awakening') {
            icon = '✨';
            title = 'AWAKENING';
            titleColor = 'text-yellow-400';
            btnClass = 'bg-yellow-600 hover:bg-yellow-700';
            btnText = 'Embrace Truth';
        } else if (type === 'consumption') {
            icon = '🌑';
            title = 'CONSUMPTION';
            titleColor = 'text-purple-500';
            btnClass = 'bg-purple-600 hover:bg-purple-700';
            btnText = 'Dissolve';
        }

        overlay.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">${icon}</div>
                <h2 class="text-3xl font-bold ${titleColor} mb-4">${title}</h2>
                <p class="text-xl text-gray-300 mb-6">${message}</p>
                <button onclick="window.nightmare.endNightmare()" class="${btnClass} text-white px-8 py-3 rounded-lg font-bold">
                    ${btnText}
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
}

// Add nightmare CSS animations
const nightmareStyle = document.createElement('style');
nightmareStyle.textContent = `
    @keyframes realityGlitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-5px) skewX(2deg); }
        40% { transform: translateX(5px) skewX(-2deg); }
        60% { transform: translateX(-2px) skewX(1deg); }
        80% { transform: translateX(2px) skewX(-1deg); }
    }
    
    @keyframes tearExpand {
        0% { transform: scale(0, 1); opacity: 1; }
        100% { transform: scale(1, 1); opacity: 0; }
    }
    
    @keyframes screenGlitch {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    @keyframes intenseNightmare {
        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
        25% { filter: hue-rotate(90deg) brightness(1.2); }
        50% { filter: hue-rotate(180deg) brightness(0.8); }
        75% { filter: hue-rotate(270deg) brightness(1.1); }
    }
    
    @keyframes entityFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(nightmareStyle);

// Initialize nightmare system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.nightmareMode = new ChallengeMode(window.game);
        }
    }, 5000);
});
