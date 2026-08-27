// Progression System for The Divine Quest

class ProgressionSystem {
    constructor(game) {
        this.game = game;
        this.playerLevel = 1;
        this.experience = 0;
        this.unlocks = {
            skills: [],
            titles: [],
            abilities: []
        };
        this.achievements = [];
        this.milestones = this.initMilestones();
        this.skillTree = this.initSkillTree();
        this.init();
    }
    
    init() {
        this.updateLevelDisplay();
        this.addProgressionUI();
        this.checkMilestones();
        this.wirePassiveEffects();
    }
    
    initMilestones() {
        return [
            { level: 1, name: "Seeker", description: "Beginning the spiritual journey", reward: { title: "Seeker" } },
            { level: 5, name: "Acolyte", description: "Dedicated to the divine path", reward: { skill: "meditation" } },
            { level: 10, name: "Priest", description: "Spiritual guide for others", reward: { ability: "heal" } },
            { level: 15, name: "Scholar", description: "Master of sacred texts", reward: { skill: "divine_wisdom" } },
            { level: 20, name: "Paladin", description: "Warrior of faith", reward: { ability: "divine_shield" } },
            { level: 25, name: "Prophet", description: "Voice of the divine", reward: { skill: "prophecy" } },
            { level: 30, name: "Saint", description: "Living embodiment of virtue", reward: { title: "Saint" } },
            { level: 50, name: "Archangel", description: "Divine messenger and protector", reward: { ability: "divine_wrath" } },
            { level: 100, name: "Divine Incarnate", description: "One with the ultimate reality", reward: { title: "Divine" } }
        ];
    }
    
    initSkillTree() {
        return {
            faith: {
                name: "Path of Faith",
                skills: [
                    { id: "prayer", name: "Enhanced Prayer", description: "Prayers are 50% more effective", unlocked: false, cost: 5 },
                    { id: "divine_intervention", name: "Divine Intervention", description: "Chance for automatic blessings", unlocked: false, cost: 15 },
                    { id: "resilient_faith", name: "Resilient Faith", description: "Increases maximum faith by 25", unlocked: false, cost: 20, prerequisites: ["prayer"], effect: { type: "faith_cap", value: 25 } },
                    { id: "blessed_guard", name: "Blessed Guard", description: "Reduces battle damage by 10%", unlocked: false, cost: 35, prerequisites: ["divine_intervention"], effect: { type: "damage_reduction", value: 0.1 } },
                    { id: "discernment", name: "Discernment", description: "Battle XP +20% (pierce enemy deception)", unlocked: false, cost: 30, prerequisites: ["blessed_guard"], effect: { type: "battle_exp", value: 0.2 } },
                    { id: "miracle", name: "Miracle Worker", description: "Can perform miracles", unlocked: false, cost: 35 }
                ]
            },
            wisdom: {
                name: "Path of Wisdom", 
                skills: [
                    { id: "insight", name: "Divine Insight", description: "See hidden meanings in texts", unlocked: false, cost: 5 },
                    { id: "prophecy", name: "Prophecy", description: "Foresee future events", unlocked: false, cost: 15 },
                    { id: "scholar_insight", name: "Scholar's Insight", description: "Gain +1 wisdom per chapter", unlocked: false, cost: 20, prerequisites: ["insight"], effect: { type: "wisdom_gain", value: 1 } },
                    { id: "scripture_mastery", name: "Scripture Mastery", description: "Puzzles award 20% more experience", unlocked: false, cost: 25, prerequisites: ["prophecy"], effect: { type: "puzzle_exp", value: 0.2 } },
                    { id: "enlightenment", name: "Enlightenment", description: "Understand all mysteries", unlocked: false, cost: 30 },
                    { id: "evangelism", name: "Evangelism", description: "Choice XP +15% when sharing the gospel", unlocked: false, cost: 25, prerequisites: ["enlightenment"], effect: { type: "choice_exp", value: 0.15 } }
                ]
            },
            compassion: {
                name: "Path of Compassion",
                skills: [
                    { id: "healing", name: "Divine Healing", description: "Heal others with compassion", unlocked: false, cost: 5 },
                    { id: "empathy", name: "Empathy", description: "Feel others' emotions", unlocked: false, cost: 15 },
                    { id: "healer_touch", name: "Healer's Touch", description: "Automatically heal 15 HP after each battle", unlocked: false, cost: 20, prerequisites: ["healing"], effect: { type: "post_battle_heal", value: 15 } },
                    { id: "steadfast", name: "Steadfast", description: "Reduce nightmare escalation by 25%", unlocked: false, cost: 25, prerequisites: ["empathy"], effect: { type: "nightmare_reduction", value: 0.25 } },
                    { id: "redemption", name: "Redemption", description: "Save lost souls", unlocked: false, cost: 30 },
                    { id: "stewardship", name: "Stewardship", description: "Post-battle heal +10 HP (faithful with little)", unlocked: false, cost: 25, prerequisites: ["redemption"], effect: { type: "post_battle_heal", value: 10 } }
                ]
            }
        };
    }
    
