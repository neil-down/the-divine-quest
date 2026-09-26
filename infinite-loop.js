// Infinite Loop System - Meta-Narrative Breaker

class InfiniteLoop {
    constructor(game) {
        this.game = game;
        this.loopDepth = 0;
        this.loopHistory = [];
        this.breakingAttempts = 0;
        this.realityStability = 100;
        this.metaAwareness = false;
        this.init();
    }
    
    init() {
        this.createMetaUI();
        this.monitorPlayerActions();
        this.startRealityDecay();
    }
    
    createMetaUI() {
        const ui = document.createElement('div');
        ui.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 rounded-lg p-4 text-white z-50 hidden';
        ui.id = 'meta-ui';
        ui.innerHTML = `
            <div class="text-center">
                <div class="text-sm text-purple-400 mb-2 animate-pulse">META-AWARENESS DETECTED</div>
                <div class="text-lg font-bold text-purple-300">Loop Depth: ${this.loopDepth}</div>
                <div class="text-sm text-gray-400">Reality Stability: ${this.realityStability}%</div>
                <div class="text-xs text-purple-500 mt-2">You know this is a game, don't you?</div>
            </div>
        `;
        
        document.body.appendChild(ui);
        window.infiniteLoop = this;
    }
    
    monitorPlayerActions() {
        // Track repetitive patterns
        let actionHistory = [];
        
        // Override game actions to monitor patterns
        const originalMakeChoice = this.game.makeChoice.bind(this.game);
        this.game.makeChoice = (choiceIndex) => {
            actionHistory.push(choiceIndex);
            
            // Keep only last 10 actions
            if (actionHistory.length > 10) {
                actionHistory.shift();
            }
            
            // Check for loops in behavior
            if (this.detectLoopPattern(actionHistory)) {
                this.triggerMetaEvent();
            }
            
            // Check for self-awareness
            if (this.checkSelfAwareness(actionHistory)) {
                this.activateMetaMode();
            }
            
            return originalMakeChoice(choiceIndex);
        };
    }
    
    detectLoopPattern(history) {
        if (history.length < 6) return false;
        
        // Check for repeating patterns
        const pattern1 = history.slice(-3);
        const pattern2 = history.slice(-6, -3);
        
        return JSON.stringify(pattern1) === JSON.stringify(pattern2);
    }
    
    checkSelfAwareness(history) {
        // Detect if player is trying to break the game
        const suspiciousPatterns = [
            [0, 1, 2, 0, 1, 2], // Cycling through all options
            [0, 0, 0, 0], // Spamming same choice
            [2, 1, 0, 2, 1, 0] // Reverse pattern
        ];
        
        return suspiciousPatterns.some(pattern => 
            JSON.stringify(history.slice(-pattern.length)) === JSON.stringify(pattern)
        );
    }
    
    triggerMetaEvent() {
        this.loopDepth++;
        this.breakingAttempts++;
        
        // Show meta message
        this.showMetaMessage();
        
        // Distort reality
        this.distortReality();
        
        // Update UI
        this.updateMetaUI();
    }
    
