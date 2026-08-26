// Puzzle System for The Divine Quest

class DivinePuzzles {
    constructor(game) {
        this.game = game;
        this.currentPuzzle = null;
        this.puzzles = this.initPuzzles();
        this.solvedPuzzles = [];
    }
    
    initPuzzles() {
        return [
            {
                id: 'ancient_runes',
                name: 'Ancient Divine Runes',
                description: 'Arrange the sacred runes in the correct order to unlock divine wisdom',
                type: 'sequence',
                difficulty: 'easy',
                solution: ['faith', 'wisdom', 'compassion'],
                runes: ['faith', 'wisdom', 'compassion', 'love', 'hope', 'charity'],
                reward: { wisdom: 15, faith: 10 }
            },
            {
                id: 'moral_dilemma',
                name: 'The Moral Dilemma',
                description: 'Choose the most compassionate path in this complex ethical situation',
                type: 'choice',
                difficulty: 'medium',
                scenario: 'You see a starving person steal bread to feed their family. The shopkeeper will lose their livelihood. What do you do?',
                options: [
                    { text: 'Punish the thief to uphold justice', effect: { faith: 5, wisdom: 10, compassion: -10 } },
                    { text: 'Help the thief and pay the shopkeeper', effect: { faith: 10, wisdom: 5, compassion: 20 } },
                    { text: 'Teach both about forgiveness and community', effect: { faith: 15, wisdom: 15, compassion: 15 } }
                ],
                reward: { compassion: 20, wisdom: 10 }
            },
            {
                id: 'scripture_cipher',
                name: 'Sacred Scripture Cipher',
                description: 'Decode the hidden message in this ancient text',
                type: 'cipher',
                difficulty: 'hard',
                cipher: 'Vg\'f gur terng rabhtu gb gel naq gel ntnva.',
                solution: 'It\'s the best thing to try and try again.',
                hint: 'The letters have shifted in the alphabet',
                reward: { wisdom: 25, faith: 15 }
            },
            {
                id: 'light_pattern',
                name: 'Divine Light Pattern',
                description: 'Recreate the sacred pattern of divine light',
                type: 'pattern',
                difficulty: 'medium',
                pattern: [
                    [1, 0, 1],
                    [0, 1, 0],
                    [1, 0, 1]
                ],
                reward: { faith: 20, compassion: 10 }
            },
            {
                id: 'prayer_math',
                name: 'Mathematics of Prayer',
                description: 'Solve this divine mathematical puzzle',
                type: 'math',
                difficulty: 'easy',
                question: 'If 3 prayers grant 5 blessings, and 7 prayers grant 12 blessings, how many blessings do 10 prayers grant?',
                solution: '17',
                explanation: 'Pattern: blessings = prayers + 2, so 10 + 7 = 17',
                reward: { wisdom: 20 }
            },
            {
                id: 'parable_riddle',
                name: 'The Parable of Hidden Light',
                description: 'Answer this ancient riddle to uncover divine wisdom',
                type: 'riddle',
                difficulty: 'medium',
                riddle: 'I have no wings, yet I fly. I have no voice, yet I teach truth. I have no gold, yet I am more precious than rubies. What am I?',
                options: [
                    { text: 'A golden crown worn by kings', correct: false },
                    { text: 'Wisdom gifted from above', correct: true },
                    { text: 'A silent stone from the temple', correct: false }
                ],
                hint: 'The answer lies not in earthly riches, but in heavenly gifts...',
                reward: { wisdom: 20, faith: 10 }
            },
            {
                id: 'creation_memory',
                name: 'Recalling the Order of Creation',
                description: 'Memorize the divine sequence and reproduce it to unlock wisdom',
                type: 'sequence_memory',
                difficulty: 'hard',
                symbols: ['🌅', '🌊', '🌿', '⭐', '🔥'],
                sequence: [0, 1, 2, 3, 4],
                reward: { wisdom: 30, faith: 20 }
            }
        ];
    }
    