    addProgressionUI() {
        const ui = document.createElement('div');
        ui.className = 'fixed top-20 left-4 bg-black bg-opacity-80 rounded-lg p-4 text-white z-40';
        ui.innerHTML = `
            <div class="text-center mb-3">
                <div class="text-sm text-gray-400">Level</div>
                <div class="text-2xl font-bold text-yellow-400" id="player-level">${this.playerLevel}</div>
            </div>
            <div class="mb-3">
                <div class="text-sm text-gray-400 mb-1">Experience</div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                         id="exp-bar" style="width: ${(this.experience / this.getExpToNext()) * 100}%"></div>
                </div>
                <div class="text-xs text-gray-400 text-center">
                    <span id="current-exp">${this.experience}</span> / <span id="exp-needed">${this.getExpToNext()}</span>
                </div>
            </div>
            <button onclick="window.progression.showSkillTree()" class="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded text-sm">
                🌳 Skill Tree
            </button>
        `;
        
        document.body.appendChild(ui);
        window.progression = this;
    }
    
    gainExperience(amount) {
        this.experience += amount;
        this.checkLevelUp();
        this.updateLevelDisplay();
    }
    
    checkLevelUp() {
        const expNeeded = this.getExpToNext();
        if (this.experience >= expNeeded) {
            this.experience -= expNeeded;
            this.playerLevel++;
            this.onLevelUp();
        }
    }
    
    getExpToNext() {
        return this.playerLevel * 100;
    }
    