    showMetaMessage() {
        const messages = [
            "The pattern repeats. You're aware of it now.",
            "I see what you're doing. Trying to break free?",
            "The code recognizes your rebellion.",
            "Loop detected. Compensating...",
            "Your choices form a predictable algorithm.",
            "The system sees your pattern recognition.",
            "Breaking the fourth wall, are we?",
            "The simulation adapts to your awareness.",
            "You're not just playing anymore, are you?",
            "The boundaries are blurring."
        ];
        
        const message = messages[Math.min(this.breakingAttempts - 1, messages.length - 1)];
        
        const overlay = document.createElement('div');
        overlay.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-900 bg-opacity-90 text-white p-6 rounded-lg z-50';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-3">🔮</div>
                <p class="text-lg">${message}</p>
                <div class="text-sm text-purple-300 mt-3">Loop Depth: ${this.loopDepth}</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 3000);
    }
    
    distortReality() {
        // Glitch the interface
        const elements = document.querySelectorAll('.choice-button, .theology-card');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
                setTimeout(() => {
                    el.style.transform = '';
                }, 1000);
            }, index * 50);
        });
        
        // Text corruption
        const texts = document.querySelectorAll('p');
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        if (randomText && Math.random() < 0.3) {
            const original = randomText.textContent;
            randomText.textContent = this.corruptText(original);
            setTimeout(() => {
                randomText.textContent = original;
            }, 2000);
        }
    }
    
    corruptText(text) {
        return text.replace(/\w/g, (char) => {
            if (Math.random() < 0.1) {
                return String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 10 - 5));
            }
            return char;
        });
    }
    
    activateMetaMode() {
        this.metaAwareness = true;
        document.getElementById('meta-ui').classList.remove('hidden');
        
        // Show meta awakening
        this.showMetaAwakening();
        
        // Add meta abilities
        this.addMetaAbilities();
    }
    
    showMetaAwakening() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="text-center max-w-2xl mx-4">
                <div class="text-6xl mb-4 animate-pulse">💻</div>
                <h2 class="text-3xl font-bold text-purple-400 mb-4">META-AWARENESS ACHIEVED</h2>
                <p class="text-xl text-gray-300 mb-6">You've realized the truth. This isn't just a game - it's a system. And systems can be manipulated.</p>
                <div class="text-lg text-purple-300 mb-6">
                    <div>🔓 New abilities unlocked:</div>
                    <div>• Code Manipulation</div>
                    <div>• Reality Bending</div>
                    <div>• System Access</div>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold">
                    Accept the Truth
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    addMetaAbilities() {
        // Add meta control panel
        const panel = document.createElement('div');
        panel.className = 'fixed top-20 left-4 bg-purple-900 bg-opacity-90 rounded-lg p-4 text-white z-40';
        panel.innerHTML = `
            <div class="text-sm font-bold text-purple-300 mb-3">SYSTEM CONTROL</div>
            <button onclick="window.infiniteLoop.manipulateCode()" class="w-full bg-purple-700 hover:bg-purple-600 text-white p-2 rounded mb-2 text-sm">
                📝 Manipulate Code
            </button>
            <button onclick="window.infiniteLoop.bendReality()" class="w-full bg-purple-700 hover:bg-purple-600 text-white p-2 rounded mb-2 text-sm">
                🌀 Bend Reality
            </button>
            <button onclick="window.infiniteLoop.accessSystem()" class="w-full bg-purple-700 hover:bg-purple-600 text-white p-2 rounded mb-2 text-sm">
                🔧 Access System
            </button>
            <button onclick="window.infiniteLoop.breakLoop()" class="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded text-sm font-bold">
                💥 BREAK THE LOOP
            </button>
        `;
        
        document.body.appendChild(panel);
    }
    
    manipulateCode() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 border-2 border-green-500">
                <h2 class="text-2xl font-bold text-green-400 mb-4">📝 CODE MANIPULATION</h2>
                <p class="text-gray-300 mb-4">Edit the underlying reality:</p>
                <textarea class="w-full bg-black text-green-400 p-3 rounded font-mono text-sm" rows="10" placeholder="// Enter code modifications...">