    startRandomPuzzle() {
        if (this.currentPuzzle) return;
        
        const availablePuzzles = this.puzzles.filter(p => !this.solvedPuzzles.includes(p.id));
        if (availablePuzzles.length === 0) return;
        
        const puzzle = availablePuzzles[Math.floor(Math.random() * availablePuzzles.length)];
        this.currentPuzzle = puzzle;
        this.showPuzzle(puzzle);
    }
    
    showPuzzle(puzzle) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50';
        overlay.id = 'puzzle-overlay';
        
        let puzzleContent = '';
        
        switch(puzzle.type) {
            case 'sequence':
                puzzleContent = this.createSequencePuzzle(puzzle);
                break;
            case 'choice':
                puzzleContent = this.createChoicePuzzle(puzzle);
                break;
            case 'cipher':
                puzzleContent = this.createCipherPuzzle(puzzle);
                break;
            case 'pattern':
                puzzleContent = this.createPatternPuzzle(puzzle);
                break;
            case 'math':
                puzzleContent = this.createMathPuzzle(puzzle);
                break;
            case 'riddle':
                puzzleContent = this.createRiddlePuzzle(puzzle);
                break;
            case 'sequence_memory':
                puzzleContent = this.createSequenceMemoryPuzzle(puzzle);
                break;
        }
        
