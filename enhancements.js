// Enhanced Gameplay Features for The Divine Quest

// matchMedia polyfill: jsdom (headless tests) lacks it, and older browsers
// may too. Reduced-motion + hover media queries degrade to false.
if (!window.matchMedia) {
    window.matchMedia = function (query) {
        return {
            matches: false,
            media: query,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent() { return false; }
        };
    };
}

class EnhancedGameplay {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.ambientEffects = true;
        this.soundEnabled = false;
        this.init();
    }
    
    init() {
        this.createAmbientParticles();
        this.addKeyboardNavigation();
        this.addDynamicBackground();
        this.createDivinePresence();
        this.addTouchSupport();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this._syncReducedMotionClass();
        this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this._motionQuery.addEventListener('change', () => this._syncReducedMotionClass());
        this._observeDynamicInteractives();
    }

    _observeDynamicInteractives() {
        const interactiveSelectors = '.rune-tile, .symbol-tile, [data-row][data-col], #loop-puzzle > div, .nightmare-entity, [onclick]';
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    if (node.matches && node.matches(interactiveSelectors)) {
                        this._ensureFocusable(node);
                    }
                    const descendants = node.querySelectorAll && node.querySelectorAll(interactiveSelectors);
                    if (descendants) {
                        descendants.forEach(el => this._ensureFocusable(el));
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    _ensureFocusable(el) {
        if (el.hasAttribute('tabindex')) return;
        if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') return;
        el.setAttribute('tabindex', '0');
        if (!el.getAttribute('role')) {
            el.setAttribute('role', 'button');
        }
    }

    _syncReducedMotionClass() {
        const motionMatches = (this._motionQuery && this._motionQuery.matches) || this.prefersReducedMotion;
        if (motionMatches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    createAmbientParticles() {
        if (this.prefersReducedMotion) return;
        const particleContainer = document.createElement('div');
        particleContainer.className = 'divine-particles';
        particleContainer.id = 'particles';
        document.body.appendChild(particleContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
        
        // Continuously generate particles
        setInterval(() => {
            if (this.particles.length < 15) {
                this.createParticle();
            }
        }, 3000);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        const container = document.getElementById('particles');
        if (container) {
            container.appendChild(particle);
            this.particles.push(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
                this.particles = this.particles.filter(p => p !== particle);
            }, 20000);
        }
    }
    
    addKeyboardNavigation() {
        // Number keys 1-3 for story choices
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '3') {
                const choiceIndex = parseInt(e.key) - 1;
                const choices = document.querySelectorAll('.choice-button');
                if (choices[choiceIndex]) {
                    choices[choiceIndex].click();
                }
            }
        });

        // Enter/Space activation for any focusable non-button element
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && document.activeElement) {
                const el = document.activeElement;
                // If it's a button, input, select, textarea, or has role=button, let the browser handle it
                if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.getAttribute('role') === 'button' || el.getAttribute('role') === 'switch') {
                    return;
                }
                // For tabindex elements that look interactive (rune tiles, symbol tiles, pattern cells, etc.)
                if (el.hasAttribute('tabindex') && (el.classList.contains('rune-tile') || el.classList.contains('symbol-tile') || el.hasAttribute('data-row') || el.classList.contains('verse-fragment-btn') || el.classList.contains('nightmare-entity') || el.closest('#loop-puzzle'))) {
                    e.preventDefault();
                    el.click();
                }
            }
        });
    }

    addTouchSupport() {
        // Detect touch-capable devices and add body class for CSS targeting
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia('(hover: none)').matches);
        if (isTouch) {
            document.body.classList.add('touch');
        }

        // Apply touch-action to choice buttons to prevent 300ms delay / double-tap zoom
        document.querySelectorAll('.choice-button').forEach(btn => {
            btn.style.touchAction = 'manipulation';
        });

        let touchStartX = 0;
        let touchStartY = 0;
        const choicesContainer = document.getElementById('choices-container');

        if (!choicesContainer) {
            return;
        }

        choicesContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        choicesContainer.addEventListener('touchend', (e) => {
            if (!touchStartX && !touchStartY) {
                return;
            }

            const touch = e.changedTouches[0];
            if (!touch) {
                return;
            }

            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            const choices = Array.from(document.querySelectorAll('.choice-button'));
            const activeIndex = choices.findIndex((btn) => btn.classList.contains('touch-active'));
            let targetIndex = activeIndex >= 0 ? activeIndex : -1;

            if (absDeltaX < 10 && absDeltaY < 10) {
                // Tap
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                const choice = element ? element.closest('.choice-button') : null;
                if (choice) {
                    choice.click();
                }
                choices.forEach((btn) => btn.classList.remove('touch-active'));
                return;
            }

            if (absDeltaX > absDeltaY && absDeltaX > 50) {
                if (deltaX < 0 && targetIndex < choices.length - 1) {
                    targetIndex++;
                } else if (deltaX > 0 && targetIndex > 0) {
                    targetIndex--;
                } else {
                    return;
                }

                choices.forEach((btn) => btn.classList.remove('touch-active'));
                if (choices[targetIndex]) {
                    choices[targetIndex].classList.add('touch-active');
                    choices[targetIndex].click();
                }
            }
        });
    }
    
    addDynamicBackground() {
        if (this.prefersReducedMotion) return;
        let hue = 250;
        setInterval(() => {
            hue = (hue + 0.5) % 360;
            if (this.ambientEffects) {
                document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 30%) 0%, hsl(${(hue + 30) % 360}, 70%, 40%) 50%, hsl(${(hue + 60) % 360}, 70%, 50%) 100%)`;
            }
        }, 100);
    }
    
    createDivinePresence() {
        if (this.prefersReducedMotion) return;
        const presence = document.createElement('div');
        presence.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30';
        presence.innerHTML = `
            <div class="w-32 h-32 rounded-full opacity-20 animate-pulse" 
                 style="background: radial-gradient(circle, rgba(255, 215, 0, 0.4), transparent);">
            </div>
        `;
        presence.id = 'divine-presence';
        document.body.appendChild(presence);
        
        // Subtle movement
        setInterval(() => {
            const x = 50 + (Math.sin(Date.now() / 3000) * 10);
            const y = 50 + (Math.cos(Date.now() / 4000) * 5);
            presence.style.left = x + '%';
            presence.style.top = y + '%';
        }, 50);
    }
    
    addRitualMechanic() {
        // Add prayer/meditation mini-game
        const ritualButton = document.createElement('button');
        ritualButton.id = 'ritual-button';
        ritualButton.className = 'fixed bottom-32 left-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40';
        ritualButton.innerHTML = '<i class="fas fa-spa text-xl"></i>';
        ritualButton.title = 'Enter Prayer Meditation';
        
        ritualButton.onclick = () => this.startPrayerMeditation();
        document.body.appendChild(ritualButton);
    }
    
    startPrayerMeditation() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-xl p-8 max-w-md text-center">
                <h3 class="text-2xl font-bold mb-4 text-purple-800">Prayer Meditation</h3>
                <p class="mb-6 text-gray-700">Focus your mind and connect with the divine. Click the orbs as they appear to center your spirit.</p>
                <div id="meditation-area" class="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-6">
                    <!-- Meditation orbs will appear here -->
                </div>
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.runMeditationGame();
    }
    
    runMeditationGame() {
        const area = document.getElementById('meditation-area');
        let score = 0;
        let focus = 50;
        let timeLeft = 30;
        
        // Breathing visualizer - 4-7-8 rhythm circle
        const breathingCircle = document.createElement('div');
        breathingCircle.className = 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full pointer-events-none';
        breathingCircle.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.25), rgba(59, 130, 246, 0.1))';
        breathingCircle.style.transform = 'translate(-50%, -50%) scale(1)';
        breathingCircle.style.opacity = '0.3';
        area.appendChild(breathingCircle);
        
        let breathPhase = 0;
        const breathTick = setInterval(() => {
            if (timeLeft <= 0) { clearInterval(breathTick); return; }
            breathPhase = (breathPhase + 0.1) % 19;
            let scale, opacity;
            if (breathPhase < 4) {
                scale = 1 + (breathPhase / 4) * 0.5;
                opacity = 0.3 + (breathPhase / 4) * 0.3;
            } else if (breathPhase < 11) {
                scale = 1.5;
                opacity = 0.6;
            } else {
                const t = (breathPhase - 11) / 8;
                scale = 1.5 - t * 0.5;
                opacity = 0.6 - t * 0.3;
            }
            breathingCircle.style.transform = `translate(-50%, -50%) scale(${scale})`;
            breathingCircle.style.opacity = opacity;
        }, 100);
        
        const timer = document.createElement('div');
        timer.className = 'absolute top-2 right-2 text-purple-800 font-bold';
        timer.textContent = `Time: ${timeLeft}`;
        area.appendChild(timer);
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'absolute top-2 left-2 text-purple-800 font-bold';
        scoreDisplay.textContent = `Focus: ${score}`;
        area.appendChild(scoreDisplay);
        
        // Focus / Stillness meter
        const focusText = document.createElement('div');
        focusText.className = 'absolute bottom-5 left-2 text-xs text-purple-700 font-bold';
        focusText.textContent = `Stillness: ${focus}`;
        area.appendChild(focusText);
        
        const focusMeter = document.createElement('div');
        focusMeter.className = 'absolute bottom-2 left-2 right-2 h-3 bg-purple-100 rounded-full overflow-hidden';
        const focusFill = document.createElement('div');
        focusFill.className = 'h-full bg-purple-500 rounded-full transition-all duration-300';
        focusFill.style.width = focus + '%';
        focusMeter.appendChild(focusFill);
        area.appendChild(focusMeter);
        
        const focusDecay = setInterval(() => {
            if (timeLeft <= 0) return;
            focus = Math.max(0, focus - 1);
            focusFill.style.width = focus + '%';
            focusText.textContent = `Stillness: ${focus}`;
        }, 1500);
        
        const gameInterval = setInterval(() => {
            timeLeft--;
            timer.textContent = `Time: ${timeLeft}`;
            
            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                clearInterval(focusDecay);
                clearInterval(breathTick);
                this._meditationFocus = focus;
                this.endMeditation(score);
            } else {
                // Create meditation orb
                const orb = document.createElement('div');
                orb.className = 'absolute w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full cursor-pointer hover:scale-110 transition-transform';
                orb.style.left = Math.random() * 80 + 10 + '%';
                orb.style.top = Math.random() * 80 + 10 + '%';
                orb.setAttribute('tabindex', '0');
                orb.setAttribute('role', 'button');
                orb.setAttribute('aria-label', 'Meditation orb');
                
                orb.onclick = () => {
                    score += 5;
                    focus = Math.min(100, focus + 3);
                    scoreDisplay.textContent = `Focus: ${score}`;
                    focusFill.style.width = focus + '%';
                    focusText.textContent = `Stillness: ${focus}`;
                    orb.remove();
                    
                    // Add visual feedback
                    const feedback = document.createElement('div');
                    feedback.className = 'absolute text-purple-600 font-bold text-xl';
                    feedback.textContent = '+5';
                    feedback.style.left = orb.style.left;
                    feedback.style.top = orb.style.top;
                    area.appendChild(feedback);
                    
                    setTimeout(() => feedback.remove(), 1000);
                };

                orb.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        orb.click();
                    }
                });
                
                area.appendChild(orb);
                
                // Remove orb after 2 seconds if not clicked
                setTimeout(() => {
                    if (orb.parentNode) {
                        orb.remove();
                    }
                }, 2000);
            }
        }, 1000);
    }
    
    endMeditation(score) {
        const area = document.getElementById('meditation-area');
        if (!area) return;
        const focus = this._meditationFocus || 0;
        area.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full">
                <div class="text-6xl mb-4">${score >= 100 ? '🌟' : score >= 50 ? '✨' : '🙏'}</div>
                <div class="text-2xl font-bold text-purple-800 mb-2">Meditation Complete</div>
                <div class="text-lg text-gray-700 mb-4">Focus Level: ${score} | Stillness: ${focus}</div>
                <div class="text-sm text-gray-600">
                    ${score >= 100 ? 'Profound spiritual insight gained!' : 
                      score >= 50 ? 'Your spirit feels centered and calm.' : 
                      'Continue practicing to deepen your connection.'}
                </div>
            </div>
        `;
        
        // Apply bonus to player stats
        if (score >= 100) {
            this.game.playerStats.faith += 5;
            this.game.playerStats.wisdom += 5;
            this.game.playerStats.compassion += 3;
        } else if (score >= 50) {
            this.game.playerStats.faith += 2;
            this.game.playerStats.wisdom += 2;
        }
        
        // Stillness completion bonus
        if (focus >= 50) {
            this.game.playerStats.faith += 3;
            this.game.playerStats.wisdom += 3;
        }
        
        this.game.updateStats();
    }
    
    addDivineIntervention() {
        // Random divine events
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 10 seconds
                this.triggerDivineEvent();
            }
        }, 10000);
    }
    
    triggerDivineEvent() {
        const events = [
            {
                title: "Divine Whisper",
                message: "A gentle voice reminds you: 'You are on the right path.'",
                effect: { faith: 2, wisdom: 1, compassion: 1 }
            },
            {
                title: "Sacred Sign", 
                message: "You notice a pattern of light forming ancient symbols in the air.",
                effect: { faith: 3, wisdom: 2, compassion: 0 }
            },
            {
                title: "Compassion Wave",
                message: "You feel an overwhelming urge to help those around you.",
                effect: { faith: 1, wisdom: 0, compassion: 3 }
            }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-2xl z-50 max-w-sm text-center';
        notification.innerHTML = `
            <div class="text-3xl mb-3">✨</div>
            <h4 class="font-bold text-lg mb-2">${event.title}</h4>
            <p class="text-sm opacity-90 mb-4">${event.message}</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100">
                Accept the blessing
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Apply effects
        setTimeout(() => {
            this.game.playerStats.faith += event.effect.faith;
            this.game.playerStats.wisdom += event.effect.wisdom;
            this.game.playerStats.compassion += event.effect.compassion;
            this.game.updateStats();
        }, 1000);
    }
}

// Initialize enhancements when game loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            const enhanced = new EnhancedGameplay(window.game);
            enhanced.addRitualMechanic();
            enhanced.addDivineIntervention();
        }
    }, 1000);
});