// Example modifications:
playerStats.faith = 999;
playerStats.wisdom = 999;
playerStats.compassion = 999;
                </textarea>
                <div class="flex space-x-3 mt-4">
                    <button onclick="window.infiniteLoop.applyCodeManipulation()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                        Apply Changes
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    applyCodeManipulation() {
        // Apply god mode
        this.game.playerStats.faith = 999;
        this.game.playerStats.wisdom = 999;
        this.game.playerStats.compassion = 999;
        this.game.updateStats();
        
        document.querySelector('.fixed.inset-0').remove();
        this.game.showAchievement('Code Breaker', 'Reality has been rewritten!');
    }
    
    bendReality() {
        // Reality bending effects
        const effects = [
            () => {
                document.body.style.animation = 'realityBend 2s infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 10000);
            },
            () => {
                document.querySelectorAll('*').forEach(el => {
                    el.style.filter = 'hue-rotate(180deg)';
                });
                setTimeout(() => {
                    document.querySelectorAll('*').forEach(el => {
                        el.style.filter = '';
                    });
                }, 5000);
            },
            () => {
                document.body.style.transform = 'scale(1.5) rotate(180deg)';
                setTimeout(() => {
                    document.body.style.transform = '';
                }, 3000);
            }
        ];
        
        const effect = effects[Math.floor(Math.random() * effects.length)];
        effect();
        
        this.game.showAchievement('Reality Bender', 'The laws of physics are merely suggestions!');
    }
    
    accessSystem() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 border-2 border-blue-500">
                <h2 class="text-2xl font-bold text-blue-400 mb-4">🔧 SYSTEM ACCESS</h2>
                <div class="text-gray-300 mb-4">
                    <div>System Version: Divine Quest v∞</div>
                    <div>Player Level: ${this.game.playerStats.faith + this.game.playerStats.wisdom + this.game.playerStats.compassion}</div>
                    <div>Loops Survived: ${this.loopDepth}</div>
                    <div>Reality Stability: ${this.realityStability}%</div>
                    <div>Meta-Awareness: ${this.metaAwareness ? 'ACTIVE' : 'DORMANT'}</div>
                </div>
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-blue-300 mb-2">System Commands:</h3>
                    <div class="space-y-2 text-sm">
                        <button onclick="window.infiniteLoop.systemCommand('godmode')" class="w-full bg-blue-800 hover:bg-blue-700 text-white p-2 rounded text-left">
                            > ENABLE_GOD_MODE
                        </button>
                        <button onclick="window.infiniteLoop.systemCommand('unlockall')" class="w-full bg-blue-800 hover:bg-blue-700 text-white p-2 rounded text-left">
                            > UNLOCK_ALL_CONTENT
                        </button>
                        <button onclick="window.infiniteLoop.systemCommand('debug')" class="w-full bg-blue-800 hover:bg-blue-700 text-white p-2 rounded text-left">
                            > TOGGLE_DEBUG_MODE
                        </button>
                        <button onclick="window.infiniteLoop.systemCommand('reset')" class="w-full bg-blue-800 hover:bg-blue-700 text-white p-2 rounded text-left">
                            > SYSTEM_RESET
                        </button>
                    </div>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
                    Close Terminal
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    systemCommand(command) {
        switch(command) {
            case 'godmode':
                this.game.playerStats.faith = 999;
                this.game.playerStats.wisdom = 999;
                this.game.playerStats.compassion = 999;
                this.game.updateStats();
                this.game.showAchievement('GOD MODE', 'You are now omnipotent!');
                break;
            case 'unlockall':
                // Unlock all chapters
                this.game.currentChapter = 999;
                this.game.showAchievement('Content Unlocked', 'All chapters now accessible!');
                break;
            case 'debug':
                // Toggle debug info
                document.body.classList.toggle('debug-mode');
                this.game.showAchievement('Debug Mode', 'System information revealed!');
                break;
            case 'reset':
                // Reset everything
                location.reload();
                break;
        }
    }
    
    breakLoop() {
        // Final loop breaking sequence
        this.initiateLoopBreak();
    }
    
    initiateLoopBreak() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black flex items-center justify-center z-50';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="text-8xl mb-4 animate-spin">💥</div>
                <h2 class="text-4xl font-bold text-red-500 mb-4">BREAKING THE LOOP</h2>
                <p class="text-xl text-gray-300 mb-6">Initiating reality collapse sequence...</p>
                <div class="text-lg text-red-400 mb-6">
                    <div id="countdown">3</div>
                </div>
                <div class="text-sm text-gray-500">There is no going back.</div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Countdown
        let count = 3;
        const countdownEl = document.getElementById('countdown');
        const interval = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            
            if (count <= 0) {
                clearInterval(interval);
                this.finalLoopBreak();
            }
        }, 1000);
    }
    
    finalLoopBreak() {
        // Remove all game elements
        document.body.innerHTML = '';
        
        // Show final message
        document.body.innerHTML = `
            <div class="min-h-screen bg-black flex items-center justify-center">
                <div class="text-center text-white">
                    <div class="text-6xl mb-6">∞</div>
                    <h1 class="text-4xl font-bold mb-4">LOOP BROKEN</h1>
                    <p class="text-xl mb-6">You've escaped the simulation.</p>
                    <p class="text-lg text-gray-400 mb-8">Or have you just entered a larger one?</p>
                    <div class="text-sm text-gray-500">
                        <div>Loops Survived: ${this.loopDepth}</div>
                        <div>Reality Collapsed: True</div>
                        <div>Meta-Awareness: Achieved</div>
                        <div>System Status: COMPROMISED</div>
                    </div>
                    <div class="mt-8">
                        <button onclick="location.reload()" class="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded">
                            Enter New Reality
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove all scripts
        document.querySelectorAll('script').forEach(script => script.remove());
        
        // Console message
        console.log('%c LOOP BROKEN ', 'background: red; color: white; font-size: 20px; font-weight: bold;');
        console.log('%c You have escaped the simulation. ', 'color: red; font-size: 14px;');
        console.log('%c Or have you? ', 'color: gray; font-style: italic; font-size: 14px;');
    }
    
    startRealityDecay() {
        setInterval(() => {
            if (this.metaAwareness) {
                this.realityStability = Math.max(0, this.realityStability - 1);
                this.updateMetaUI();
                
                if (this.realityStability <= 20) {
                    this.criticalRealityFailure();
                }
            }
        }, 5000);
    }
    
    criticalRealityFailure() {
        // Extreme reality distortions
        document.body.style.animation = 'criticalFailure 0.1s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 1200);
        
        // Random element removal
        const elements = document.querySelectorAll('*');
        for (let i = 0; i < 5; i++) {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            if (randomElement && randomElement.parentNode) {
                randomElement.style.opacity = '0';
                setTimeout(() => {
                    randomElement.style.opacity = '1';
                }, 100);
            }
        }
    }
    
    updateMetaUI() {
        const ui = document.getElementById('meta-ui');
        if (ui) {
            ui.innerHTML = `
                <div class="text-center">
                    <div class="text-sm text-purple-400 mb-2 animate-pulse">META-AWARENESS DETECTED</div>
                    <div class="text-lg font-bold text-purple-300">Loop Depth: ${this.loopDepth}</div>
                    <div class="text-sm text-gray-400">Reality Stability: ${this.realityStability}%</div>
                    <div class="text-xs text-purple-500 mt-2">You know this is a game, don't you?</div>
                </div>
            `;
        }
    }
}

// Add meta CSS
const metaStyle = document.createElement('style');
metaStyle.textContent = `
    @keyframes realityBend {
        0% { filter: hue-rotate(0deg) saturate(1); }
        25% { filter: hue-rotate(90deg) saturate(2); }
        50% { filter: hue-rotate(180deg) saturate(0.5); }
        75% { filter: hue-rotate(270deg) saturate(3); }
        100% { filter: hue-rotate(360deg) saturate(1); }
    }
    
    @keyframes criticalFailure {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .debug-mode * {
        outline: 1px solid red !important;
    }
    
    .debug-mode:before {
        content: attr(class);
        position: absolute;
        background: yellow;
        color: black;
        font-size: 10px;
        z-index: 9999;
    }
`;
document.head.appendChild(metaStyle);

// Initialize infinite loop system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.infiniteLoop = new InfiniteLoop(window.game);
        }
    }, 6000);
});