        overlay.innerHTML = `
            <div class="bg-black bg-opacity-80 rounded-2xl p-8 max-w-3xl w-full mx-4 border-2 border-yellow-500 shadow-2xl">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold text-yellow-400 mb-2">🧩 Divine Puzzle</h2>
                    <h3 class="text-xl text-white mb-2">${puzzle.name}</h3>
                    <p class="text-gray-300">${puzzle.description}</p>
                    <div class="mt-2 text-sm text-yellow-300">Difficulty: ${puzzle.difficulty}</div>
                </div>
                
                ${puzzleContent}
                
                <div class="flex justify-center space-x-4 mt-6">
                    <button onclick="window.puzzles.getHint()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        💡 Get Hint (-5 Wisdom)
                    </button>
                    <button onclick="window.puzzles.closePuzzle()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                        ❌ Close Puzzle
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        window.puzzles = this;
    }
    
    createSequencePuzzle(puzzle) {
        const shuffled = [...puzzle.runes].sort(() => Math.random() - 0.5);
        
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-4">
                    <p class="text-gray-300 mb-4">Arrange the runes in the correct divine order:</p>
                    <div class="flex justify-center space-x-2 mb-6" id="rune-container">
                        ${shuffled.map((rune, index) => `
                            <div class="rune-tile bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg cursor-pointer transform transition-all hover:scale-105" 
                                 data-rune="${rune}" onclick="window.puzzles.selectRune('${rune}')">
                                <div class="text-2xl mb-1">${this.getRuneEmoji(rune)}</div>
                                <div class="text-sm capitalize">${rune}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-center space-x-2" id="sequence-display">
                        ${puzzle.solution.map((_, index) => `
                            <div class="w-20 h-20 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center" id="slot-${index}">
                                <div class="text-gray-500 text-3xl">?</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="text-center">
                    <button onclick="window.puzzles.checkSequence()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Submit Solution
                    </button>
                </div>
            </div>
        `;
    }
    
    createChoicePuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <p class="text-lg text-gray-200 mb-6 italic">"${puzzle.scenario}"</p>
                    <div class="space-y-3">
                        ${puzzle.options.map((option, index) => `
                            <button onclick="window.puzzles.makeChoice(${index})" class="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-all">
                                <div class="font-bold">${String.fromCharCode(65 + index)}. ${option.text}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    createCipherPuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <p class="text-gray-300 mb-4">Decode this sacred message:</p>
                    <div class="bg-black p-4 rounded-lg mb-4">
                        <p class="text-xl font-mono text-yellow-400">${puzzle.cipher}</p>
                    </div>
                    <input type="text" id="cipher-answer" placeholder="Enter decoded message..." 
                           class="w-full bg-gray-700 text-white p-3 rounded-lg text-center">
                </div>
                <div class="text-center">
                    <button onclick="window.puzzles.checkCipher()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Submit Solution
                    </button>
                </div>
            </div>
        `;
    }
    
    createPatternPuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <p class="text-gray-300 mb-4">Recreate this divine light pattern:</p>
                    <div class="flex justify-center mb-6">
                        <div class="bg-black p-4 rounded-lg">
                            ${puzzle.pattern.map(row => `
                                <div class="flex">
                                    ${row.map(cell => `
                                        <div class="w-8 h-8 m-1 ${cell ? 'bg-yellow-400' : 'bg-gray-600'} rounded"></div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <div class="bg-black p-4 rounded-lg" id="pattern-grid">
                            ${[0, 1, 2].map(row => `
                                <div class="flex">
                                    ${[0, 1, 2].map(col => `
                                        <div class="w-8 h-8 m-1 bg-gray-600 rounded cursor-pointer hover:bg-gray-500" 
                                             data-row="${row}" data-col="${col}"
                                             onclick="window.puzzles.togglePattern(${row}, ${col})"></div>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="text-center">
                    <button onclick="window.puzzles.checkPattern()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Submit Solution
                    </button>
                </div>
            </div>
        `;
    }
    
    createMathPuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <p class="text-lg text-gray-200 mb-6">${puzzle.question}</p>
                    <input type="number" id="math-answer" placeholder="Enter your answer..." 
                           class="w-full bg-gray-700 text-white p-3 rounded-lg text-center text-2xl">
                </div>
                <div class="text-center">
                    <button onclick="window.puzzles.checkMath()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Submit Solution
                    </button>
                </div>
            </div>
        `;
    }
    
    createRiddlePuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-4">📜</div>
                    <p class="text-lg text-gray-200 mb-6 italic">"${puzzle.riddle}"</p>
                    <div class="space-y-3">
                        ${puzzle.options.map((option, index) => `
                            <button onclick="window.puzzles.checkRiddle(${index})" class="w-full text-left bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-lg transition-all">
                                <div class="font-bold">${String.fromCharCode(65 + index)}. ${option.text}</div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    createSequenceMemoryPuzzle(puzzle) {
        return `
            <div class="bg-gray-800 rounded-lg p-6">
                <div class="text-center mb-6">
                    <p class="text-gray-300 mb-4">Memorize the divine sequence, then reproduce it in the correct order:</p>
                    <div id="memory-display" class="flex justify-center space-x-2 mb-6 min-h-[80px] items-center">
                        <div class="text-gray-500 text-2xl">Press "Show Sequence" to begin</div>
                    </div>
                    <button id="memory-play-btn" onclick="window.puzzles.playSequence()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-6">
                        Show Sequence
                    </button>
                    <div class="flex justify-center space-x-2 mb-6" id="memory-input">
                        ${puzzle.symbols.map((symbol, index) => `
                            <div class="symbol-tile bg-purple-600 hover:bg-purple-700 text-white w-16 h-16 flex items-center justify-center rounded-lg cursor-pointer text-3xl transform transition-all hover:scale-105"
                                 data-index="${index}" data-symbol="${symbol}" onclick="window.puzzles.selectSymbol(${index})">
                                ${symbol}
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-center space-x-2 mb-6" id="player-sequence-display">
                        ${puzzle.sequence.map((_, i) => `
                            <div class="w-16 h-16 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center" id="memory-slot-${i}">
                                <div class="text-gray-500 text-3xl">?</div>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="window.puzzles.checkSequenceMemory()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                        Submit Sequence
                    </button>
                </div>
            </div>
        `;
    }
    
    getRuneEmoji(rune) {
        const emojis = {
            faith: '🙏',
            wisdom: '📚',
            compassion: '❤️',
            love: '💕',
            hope: '🌟',
            charity: '🤝'
        };
        return emojis[rune] || '✨';
    }
    
    selectRune(rune) {
        const slots = document.querySelectorAll('#sequence-display > div');
        const emptySlot = Array.from(slots).find(slot => slot.textContent === '?');
        
        if (emptySlot) {
            emptySlot.innerHTML = `<div class="text-2xl">${this.getRuneEmoji(rune)}</div>`;
            emptySlot.dataset.rune = rune;
            
            // Hide selected rune
            const runeTile = document.querySelector(`[data-rune="${rune}"]`);
            if (runeTile) {
                runeTile.style.opacity = '0.3';
                runeTile.style.pointerEvents = 'none';
            }
        }
    }
    
    checkSequence() {
        const slots = document.querySelectorAll('#sequence-display > div');
        const sequence = Array.from(slots).map(slot => slot.dataset.rune || '');
        
        if (sequence.join(',') === this.currentPuzzle.solution.join(',')) {
            this.solvePuzzle();
        } else {
            this.showError('Incorrect sequence. Try again!');
        }
    }
    
    makeChoice(choiceIndex) {
        const choice = this.currentPuzzle.options[choiceIndex];
        const effect = choice.effect;
        
        // Apply effects
        this.game.playerStats.faith += effect.faith;
        this.game.playerStats.wisdom += effect.wisdom;
        this.game.playerStats.compassion += effect.compassion;
        this.game.updateStats();
        
        // Best choice gives full reward
        if (choiceIndex === 2) { // The compassionate option
            this.solvePuzzle();
        } else {
            this.showPartialReward('You chose wisely, but there was a more compassionate path.');
        }
    }
    
    checkCipher() {
        const answer = document.getElementById('cipher-answer').value.toLowerCase().trim();
        if (answer === this.currentPuzzle.solution.toLowerCase()) {
            this.solvePuzzle();
        } else {
            this.showError('Incorrect decoding. Try again!');
        }
    }
    
    togglePattern(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('bg-yellow-400')) {
            cell.classList.remove('bg-yellow-400');
            cell.classList.add('bg-gray-600');
        } else {
            cell.classList.remove('bg-gray-600');
            cell.classList.add('bg-yellow-400');
        }
    }
    
    checkPattern() {
        const cells = document.querySelectorAll('#pattern-grid > div > div');
        const pattern = [];
        
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const cell = cells[i];
            pattern[row] = pattern[row] || [];
            pattern[row][col] = cell.classList.contains('bg-yellow-400') ? 1 : 0;
        }
        
        const correct = JSON.stringify(pattern) === JSON.stringify(this.currentPuzzle.pattern);
        if (correct) {
            this.solvePuzzle();
        } else {
            this.showError('Pattern does not match. Try again!');
        }
    }
    
    checkMath() {
        const answer = document.getElementById('math-answer').value;
        if (answer === this.currentPuzzle.solution) {
            this.solvePuzzle();
        } else {
            this.showError('Incorrect answer. Try again!');
        }
    }
    
    checkRiddle(index) {
        const option = this.currentPuzzle.options[index];
        if (option.correct) {
            this.solvePuzzle();
        } else {
            this.showError('Incorrect riddle. Listen closely and try again...');
        }
    }
    
    playSequence() {
        const puzzle = this.currentPuzzle;
        if (this.sequencePlaying) return;
        this.sequencePlaying = true;
        
        const display = document.getElementById('memory-display');
        const btn = document.getElementById('memory-play-btn');
        if (btn) btn.disabled = true;
        
        let i = 0;
        display.innerHTML = '';
        
        const showNext = () => {
            if (i < puzzle.sequence.length) {
                const symbolIndex = puzzle.sequence[i];
                display.innerHTML = `<div class="text-5xl animate-pulse">${puzzle.symbols[symbolIndex]}</div>`;
                i++;
                setTimeout(showNext, 800);
            } else {
                display.innerHTML = '<div class="text-gray-400 text-xl">Now reproduce the sequence!</div>';
                this.sequencePlaying = false;
                if (btn) btn.disabled = false;
            }
        };
        
        showNext();
    }
    
    selectSymbol(index) {
        const puzzle = this.currentPuzzle;
        if (!this.playerSequence) this.playerSequence = [];
        if (this.playerSequence.length >= puzzle.sequence.length) return;
        
        const tile = document.querySelector(`#memory-input [data-index="${index}"]`);
        const symbol = tile.dataset.symbol;
        this.playerSequence.push(index);
        
        const slot = document.getElementById(`memory-slot-${this.playerSequence.length - 1}`);
        slot.innerHTML = `<div class="text-3xl">${symbol}</div>`;
        
        tile.style.opacity = '0.3';
        tile.style.pointerEvents = 'none';
    }
    
    checkSequenceMemory() {
        const puzzle = this.currentPuzzle;
        const correct = JSON.stringify(this.playerSequence || []) === JSON.stringify(puzzle.sequence);
        if (correct) {
            this.solvePuzzle();
        } else {
            this.playerSequence = [];
            this.showError('Sequence does not match. Try again!');
            puzzle.sequence.forEach((_, i) => {
                const slot = document.getElementById(`memory-slot-${i}`);
                slot.innerHTML = '<div class="text-gray-500 text-3xl">?</div>';
            });
            document.querySelectorAll('#memory-input .symbol-tile').forEach(tile => {
                tile.style.opacity = '1';
                tile.style.pointerEvents = 'auto';
            });
        }
    }
    
    solvePuzzle() {
        const reward = this.currentPuzzle.reward;
        
        // Trigger visual effects
        if (window.visualEffects) {
            window.visualEffects.triggerPuzzleSolveEffect();
        }
        
        // Apply rewards
        Object.entries(reward).forEach(([stat, value]) => {
            this.game.playerStats[stat] += value;
        });
        this.game.updateStats();
        
        // Mark as solved
        this.solvedPuzzles.push(this.currentPuzzle.id);
        
        // Show success
        const overlay = document.getElementById('puzzle-overlay');
        const content = overlay.querySelector('.bg-black');
        content.innerHTML = `
            <div class="text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h2 class="text-3xl font-bold text-green-400 mb-4">Puzzle Solved!</h2>
                <div class="text-xl text-white mb-6">
                    ${Object.entries(reward).map(([stat, value]) => 
                        `<div>+${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>`
                    ).join('')}
                </div>
                <button onclick="window.puzzles.closePuzzle()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold">
                    Continue Journey
                </button>
            </div>
        `;
        
        this.game.showAchievement('Puzzle Master', `Solved ${this.currentPuzzle.name}!`);
        
        // Trigger progression event
        document.dispatchEvent(new CustomEvent('puzzleSolved'));
        
        this.currentPuzzle = null;
    }
    
    showPartialReward(message) {
        const overlay = document.getElementById('puzzle-overlay');
        const content = overlay.querySelector('.bg-black');
        content.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-4">🤔</div>
                <h2 class="text-2xl font-bold text-yellow-400 mb-4">Partial Wisdom</h2>
                <p class="text-lg text-gray-300 mb-6">${message}</p>
                <button onclick="window.puzzles.closePuzzle()" class="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-bold">
                    Continue Journey
                </button>
            </div>
        `;
        
        this.currentPuzzle = null;
    }
    
    showError(message) {
        const error = document.createElement('div');
        error.className = 'fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50';
        error.textContent = message;
        document.body.appendChild(error);
        
        setTimeout(() => error.remove(), 3000);
    }
    
    getHint() {
        if (this.game.playerStats.wisdom >= 5) {
            this.game.playerStats.wisdom -= 5;
            this.game.updateStats();
            
            let hint = '';
            switch(this.currentPuzzle.type) {
                case 'sequence':
                    hint = 'Think about the divine virtues in order of importance...';
                    break;
                case 'cipher':
                    hint = this.currentPuzzle.hint;
                    break;
                case 'pattern':
                    hint = 'The pattern forms a sacred cross shape...';
                    break;
                case 'math':
                    hint = 'Look for the pattern in the relationship between prayers and blessings...';
                    break;
                case 'riddle':
                    hint = this.currentPuzzle.hint;
                    break;
                case 'sequence_memory':
                    hint = 'Watch carefully: the sequence follows the rhythm of creation...';
                    break;
            }
            
            alert(`💡 Hint: ${hint}`);
        } else {
            alert('Not enough wisdom for a hint!');
        }
    }
    
    closePuzzle() {
        const overlay = document.getElementById('puzzle-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.currentPuzzle = null;
    }
}

// Initialize puzzle system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.puzzleSystem = new DivinePuzzles(window.game);
            
            // Random puzzle encounters
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every 30 seconds
                    window.puzzleSystem.startRandomPuzzle();
                }
            }, 30000);
        }
    }, 3000);
});