    onLevelUp() {
        // Trigger visual effects
        if (window.visualEffects) {
            window.visualEffects.triggerLevelUpEffect();
        }
        
        // Show level up notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-xl shadow-2xl z-50 text-center';
        notification.innerHTML = `
            <div class="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 class="text-3xl font-bold mb-2">LEVEL UP!</h2>
            <div class="text-xl mb-4">You are now level ${this.playerLevel}</div>
            <div class="text-lg mb-6">${this.milestones.find(m => m.level === this.playerLevel)?.name || 'Growing stronger...'}</div>
            <button onclick="this.closest('.fixed').remove()" class="bg-white text-orange-500 px-6 py-2 rounded-lg font-bold">
                Continue
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Check for milestone rewards
        this.checkMilestones();
        
        // Grant skill points
        this.game.showAchievement('Level Up!', `Reached level ${this.playerLevel}!`);
    }
    
    checkMilestones() {
        const milestone = this.milestones.find(m => m.level === this.playerLevel);
        if (milestone && !this.achievements.includes(milestone.name)) {
            this.achievements.push(milestone.name);
            
            if (milestone.reward.title) {
                this.unlocks.titles.push(milestone.reward.title);
                this.game.showAchievement('Title Unlocked!', milestone.reward.title);
            }
            
            if (milestone.reward.skill) {
                this.unlockSkill(milestone.reward.skill);
            }
            
            if (milestone.reward.ability) {
                this.unlocks.abilities.push(milestone.reward.ability);
                this.game.showAchievement('Ability Unlocked!', milestone.reward.ability);
            }
        }
    }
    
    unlockSkill(skillId) {
        Object.values(this.skillTree).forEach(path => {
            const skill = path.skills.find(s => s.id === skillId);
            if (skill) {
                skill.unlocked = true;
                if (!this.unlocks.skills.includes(skillId)) {
                    this.unlocks.skills.push(skillId);
                }
                this.game.showAchievement('Skill Unlocked!', skill.name);
            }
        });
    }
    
    updateLevelDisplay() {
        const levelEl = document.getElementById('player-level');
        const expBar = document.getElementById('exp-bar');
        const currentExp = document.getElementById('current-exp');
        const expNeeded = document.getElementById('exp-needed');
        
        if (levelEl) levelEl.textContent = this.playerLevel;
        if (expBar) expBar.style.width = `${(this.experience / this.getExpToNext()) * 100}%`;
        if (currentExp) currentExp.textContent = this.experience;
        if (expNeeded) expNeeded.textContent = this.getExpToNext();
    }
    
    showSkillTree() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        overlay.id = 'skill-tree-overlay';
        
        let skillContent = '';
        
        Object.entries(this.skillTree).forEach(([pathKey, path]) => {
            skillContent += `
                <div class="bg-gray-800 rounded-lg p-4">
                    <h3 class="text-xl font-bold text-yellow-400 mb-3">${path.name}</h3>
                    <div class="space-y-2">
                        ${path.skills.map(skill => {
                            const prereqText = skill.prerequisites && skill.prerequisites.length > 0 
                                ? `<div class="text-xs text-yellow-500 mt-1">Requires: ${skill.prerequisites.join(', ')}</div>` 
                                : '';
                            return `
                            <div class="bg-gray-700 p-3 rounded-lg ${skill.unlocked ? 'border-2 border-green-500' : 'opacity-60'}">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="font-bold ${skill.unlocked ? 'text-green-400' : 'text-gray-400'}">${skill.name}</div>
                                        <div class="text-xs text-gray-400">${skill.description}</div>
                                        ${prereqText}
                                    </div>
                                    <div>
                                        ${skill.unlocked ? 
                                            '<span class="text-green-400">✓ Unlocked</span>' : 
                                            `<button onclick="window.progression.purchaseSkill('${pathKey}', '${skill.id}')" class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">${skill.cost} pts</button>`
                                        }
                                    </div>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        
        overlay.innerHTML = `
            <div class="bg-black rounded-2xl p-8 max-w-4xl w-full mx-4 border-2 border-purple-500">
                <div class="text-center mb-6">
                    <h2 class="text-3xl font-bold text-purple-400 mb-2">🌳 Divine Skill Tree</h2>
                    <div class="text-yellow-400">Skill Points: <span id="skill-points">${this.playerLevel}</span></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    ${skillContent}
                </div>
                
                <div class="text-center">
                    <button onclick="window.progression.closeSkillTree()" class="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    purchaseSkill(pathKey, skillId) {
        const skill = this.skillTree[pathKey].skills.find(s => s.id === skillId);
        
        if (skill && !skill.unlocked && this.playerLevel >= skill.cost) {
            // Check prerequisites
            if (skill.prerequisites && skill.prerequisites.length > 0) {
                const allPrereqsMet = skill.prerequisites.every(prereqId => 
                    this.unlocks.skills.includes(prereqId)
                );
                if (!allPrereqsMet) {
                    this.game.showAchievement('Skill Locked', `Requires: ${skill.prerequisites.join(', ')}`);
                    return;
                }
            }
            
            skill.unlocked = true;
            this.unlocks.skills.push(skillId);
            this.game.showAchievement('Skill Purchased!', skill.name);
            this.showSkillTree(); // Refresh the tree
        }
    }
    
    closeSkillTree() {
        const overlay = document.getElementById('skill-tree-overlay');
        if (overlay) overlay.remove();
    }
    
    // Add experience for various actions
    addExperienceForAction(action, bonusExp = 0) {
        const expGains = {
            choice: 10,
            battle_win: 50,
            puzzle_solve: 30,
            meditation: 20,
            milestone: 100
        };
        
        const baseGain = expGains[action] || 5;
        const totalGain = baseGain + bonusExp;
        this.gainExperience(totalGain);
    }
    
    getUnlockedSkill(id) {
        for (const path of Object.values(this.skillTree)) {
            const skill = path.skills.find(s => s.id === id);
            if (skill && skill.unlocked) return skill;
        }
        return null;
    }
    
    getPassiveBonus(type) {
        let total = 0;
        for (const path of Object.values(this.skillTree)) {
            for (const skill of path.skills) {
                if (skill.unlocked && skill.effect && skill.effect.type === type) {
                    total += skill.effect.value;
                }
            }
        }
        return total;
    }
    
    wirePassiveEffects() {
        if (!window.game) return;
        
        // Healer's Touch: auto-heal after battles
        document.addEventListener('battleVictory', () => {
            const healAmount = this.getPassiveBonus('post_battle_heal');
            if (healAmount > 0 && typeof window.game.heal === 'function') {
                window.game.heal(healAmount);
            } else if (healAmount > 0 && typeof window.game.health !== 'undefined') {
                window.game.health = Math.min(
                    (window.game.maxHealth || window.game.health),
                    window.game.health + healAmount
                );
            }
        });
        
        // Scholar's Insight: bonus wisdom per chapter
        if (typeof window.game.advanceChapter === 'function') {
            const originalAdvanceChapter = window.game.advanceChapter.bind(window.game);
            window.game.advanceChapter = () => {
                const result = originalAdvanceChapter();
                const wisdomBonus = this.getPassiveBonus('wisdom_gain');
                if (wisdomBonus > 0) {
                    if (typeof window.game.addWisdom === 'function') {
                        window.game.addWisdom(wisdomBonus);
                    } else if (typeof window.game.wisdom !== 'undefined') {
                        window.game.wisdom += wisdomBonus;
                    }
                }
                return result;
            };
        }
        
        // Resilient Faith: boost maximum faith
        const faithCapBonus = this.getPassiveBonus('faith_cap');
        if (faithCapBonus > 0) {
            if (typeof window.game.maxFaith !== 'undefined') {
                window.game.maxFaith += faithCapBonus;
            }
            if (typeof window.game.faithCap !== 'undefined') {
                window.game.faithCap += faithCapBonus;
            }
            if (typeof window.game.faith !== 'undefined' && typeof window.game.maxFaith !== 'undefined') {
                window.game.faith = Math.min(window.game.faith + faithCapBonus, window.game.maxFaith);
            }
        }
        
        // Blessed Guard: reduce battle damage
        const dmgReduction = this.getPassiveBonus('damage_reduction');
        if (dmgReduction > 0 && typeof window.game.takeDamage === 'function') {
            const originalTakeDamage = window.game.takeDamage.bind(window.game);
            window.game.takeDamage = function(amount) {
                const reduced = Math.max(1, amount * (1 - dmgReduction));
                return originalTakeDamage(reduced);
            };
        }
        
        // Steadfast: reduce nightmare escalation
        const nightmareReduction = this.getPassiveBonus('nightmare_reduction');
        if (nightmareReduction > 0) {
            if (typeof window.game.addNightmareLevel === 'function') {
                const originalAddNightmareLevel = window.game.addNightmareLevel.bind(window.game);
                window.game.addNightmareLevel = function(amount) {
                    const reduced = amount * (1 - nightmareReduction);
                    return originalAddNightmareLevel(reduced);
                };
            }
        }
        
        // Scripture Mastery: bonus experience from puzzles
        const puzzleExpBonus = this.getPassiveBonus('puzzle_exp');
        if (puzzleExpBonus > 0) {
            document.addEventListener('puzzleSolved', () => {
                this.addExperienceForAction('puzzle_solve', Math.floor(30 * puzzleExpBonus));
            });
        }
    }
}

// Initialize progression system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.game) {
            window.progressionSystem = new ProgressionSystem(window.game);
            
            // Hook into game actions for experience gains
            const originalMakeChoice = window.game.makeChoice.bind(window.game);
            window.game.makeChoice = function(choiceIndex) {
                const result = originalMakeChoice(choiceIndex);
                const bonus = window.progressionSystem.getPassiveBonus('choice_exp');
                window.progressionSystem.addExperienceForAction('choice', Math.floor(10 * bonus));
                return result;
            };
            
            // Battle victories
            document.addEventListener('battleVictory', () => {
                const bonus = window.progressionSystem.getPassiveBonus('battle_exp');
                window.progressionSystem.addExperienceForAction('battle_win', Math.floor(50 * bonus));
            });
            
            // Puzzle solutions
            document.addEventListener('puzzleSolved', () => {
                window.progressionSystem.addExperienceForAction('puzzle_solve');
            });
        }
    }, 4000);
});
