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
        this.triggeredEnrages = new Set();
        this.behaviorFlags = {};
        this.playerDefenseDebuff = 0;
        this.intercessionActive = false;
        this.intercessionTurns = 0;
        this.intercessionHeal = 0;
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
            },
            smite: {
                name: "Divine Smite",
                damage: 35,
                mpCost: 15,
                type: "holy",
                description: "Call down holy fire upon the enemy",
                cooldown: 1
            },
            sanctuary: {
                name: "Divine Sanctuary",
                damage: 0,
                mpCost: 12,
                type: "holy",
                description: "Invoke divine protection and heal wounds",
                cooldown: 2,
                heal: 25
            },
            intercession: {
                name: "Divine Intercession",
                damage: 0,
                mpCost: 10,
                type: "faith",
                description: "Invoke continuous healing for 3 turns",
                cooldown: 3,
                heal: 0,
                hot: 8,
                hotTurns: 3
            },
            sword: {
                name: "Sword of the Spirit",
                damage: 30,
                mpCost: 14,
                type: "ultimate",
                description: "The piercing word that shatters all defenses",
                cooldown: 2,
                pierce: true
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
                defense: 12,
                type: "despair",
                description: "The ultimate enemy of hope and faith",
                weakness: "ultimate",
                isBoss: true,
                phase2: false,
                reward: { faith: 25, wisdom: 25, compassion: 25 }
            },
            {
                name: "Doubter",
                hp: 120,
                maxHp: 120,
                damage: 18,
                type: "doubt2",
                description: "A persistent whisper of uncertainty",
                weakness: "faith",
                reward: { faith: 15, wisdom: 8, compassion: 7 }
            },
            {
                name: "Tempter",
                hp: 140,
                maxHp: 140,
                damage: 20,
                type: "temptation",
                description: "Seduces with promises of easy power",
                weakness: "wisdom",
                reward: { faith: 8, wisdom: 15, compassion: 7 }
            },
            {
                name: "Accuser",
                hp: 160,
                maxHp: 160,
                damage: 22,
                type: "accusation",
                description: "Points out every flaw and failure",
                weakness: "compassion",
                reward: { faith: 7, wisdom: 8, compassion: 15 }
            },
            {
                name: "Pharisee",
                hp: 150,
                maxHp: 150,
                damage: 10,
                defense: 25,
                type: "pharisee",
                behavior: "wall",
                description: "An immovable wall of rigid tradition",
                weakness: "wisdom",
                reward: { faith: 8, wisdom: 15, compassion: 5 }
            },
            {
                name: "Legion",
                hp: 170,
                maxHp: 170,
                damage: 18,
                defense: 10,
                type: "legion",
                behavior: "summon",
                description: "A horde of dark spirits bound as one",
                weakness: "faith",
                reward: { faith: 12, wisdom: 5, compassion: 10 }
            },
            {
                name: "False Prophet",
                hp: 130,
                maxHp: 130,
                damage: 14,
                defense: 8,
                type: "false-prophet",
                behavior: "debuff",
                description: "Twists truth to drain the spirit",
                weakness: "ultimate",
                reward: { faith: 5, wisdom: 10, compassion: 15 }
            },
            {
                name: "The Deceiver",
                hp: 130,
                maxHp: 130,
                damage: 16,
                type: "deceiver",
                description: "Masters of illusion and evasion",
                weakness: "wisdom",
                evasion: 0.25,
                reward: { faith: 8, wisdom: 12, compassion: 5 }
            },
            {
                name: "The Accuser",
                hp: 150,
                maxHp: 150,
                damage: 18,
                type: "accuser",
                description: "Whispers condemnations that weaken the spirit",
                weakness: "compassion",
                behavior: "debuff",
                reward: { faith: 5, wisdom: 8, compassion: 15 }
            },
            {
                name: "The Sorrower",
                hp: 120,
                maxHp: 120,
                damage: 14,
                type: "sorrow",
                description: "Feeds on compassion, leaving only grief",
                weakness: "faith",
                behavior: "drain",
                reward: { faith: 15, wisdom: 5, compassion: 10 }
            },
            {
                name: "The Rationalist",
                hp: 110,
                maxHp: 110,
                damage: 16,
                type: "rationalist",
                description: "Denies the supernatural, explaining away every miracle",
                weakness: "faith",
                behavior: "reduce-wisdom-gain",
                reward: { faith: 12, wisdom: 5, compassion: 8 }
            },
            {
                name: "The Scoffer",
                hp: 100,
                maxHp: 100,
                damage: 14,
                type: "scoffer",
                description: "Mocks your beliefs and amplifies doubt",
                weakness: "compassion",
                behavior: "scoffer-debuff",
                reward: { faith: 10, wisdom: 8, compassion: 12 }
            },
            {
                name: "The Indoctrinator",
                hp: 130,
                maxHp: 130,
                damage: 12,
                defense: 8,
                type: "indoctrinator",
                description: "Charms and confuses the faithful into error",
                weakness: "wisdom",
                behavior: "indoctrinate",
                reward: { faith: 5, wisdom: 18, compassion: 5 }
            }
        ];
    }
    
    startBattle(enemyType = 'random') {
        if (this.inBattle) return;
        
        this.inBattle = true;
        this.battleTurn = 0;
        this.combo = 0;
        this.triggeredEnrages = new Set();
        this.behaviorFlags = {};
        this.playerDefenseDebuff = 0;
        this.intercessionActive = false;
        this.intercessionTurns = 0;
        this.intercessionHeal = 0;
        
        // Select enemy
        if (enemyType === 'random') {
            this.currentEnemy = {...this.enemies[Math.floor(Math.random() * Math.min(13, Math.floor(this.game.currentChapter) + 1))]};
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
                <div class="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
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
                    <button onclick="window.battle.useSkill('smite')" class="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">🔥 Smite</div>
                        <div class="text-xs">35 DMG | 15 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('sanctuary')" class="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">🛡️ Sanctuary</div>
                        <div class="text-xs">25 Heal | 12 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('intercession')" class="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">🕊️ Intercession</div>
                        <div class="text-xs">8 HP/turn x3 | 10 MP</div>
                    </button>
                    <button onclick="window.battle.useSkill('sword')" class="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-all transform hover:scale-105">
                        <div class="font-bold">⚔️ Sword of Spirit</div>
                        <div class="text-xs">30 DMG | 14 MP</div>
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
            log.innerHTML += `<div class="text-red-400">${window.I18N.t("Not enough MP! Need")} ${skill.mpCost} MP</div>`;
            log.scrollTop = log.scrollHeight;
            return;
        }
        
        // Check cooldown
        if (skill.cooldown > 0) {
            log.innerHTML += `<div class="text-red-400">${window.I18N.t("Skill on cooldown for")} ${skill.cooldown} ${window.I18N.t("turns!")}</div>`;
            log.scrollTop = log.scrollHeight;
            return;
        }
        
        // Use skill
        this.playerMP -= skill.mpCost;
        this.updatePlayerStats();
        
        // Intercession: heal over time
        if (skillName === 'intercession') {
            this.intercessionActive = true;
            this.intercessionTurns = skill.hotTurns;
            this.intercessionHeal = skill.hot;
            log.innerHTML += `<div class="text-pink-400 font-bold">${window.I18N.t("Divine Intercession begins! Healing")} ${skill.hot} ${window.I18N.t("HP per turn for")} ${skill.hotTurns} ${window.I18N.t("turns.")}</div>`;
            log.scrollTop = log.scrollHeight;
            setTimeout(() => this.enemyTurn(), 1000);
            return;
        }
        
        // Calculate damage
        let damage = skill.damage;
        
        // Apply enemy defense (unless piercing)
        const enemyDefense = this.currentEnemy.defense || 0;
        if (!skill.pierce) {
            damage = Math.max(1, damage - Math.floor(enemyDefense / 2));
        }
        
        // Weakness bonus
        if (skill.type === this.currentEnemy.weakness) {
            damage *= 2;
            log.innerHTML += `<div class="text-green-400">${window.I18N.t("💥 SUPER EFFECTIVE! Weakness exploited!")}</div>`;
        }
        
        // Combo bonus
        if (this.combo > 0) {
            damage = Math.floor(damage * (1 + (this.combo * 0.1)));
            log.innerHTML += `<div class="text-yellow-400">${window.I18N.t("⚡ Combo x")}${this.combo + 1}${window.I18N.t(" bonus!")}</div>`;
        }
        
        // Deceiver evasion
        if (this.currentEnemy.type === 'deceiver' && Math.random() < (this.currentEnemy.evasion || 0)) {
            damage = 0;
            log.innerHTML += `<div class="text-purple-400 font-bold">${window.I18N.t("💨 The Deceiver vanishes in a cloud of illusion! Your attack misses!")}</div>`;
        }
        
        // Apply damage
        this.currentEnemy.hp -= damage;
        this.combo++;
        
        log.innerHTML += `<div class="text-blue-400">${window.I18N.t("You used")} ${skill.name} ${window.I18N.t("for")} ${damage} ${window.I18N.t("damage!")}</div>`;
        
        // Visual effect hook
        if (skillName === 'smite' && window.visualEffects && window.visualEffects.triggerAttackEffect) {
            window.visualEffects.triggerAttackEffect('player', 'enemy', damage);
        }
        
        // Heal effect
        if (skill.heal) {
            this.playerHP = Math.min(100, this.playerHP + skill.heal);
            log.innerHTML += `<div class="text-green-400">${window.I18N.t("You healed")} ${skill.heal} HP!</div>`;
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
        
        // Process Intercession heal over time
        if (this.intercessionActive) {
            this.playerHP = Math.min(100, this.playerHP + this.intercessionHeal);
            this.intercessionTurns--;
            log.innerHTML += `<div class="text-pink-400">${window.I18N.t("🕊️ Divine Intercession heals you for")} ${this.intercessionHeal} HP! (${this.intercessionTurns} ${window.I18N.t("turns remaining")})</div>`;
            if (this.intercessionTurns <= 0) {
                this.intercessionActive = false;
                log.innerHTML += `<div class="text-gray-400">${window.I18N.t("Divine Intercession fades.")}</div>`;
            }
            this.updatePlayerStats();
            log.scrollTop = log.scrollHeight;
        }
        
        // Enemy attack
        let damage = this.currentEnemy.damage;
        
        // Player defense debuff
        if (this.playerDefenseDebuff > 0) {
            damage += this.playerDefenseDebuff;
            this.playerDefenseDebuff--;
            log.innerHTML += `<div class="text-orange-400">${window.I18N.t("Your guard is weakened! +")}${this.playerDefenseDebuff > 0 ? this.playerDefenseDebuff + 1 : 1} ${window.I18N.t("damage taken this turn.")}</div>`;
        }
        
        // Archdemon of Despair Phase 2 special attacks
        if (this.currentEnemy && this.currentEnemy.type === 'despair' && this.currentEnemy.phase2) {
            const roll = Math.random();
            if (roll < 0.35) {
                // Abyssal Roar - heavy damage
                damage = Math.floor(damage * 1.5);
                log.innerHTML += `<div class="text-red-500 text-xl font-bold">${window.I18N.t("🌑 ABYSSAL ROAR! The Archdemon unleashes devastating dark energy for")} ${damage} ${window.I18N.t("damage!")}</div>`;
            } else if (roll < 0.65) {
                // Despair Wave - MP drain
                const mpDrain = 10;
                this.playerMP = Math.max(0, this.playerMP - mpDrain);
                log.innerHTML += `<div class="text-purple-400 font-bold">${window.I18N.t("🌊 DESPAIR WAVE! Your spiritual energy is drained! -")}${mpDrain} MP</div>`;
            } else {
                log.innerHTML += `<div class="text-red-400">${window.I18N.t("The Archdemon strikes with corrupted fury for")} ${damage} ${window.I18N.t("damage!")}</div>`;
            }
        } else {
            // Normal enemy attack
            log.innerHTML += `<div class="text-red-400">${this.currentEnemy.name} ${window.I18N.t("attacks for")} ${damage} ${window.I18N.t("damage!")}</div>`;
        }
        
        // False Prophet debuff
        if (this.currentEnemy.type === 'false-prophet' && Math.random() < 0.3) {
            this.playerMP = Math.max(0, this.playerMP - 5);
            log.innerHTML += `<div class="text-purple-400">${window.I18N.t("The False Prophet saps your spiritual energy! -5 MP")}</div>`;
        }
        
        // Accuser defense debuff
        if (this.currentEnemy.type === 'accuser' && Math.random() < 0.3) {
            this.playerDefenseDebuff += 5;
            log.innerHTML += `<div class="text-orange-400 font-bold">${window.I18N.t("⚖️ The Accuser's words weigh heavy on your conscience! Defense reduced! (+5 incoming damage)")}</div>`;
        }
        
        // Sorrower compassion drain
        if (this.currentEnemy.type === 'sorrow' && Math.random() < 0.25) {
            const drain = 5;
            this.game.playerStats.compassion = Math.max(0, this.game.playerStats.compassion - drain);
            this.game.updateStats();
            log.innerHTML += `<div class="text-gray-400 font-bold">${window.I18N.t("💔 The Sorrower feeds on your compassion! -")}${drain} ${window.I18N.t("Compassion")}</div>`;
        }

        // Scoffer amplifies doubt
        if (this.currentEnemy.type === 'scoffer' && Math.random() < 0.3) {
            this.playerDefenseDebuff += 3;
            log.innerHTML += `<div class="text-orange-400 font-bold">${window.I18N.t("😏 The Scoffer's words breed doubt! Defense weakened further!")}</div>`;
        }

        // Indoctrinator charms/confuses
        if (this.currentEnemy.type === 'indoctrinator' && Math.random() < 0.25) {
            const confusionDrain = 8;
            this.playerMP = Math.max(0, this.playerMP - confusionDrain);
            log.innerHTML += `<div class="text-purple-400 font-bold">${window.I18N.t("🌀 The Indoctrinator clouds your mind! You lose")} ${confusionDrain} MP!</div>`;
        }

        this.playerHP -= damage;
        
        // Reset combo
        if (damage > 0) {
            this.combo = 0;
            log.innerHTML += `<div class="text-gray-400">${window.I18N.t("Combo broken!")}</div>`;
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
        document.querySelector('#battle-overlay .text-yellow-400').innerHTML = `${window.I18N.t("Turn")} ${this.battleTurn + 1} | ${window.I18N.t("Combo:")} <span id="combo">${this.combo}</span>x`;
        
        // Regenerate MP
        this.playerMP = Math.min(50, this.playerMP + 2);
        this.updatePlayerStats();
    }
    
    updateEnemyStats() {
        document.getElementById('enemy-hp').textContent = Math.max(0, this.currentEnemy.hp);
        document.getElementById('enemy-hp-bar').style.width = `${Math.max(0, (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100)}%`;
        
        const hpPercent = this.currentEnemy.hp / this.currentEnemy.maxHp;
        const log = document.getElementById('battle-log');
        
        // Legion summon behavior
        if (this.currentEnemy && this.currentEnemy.type === 'legion' && hpPercent <= 0.5 && !this.behaviorFlags.legionSummon) {
            this.behaviorFlags.legionSummon = true;
            this.currentEnemy.damage += 10;
            if (log) {
                log.innerHTML += `<div class="text-red-400 font-bold">👥 ${window.I18N.t("Legion calls forth shadow minions! Attack surges!")}</div>`;
                log.scrollTop = log.scrollHeight;
            }
        }
        
        // Boss enrage phases
        if (this.currentEnemy && this.currentEnemy.isBoss) {
            if (hpPercent < 0.4 && !this.triggeredEnrages.has(4)) {
                this.triggeredEnrages.add(4);
                this.currentEnemy.phase2 = true;
                this.currentEnemy.damage = Math.floor(this.currentEnemy.damage * 1.4);
                this.currentEnemy.maxHp = Math.floor(this.currentEnemy.maxHp * 1.2);
                this.currentEnemy.hp = Math.min(this.currentEnemy.hp + 30, this.currentEnemy.maxHp);
                if (log) {
                    log.innerHTML += `<div class="text-red-500 text-xl font-bold animate-pulse border-2 border-red-500 p-2 my-2 text-center">⚡ ${window.I18N.t("EN RAGE! The Archdemon of Despair transforms into its Abyssal Avatar! Phase 2 begins! ⚡")}</div>`;
                    log.scrollTop = log.scrollHeight;
                }
            } else if (hpPercent <= 0.6 && !this.triggeredEnrages.has(6)) {
                this.triggeredEnrages.add(6);
                this.currentEnemy.damage = Math.floor(this.currentEnemy.damage * 1.3);
                if (log) {
                    log.innerHTML += `<div class="text-orange-500 text-lg font-bold animate-pulse border-2 border-orange-500 p-2 my-2 text-center">⚠️ ${window.I18N.t("EN RAGE! Fading Light phase begins! ⚠️")}</div>`;
                    log.scrollTop = log.scrollHeight;
                }
            }
        }
    }
    
    updatePlayerStats() {
        document.getElementById('player-hp').textContent = Math.max(0, this.playerHP);
        document.getElementById('player-hp-bar').style.width = `${Math.max(0, this.playerHP)}%`;
        document.getElementById('player-mp').textContent = this.playerMP;
        document.getElementById('player-mp-bar').style.width = `${(this.playerMP / 50) * 100}%`;
    }
    
    victory() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-green-400 text-xl font-bold animate-pulse">🎉 ${window.I18N.t("VICTORY!")} ${this.currentEnemy.name} ${window.I18N.t("defeated!")}</div>`;
        
        // Trigger visual effects
        if (window.visualEffects) {
            window.visualEffects.triggerVictoryEffect();
        }
        
        // Apply rewards
        const reward = { ...this.currentEnemy.reward };

        // The Rationalist reduces wisdom gain
        if (this.currentEnemy.type === 'rationalist') {
            reward.wisdom = Math.max(0, Math.floor(reward.wisdom * 0.5));
            log.innerHTML += `<div class="text-gray-400">${window.I18N.t("The Rationalist's arguments linger... Wisdom reward reduced!")}</div>`;
        }

        this.game.playerStats.faith += reward.faith;
        this.game.playerStats.wisdom += reward.wisdom;
        this.game.playerStats.compassion += reward.compassion;
        this.game.updateStats();
        
        log.innerHTML += `<div class="text-yellow-400">${window.I18N.t("Rewards:")} +${reward.faith} ${window.I18N.t("Faith,")} +${reward.wisdom} ${window.I18N.t("Wisdom,")} +${reward.compassion} ${window.I18N.t("Compassion!")}</div>`;
        
        // Show achievement
        this.game.showAchievement('Spiritual Warrior', `${window.I18N.t("Defeated")} ${this.currentEnemy.name}!`);
        
        // Trigger progression event
        document.dispatchEvent(new CustomEvent('battleVictory'));
        
        setTimeout(() => {
            this.endBattle();
        }, 3000);
    }
    
    defeat() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-red-400 text-xl font-bold animate-pulse">💀 ${window.I18N.t("DEFEAT! You have been overwhelmed...")}</div>`;
        
        // Penalty
        this.game.playerStats.faith = Math.max(0, this.game.playerStats.faith - 10);
        this.game.playerStats.wisdom = Math.max(0, this.game.playerStats.wisdom - 10);
        this.game.playerStats.compassion = Math.max(0, this.game.playerStats.compassion - 10);
        this.game.updateStats();
        
        document.dispatchEvent(new CustomEvent('battleDefeat'));
        
        setTimeout(() => {
            this.endBattle();
        }, 3000);
    }
    
    flee() {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="text-gray-400">${window.I18N.t("You fled from battle...")}</div>`;
        
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
        this.intercessionActive = false;
        this.intercessionTurns = 0;
        this.intercessionHeal = 0;
        
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
