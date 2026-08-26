// Epic Battle System for The Divine Quest

class SpiritualBattle {
    constructor(game) {
        this.game = game;
        this.inBattle = false;
        this.currentEnemy = null;
        this.playerHP = 100;
        this.playerMP = 50;
        this.combo = 0;
        this.battleTurn = 0;
        this.skills = this.initSkills();
        this.enemies = this.initEnemies();
    }
    
    initSkills() {
        return {
            prayer: {
                name: "Divine Prayer",
                damage: 15,
                mpCost: 5,
                type: "faith",
                description: "Call upon divine power to smite evil",
                cooldown: 0
            },
            wisdom: {
                name: "Sacred Wisdom",
                damage: 20,
                mpCost: 10,
                type: "wisdom", 
                description: "Use ancient knowledge to expose weaknesses",
                cooldown: 0
            },
            compassion: {
                name: "Compassion Strike",
                damage: 10,
                mpCost: 3,
                type: "compassion",
                description: "Transform enemy's darkness with light",
                cooldown: 0,
                heal: 5
            },
            ultimate: {
                name: "Divine Intervention",
                damage: 50,
                mpCost: 25,
                type: "ultimate",
                description: "Unleash ultimate divine power",
                cooldown: 3
            }
        };
    }
    
    initEnemies() {
        return [
            {
                name: "Shadow of Doubt",
                hp: 50,
                maxHp: 50,
                damage: 8,
                type: "doubt",
                description: "A manifestation of uncertainty and fear",
                weakness: "faith",
                reward: { faith: 10, wisdom: 5, compassion: 5 }
            },
            {
                name: "Beast of Ignorance", 
                hp: 80,
                maxHp: 80,
                damage: 12,
                type: "ignorance",
                description: "Blind rage against divine truth",
                weakness: "wisdom",
                reward: { faith: 5, wisdom: 15, compassion: 5 }
            },
            {
                name: "Demon of Apathy",
                hp: 100,
                maxHp: 100,
                damage: 15,
                type: "apathy",
                description: "Cold indifference to all that is sacred",
                weakness: "compassion",
                reward: { faith: 5, wisdom: 5, compassion: 15 }
            },
            {
                name: "Archdemon of Despair",
                hp: 200,
                maxHp: 200,
                damage: 25,
                type: "despair",
                description: "The ultimate enemy of hope and faith",
                weakness: "ultimate",
                reward: { faith: 25, wisdom: 25, compassion: 25 }
            }
        ];
    }
    
    startBattle(enemyType = 'random') {
        if (this.inBattle) return;
        
        this.inBattle = true;
        this.battleTurn = 0;
        this.combo = 0;
        
        // Select enemy
        if (enemyType === 'random') {
            this.currentEnemy = {...this.enemies[Math.floor(Math.random() * Math.min(4, Math.floor(this.game.currentChapter) + 1))]};
        } else {
            this.currentEnemy = {...this.enemies.find(e => e.type === enemyType)};
        }
        
        this.createBattleUI();
        this.showBattleIntro();
    }
    
    createBattleUI() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center z-50';
        overlay.id = 'battle-overlay';
        overlay.innerHTML = `
            <div class="bg-black bg-opacity-80 rounded-2xl p-8 max-w-4xl w-full mx-4 border-2 border-purple-500 shadow-2xl">
                <!-- Battle Header -->
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold text-red-500 mb-2">⚔️ SPIRITUAL COMBAT ⚔️</h2>
                    <div class="text-yellow-400">Turn ${this.battleTurn + 1} | Combo: <span id="combo">0</span>x</div>
                </div>
                
                <!-- Battle Arena -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <!-- Enemy Section -->
                    <div class="text-center">
                        <div class="text-6xl mb-2" id="enemy-emoji">👹</div>
                        <h3 class="text-xl font-bold text-red-400 mb-2" id="enemy-name">${this.currentEnemy.name}</h3>
                        <div class="bg-gray-800 rounded-lg p-2 mb-2">
                            <div class="text-sm text-gray-400 mb-1">HP: <span id="enemy-hp">${this.currentEnemy.hp}</span>/${this.currentEnemy.maxHp}</div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-red-500 h-4 rounded-full transition-all duration-300" id="enemy-hp-bar" style="width: ${(this.currentEnemy.hp / this.currentEnemy.maxHp) * 100}%"></div>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 italic">${this.currentEnemy.description}</p>
                    </div>
                    
                    <!-- VS -->
                    <div class="flex items-center justify-center">
                        <div class="text-4xl text-yellow-400 font-bold animate-pulse">VS</div>
                    </div>
                    
                    <!-- Player Section -->
                    <div class="text-center">
                        <div class="text-6xl mb-2">🙏</div>
                        <h3 class="text-xl font-bold text-blue-400 mb-2">Divine Warrior</h3>
                        <div class="bg-gray-800 rounded-lg p-2 mb-2">
                            <div class="text-sm text-gray-400 mb-1">HP: <span id="player-hp">${this.playerHP}</span>/100</div>
                            <div class="w-full bg-gray-700 rounded-full h-4 mb-2">
                                <div class="bg-green-500 h-4 rounded-full transition-all duration-300" id="player-hp-bar" style="width: ${this.playerHP}%"></div>
                            </div>
                            <div class="text-sm text-gray-400 mb-1">MP: <span id="player-mp">${this.playerMP}</span>/50</div>
                            <div class="w-full bg-gray-700 rounded-full h-4">
                                <div class="bg-blue-500 h-4 rounded-full transition-all duration-300" id="player-mp-bar" style="width: ${(this.playerMP / 50) * 100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Skills -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button onclick="window.battle.useSkill('prayer')" class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">🙏 Prayer</div>
                        <div class="text-xs">15 DMG | 5 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('wisdom')" class="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">📚 Wisdom</div>
                        <div class="text-xs">20 DMG | 10 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('compassion')" class="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">❤️ Compassion</div>
                        <div class="text-xs">10 DMG + 5 Heal | 3 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('ultimate')" class="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">✨ Ultimate</div>
                        <div class="text-xs">50 DMG | 25 MP</div>
                    </button>
                </div>
                
                <!-- Battle Log -->
                <div class="bg-gray-800 rounded-lg p-4 h-32 overflow-y-auto" id="battle-log">
                    <div class="text-yellow-400">⚔️ Battle Started! ${this.currentEnemy.name} appears!</div>
                </div>
                
                <!-- Flee Button -->
                <div class="text-center mt-4">
                    <button onclick="window.battle.flee()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                        🏃 Flee (Lose Progress)
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        window.battle = this;
    }
    
    showBattleIntro() {
        const log = document.getElementById('battle-log');
        log.innerHTML = `<div class="text-yellow-400 animate-pulse">⚔️ A wild ${this.currentEnemy.name} appears!</div>`;
        
        setTimeout(() => {
            log.innerHTML += `<div class="text-gray-400">${this.currentEnemy.description}</div>`;
            log.scrollTop = log.scrollHeight;
        }, 1000);
    }
    
    useSkill(skillName) {
        if (!this.inBattle) return;
        
        const skill = this.skills[skillName];
        const log = document.getElementById('battle-log');
        
        // Check MP
        if (this.playerMP < skill.mpCost) {
            log.innerHTML += `<div class="text-red-400">Not enough MP! Need ${skill.mpCost} MP</div>`;
            log.scrollTop = log.scrollHeight;
            return;
        }
        
        // Check cooldown
        if (skill.cooldown > 0) {
            log.innerHTML += `<div class="text-red-400">Skill on cooldown for ${skill.cooldown} turns!</div>`;
            log.scrollTop = log.scrollHeight;
            return;
        }
        
        // Use skill
        this.playerMP -= skill.mpCost;
        this.updatePlayerStats();
        
        // Calculate damage
        let damage = skill.damage;
        
        // Weakness bonus
        if (skill.type === this.currentEnemy.weakness) {
            damage *= 2;
            log.innerHTML += `<div class="text-green-400">💥 SUPER EFFECTIVE! Weakness exploited!</div>`;
        }
        
        // Combo bonus
        if (this.combo > 0) {
            damage = Math.floor(damage * (1 + (this.combo * 0.1)));
            log.innerHTML += `<div class="text-yellow-400">⚡ Combo x${this.combo + 1} bonus!</div>`;
        }
        
        // Apply damage
        this.currentEnemy.hp -= damage;
        this.combo++;
        
        log.innerHTML += `<div class="text-blue-400">You used ${skill.name} for ${damage} damage!</div>`;
        
        // Heal effect
        if (skill.heal) {
            this.playerHP = Math.min(100, this.playerHP + skill.heal);
            log.innerHTML += `<div class="text-green-400">You healed ${skill.heal} HP!</div>`;
        }
        
        this.updateEnemyStats();
        log.scrollTop = log.scrollHeight;
        
        // Check victory
        if (this.currentEnemy.hp <= 0) {
            this.victory();
            return;
        }
        
        // Enemy turn
        setTimeout(() => this.enemyTurn(), 1500);
    }
    
    enemyTurn() {
        const log = document.getElementById('battle-log');
        
        // Enemy attack
        const damage = this.currentEnemy.damage;
        this.playerHP -= damage;
        
        log.innerHTML += `<div class="text-red-400">${this.currentEnemy.name} attacks for ${damage} damage!</div>`;
        
        // Reset combo
        if (damage > 0) {
            this.combo = 0;
            log.innerHTML += `<div class="text-gray-400">Combo broken!</div>`;
        }
        
        this.updatePlayerStats();
        log.scrollTop = log.scrollHeight;
        
        // Check defeat
        if (this.playerHP <= 0) {
            this.defeat();
            return;
        }
        
        // Next turn
        this.battleTurn++;
        document.querySelector('#battle-overlay .text-yellow-400').innerHTML = `Turn ${this.battleTurn + 1} | Combo: <span id="combo">${this.combo}</span>x`;
        
        // Regenerate MP
        this.playerMP = Math.min(50, this.playerMP + 2);
        this.updatePlayerStats();
    }
    
    updateEnemyStats() {
        document.getElementById('enemy-hp').textContent = Math.max(0, this.currentEnemy.hp);
        document.getElementById('enemy-hp-bar').style.width = `${Math.max(0, (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100)}%`;
    }
    
    updatePlayerStats() {
        document.getElementById('player-hp').textContent = Math.max(0, this.playerHP);
        document.getElementById('player-hp-bar').style.width = `${Math.max(0, this.playerHP)}%`;
        document.getElementById('player-mp').textContent = this.playerMP;
        document.getElementById('player-mp-bar').style.width = `${(this.playerMP / 50) * 100}%`;
    }
    
    victory() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-green-400 text-xl font-bold animate-pulse">🎉 VICTORY! ${this.currentEnemy.name} defeated!</div>`;
        
        // Trigger visual effects
        if (window.visualEffects) {
            window.visualEffects.triggerVictoryEffect();
        }
        
        // Apply rewards
        const reward = this.currentEnemy.reward;
        this.game.playerStats.faith += reward.faith;
        this.game.playerStats.wisdom += reward.wisdom;
        this.game.playerStats.compassion += reward.compassion;
        this.game.updateStats();
        
        log.innerHTML += `<div class="text-yellow-400">Rewards: +${reward.faith} Faith, +${reward.wisdom} Wisdom, +${reward.compassion} Compassion!</div>`;
        
        // Show achievement
        this.game.showAchievement('Spiritual Warrior', `Defeated ${this.currentEnemy.name}!`);
        
        // Trigger progression event
        document.dispatchEvent(new CustomEvent('battleVictory'));
        
        setTimeout(() => {
            this.endBattle();
        }, 3000);
    }
    
    defeat() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-red-400 text-xl font-bold animate-pulse">💀 DEFEAT! You have been overwhelmed...</div>`;
        
        // Penalty
        this.game.playerStats.faith = Math.max(0, this.game.playerStats.faith - 10);
        this.game.playerStats.wisdom = Math.max(0, this.game.playerStats.wisdom - 10);
        this.game.playerStats.compassion = Math.max(0, this.game.playerStats.compassion - 10);
        this.game.updateStats();
        
        setTimeout(() => {
            this.endBattle();
        }, 3000);
    }
    
    flee() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-gray-400">You fled from battle...</div>`;
        
        // Small penalty
        this.game.playerStats.faith = Math.max(0, this.game.playerStats.faith - 5);
        this.game.updateStats();
        
        setTimeout(() => {
            this.endBattle();
        }, 1500);
    }
    
    endBattle() {
        this.inBattle = false;
        this.playerHP = 100;
        this.playerMP = 50;
        
        const overlay = document.getElementById('battle-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Add random battle encounters
class BattleEncounters {
    constructor(game) {
        this.game = game;
        this.battleSystem = new SpiritualBattle(game);
        this.encounterChance = 0.15; // 15% chance per choice
    }
    
    checkForBattle() {
        if (Math.random() < this.encounterChance) {
            setTimeout(() => {
                this.battleSystem.startBattle();
            }, 1000);
            return true;
        }
        return false;
    }
}

// Initialize battle system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.battleEncounters = new BattleEncounters(window.game);
            
            // Override makeChoice to include battle chance
            const originalMakeChoice = window.game.makeChoice.bind(window.game);
            window.game.makeChoice = function(choiceIndex) {
                const result = originalMakeChoice(choiceIndex);
                
                // Check for random battle after choice
                if (window.battleEncounters && !window.battleEncounters.battleSystem.inBattle) {
                    window.battleEncounters.checkForBattle();
                }
                
                return result;
            };
        }
    }, 2000);
});
