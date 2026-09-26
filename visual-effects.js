// Enhanced Visual Effects System for The Divine Quest

class VisualEffectsEngine {
    constructor() {
        this.particles = [];
        this.screenShake = false;
        this.flashEffects = [];
        this.activeAnimations = [];
        this.init();
    }
    
    init() {
        this.createParticleContainer();
        this.startContinuousEffects();
    }
    
    createParticleContainer() {
        this.container = document.createElement('div');
        this.container.id = 'visual-effects-container';
        this.container.className = 'fixed inset-0 pointer-events-none z-40';
        document.body.appendChild(this.container);
    }
    
    startContinuousEffects() {
        // Accessibility: skip ambient particles when reduced motion is preferred
        if (this._reducedMotion()) return;
        
        // Ambient particles
        setInterval(() => this.createAmbientParticle(), 1500);
        
        // Cleanup old particles
        setInterval(() => this.cleanupParticles(), 2000);
    }
    
    createAmbientParticle() {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 rounded-full';
        particle.style.background = `radial-gradient(circle, ${this.getRandomColor()}, transparent)`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.animation = `floatUp ${5 + Math.random() * 5}s linear`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, 10000);
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 215, 0, 0.6)',  // Gold
            'rgba(147, 51, 234, 0.6)',  // Purple
            'rgba(59, 130, 246, 0.6)',  // Blue
            'rgba(16, 185, 129, 0.6)'   // Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    cleanupParticles() {
        this.particles = this.particles.filter(p => p.parentNode);
    }
    
    // Battle Effects
    triggerAttackEffect(attacker, target, damage) {
        this.createSlashEffect(target);
        this.createDamageNumber(target, damage);
        this.screenShake(damage > 10 ? 1.5 : 1);
        this.comboFlash();
        this.createImpactParticles(target);
    }
    
    createSlashEffect(target) {
        const slash = document.createElement('div');
        slash.className = 'absolute text-6xl font-bold text-yellow-400 animate-ping';
        slash.textContent = '⚔️';
        slash.style.left = '50%';
        slash.style.top = '50%';
        slash.style.transform = 'translate(-50%, -50%)';
        
        const container = this.getOverlayContainer();
        if (container) {
            container.appendChild(slash);
            setTimeout(() => slash.remove(), 1000);
        }
    }
    
    createDamageNumber(target, damage) {
        const number = document.createElement('div');
        number.className = 'absolute text-3xl font-bold text-red-500 animate-bounce';
        number.textContent = `-${damage}`;
        number.style.left = '50%';
        number.style.top = '40%';
        number.style.transform = 'translateX(-50%)';
        number.style.animation = 'damageFloat 2s ease-out';
        
        const container = this.getOverlayContainer();
        if (container) {
            container.appendChild(number);
            setTimeout(() => number.remove(), 2000);
        }
    }
    
    createImpactParticles(target) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-3 h-3 bg-red-500 rounded-full';
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 5 + Math.random() * 10;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.animation = `particleBurst 1s ease-out`;
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            const container = this.getOverlayContainer();
            if (container) {
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        }
    }
    
    screenShakeEffect() {
        if (this.screenShake) return;
        this.screenShake = true;
        
        const body = document.body;
        body.style.animation = 'screenShake 0.5s';
        
        setTimeout(() => {
            body.style.animation = '';
            this.screenShake = false;
        }, 500);
    }
    
    screenShake(intensity = 1) {
        if (this.screenShake) return;
        this.screenShake = true;
        
        const body = document.body;
        body.style.animation = `screenShake ${0.3 + intensity * 0.2}s`;
        
        setTimeout(() => {
            body.style.animation = '';
            this.screenShake = false;
        }, 600);
    }
    
    comboFlash() {
        const combo = (window.battleEncounters && window.battleEncounters.combo) || 0;
        if (combo < 2) return;
        
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 pointer-events-none z-50';
        flash.style.background = 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)';
        flash.style.animation = 'comboFlashAnim 0.6s ease-out';
        
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
    }
    
    divineAura(target) {
        const el = (typeof target === 'string') ? document.querySelector(target) : target;
        if (!el) return;
        
        const aura = document.createElement('div');
        aura.style.position = 'absolute';
        aura.style.inset = '-10px';
        aura.style.pointerEvents = 'none';
        aura.style.zIndex = '30';
        aura.style.boxShadow = '0 0 30px 10px rgba(255,215,0,0.6), 0 0 60px 20px rgba(147,51,234,0.4)';
        aura.style.borderRadius = 'inherit';
        aura.style.animation = 'divineAuraPulse 1.5s ease-out';
        
        el.style.position = el.style.position || 'relative';
        el.appendChild(aura);
        
        setTimeout(() => aura.remove(), 1500);
    }
    
    transitionFade(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 pointer-events-none z-[60]';
        overlay.style.background = 'black';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease-in-out';
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        setTimeout(() => {
            if (typeof callback === 'function') {
                callback();
            }
            requestAnimationFrame(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 500);
            });
        }, 500);
    }
    
    // Victory Effects
    triggerVictoryEffect() {
        this.createFireworks();
        this.createVictoryBeam();
        this.createConfetti();
        this.screenFlashEffect('gold');
    }
    
    createFireworks() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * 80 + 10;
                const y = Math.random() * 60 + 20;
                this.createFirework(x, y);
            }, i * 200);
        }
    }
    
    createFirework(x, y) {
        const firework = document.createElement('div');
        firework.className = 'absolute';
        firework.style.left = x + '%';
        firework.style.top = y + '%';
        
        // Create explosion particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 rounded-full';
            particle.style.background = this.getRandomColor();
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 10 + Math.random() * 20;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.animation = `particleBurst 1.5s ease-out`;
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            firework.appendChild(particle);
        }
        
        this.container.appendChild(firework);
        setTimeout(() => firework.remove(), 2000);
    }
    
    createVictoryBeam() {
        const beam = document.createElement('div');
        beam.className = 'absolute inset-0 bg-gradient-to-t from-transparent via-yellow-400 to-white opacity-50';
        beam.style.animation = 'beamFlash 2s ease-out';
        
        const container = this.getOverlayContainer();
        if (container) {
            container.appendChild(beam);
            setTimeout(() => beam.remove(), 2000);
        }
    }
    
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'absolute w-3 h-3';
            confetti.style.background = this.getRandomColor();
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            this.container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }
    
    // Puzzle Effects
    triggerPuzzleSolveEffect() {
        this.createMysticRings();
        this.createWisdomOrbs();
        this.screenFlashEffect('blue');
    }
    
    createMysticRings() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ring = document.createElement('div');
                ring.className = 'absolute inset-0 border-4 border-blue-400 rounded-full';
                ring.style.animation = `ringExpand 2s ease-out`;
                ring.style.animationDelay = i * 0.2 + 's';
                
                const container = this.getOverlayContainer();
                if (container) {
                    container.appendChild(ring);
                    setTimeout(() => ring.remove(), 2000);
                }
            }, i * 200);
        }
    }
    
    createWisdomOrbs() {
        for (let i = 0; i < 8; i++) {
            const orb = document.createElement('div');
            orb.className = 'absolute w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full';
            orb.style.left = Math.random() * 80 + 10 + '%';
            orb.style.top = Math.random() * 80 + 10 + '%';
            orb.style.animation = `orbFloat 3s ease-out`;
            
            const container = this.getOverlayContainer();
            if (container) {
                container.appendChild(orb);
                setTimeout(() => orb.remove(), 3000);
            }
        }
    }
    
    // Level Up Effects
    triggerLevelUpEffect() {
        this.createLevelUpBurst();
        this.createLevelUpRays();
        this.screenFlashEffect('purple');
    }
    
    createLevelUpBurst() {
        const burst = document.createElement('div');
        burst.className = 'absolute inset-0 flex items-center justify-center';
        burst.innerHTML = `
            <div class="text-8xl animate-ping">⭐</div>
            <div class="absolute text-6xl animate-pulse">⭐</div>
        `;
        
        const container = this.getOverlayContainer();
        if (container) {
            container.appendChild(burst);
            setTimeout(() => burst.remove(), 2000);
        }
    }
    
    createLevelUpRays() {
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'absolute w-1 h-32 bg-gradient-to-t from-purple-400 to-transparent';
            ray.style.left = '50%';
            ray.style.top = '50%';
            ray.style.transform = `translateX(-50%) rotate(${i * 30}deg)`;
            ray.style.transformOrigin = 'bottom center';
            ray.style.animation = `rayExpand 1.5s ease-out`;
            
            const container = this.getOverlayContainer();
            if (container) {
                container.appendChild(ray);
                setTimeout(() => ray.remove(), 1500);
            }
        }
    }
    
    // Screen Flash Effects
    screenFlashEffect(color) {
        const flash = document.createElement('div');
        flash.className = 'fixed inset-0 pointer-events-none z-50';
        
        const colors = {
            gold: 'bg-yellow-400',
            blue: 'bg-blue-400',
            purple: 'bg-purple-400',
            red: 'bg-red-400',
            green: 'bg-green-400'
        };
        
        flash.classList.add(colors[color] || 'bg-white');
        flash.style.animation = 'screenFlash 0.5s ease-out';
        
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
    }
    
    getOverlayContainer() {
        const preferred = ['puzzle-overlay', 'battle-overlay']
            .map((id) => document.getElementById(id))
            .find((el) => el && !el.classList.contains('hidden'));
        if (preferred) return preferred;
        const visible = Array.from(document.querySelectorAll('.fixed.inset-0.z-50'))
            .find((el) => !el.classList.contains('hidden'));
        return visible || this.container;
    }
    
    // Portal Effects
    triggerPortalEffect(color) {
        this.createPortalVortex(color);
        this.createPortalParticles(color);
    }
    
    createPortalVortex(color) {
        const vortex = document.createElement('div');
        vortex.className = 'absolute inset-0 flex items-center justify-center';
        vortex.innerHTML = `
            <div class="w-64 h-64 rounded-full animate-spin" 
                 style="background: conic-gradient(from 0deg, ${color}, transparent, ${color}); opacity: 0.7;">
            </div>
            <div class="absolute w-48 h-48 rounded-full animate-spin" 
                 style="background: conic-gradient(from 180deg, ${color}, transparent, ${color}); animation-direction: reverse; opacity: 0.5;">
            </div>
            <div class="absolute w-32 h-32 rounded-full animate-pulse" 
                 style="background: radial-gradient(circle, ${color}, transparent);">
            </div>
        `;
        
        const container = this.getOverlayContainer();
        if (container) {
            container.appendChild(vortex);
            setTimeout(() => vortex.remove(), 2000);
        }
    }
    
    createPortalParticles(color) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-4 h-4 rounded-full';
            particle.style.background = color;
            particle.style.left = '50%';
            particle.style.top = '50%';
            
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 5 + Math.random() * 15;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            particle.style.animation = `particleSpiral 2s ease-out`;
            particle.style.setProperty('--vx', vx + 'px');
            particle.style.setProperty('--vy', vy + 'px');
            
            this.container.appendChild(particle);
            setTimeout(() => particle.remove(), 2000);
        }
    }

    // Accessibility check — honors both the OS preference and the in-game reduced-motion toggle
    _reducedMotion() {
        if (document.body && document.body.classList.contains('reduced-motion')) return true;
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    triggerGraceShimmer() {
        if (this._reducedMotion()) return;
        const shimmer = document.createElement('div');
        shimmer.textContent = '✨';
        shimmer.className = 'tdq-grace-shimmer';
        document.body.appendChild(shimmer);
        setTimeout(() => shimmer.remove(), 1800);
    }

    triggerConvictionFlash() {
        if (this._reducedMotion()) return;
        const flash = document.createElement('div');
        flash.className = 'tdq-conviction-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
    }

    triggerChoiceRipple(x, y, target) {
        if (this._reducedMotion()) return;
        const ripple = document.createElement('span');
        ripple.className = 'tdq-choice-ripple';
        const rect = (target && target.getBoundingClientRect) ? target.getBoundingClientRect() : null;
        const rx = rect ? (x - rect.left) : 10;
        const ry = rect ? (y - rect.top) : 10;
        ripple.style.left = rx + 'px';
        ripple.style.top = ry + 'px';
        if (target && target.style) {
            const prevPos = target.style.position;
            if (!prevPos || prevPos === 'static') target.style.position = 'relative';
            target.style.overflow = 'hidden';
            target.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    }

    triggerBattleImpact() {
        if (this._reducedMotion()) return;
        if (document.body) {
            document.body.classList.remove('tdq-battle-impact');
            void document.body.offsetWidth; // reflow to restart animation
            document.body.classList.add('tdq-battle-impact');
            setTimeout(() => document.body.classList.remove('tdq-battle-impact'), 450);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        from {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes damageFloat {
        0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
    
    @keyframes particleBurst {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy));
            opacity: 0;
        }
    }
    
    @keyframes particleSpiral {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), var(--vy)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes screenShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes screenFlash {
        0% { opacity: 0.8; }
        100% { opacity: 0; }
    }
    
    @keyframes beamFlash {
        0% { opacity: 0; transform: scaleY(0); }
        50% { opacity: 0.7; transform: scaleY(1); }
        100% { opacity: 0; transform: scaleY(1); }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes ringExpand {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
    
    @keyframes orbFloat {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(var(--vx), var(--vy)) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx), calc(var(--vy) - 100px)) scale(0.5);
            opacity: 0;
        }
    }
    
    @keyframes rayExpand {
        0% {
            transform: translateX(-50%) rotate(var(--rotation)) scaleY(0);
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) rotate(var(--rotation)) scaleY(2);
            opacity: 0;
        }
    }
    
    @keyframes comboFlashAnim {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.1); }
    }
    
    @keyframes divineAuraPulse {
        0% { opacity: 0.8; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.1); }
    }

    @keyframes tdqGraceShimmer {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
    }

    @keyframes tdqConvictionFlash {
        0% { opacity: 0.35; }
        100% { opacity: 0; }
    }

    .tdq-grace-shimmer {
        position: fixed;
        left: 50%;
        top: 50%;
        font-size: 4rem;
        z-index: 60;
        pointer-events: none;
        animation: tdqGraceShimmer 1.6s ease-out forwards;
    }

    .tdq-conviction-flash {
        position: fixed;
        inset: 0;
        z-index: 55;
        pointer-events: none;
        background: radial-gradient(circle, rgba(220,38,38,0.5), transparent 70%);
        animation: tdqConvictionFlash 0.5s ease-out forwards;
    }

    .tdq-choice-ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background: rgba(251, 191, 36, 0.45);
        animation: tdqChoiceRipple 0.55s ease-out forwards;
        pointer-events: none;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
    }

    .tdq-battle-impact {
        animation: tdqBattleShake 0.4s ease-in-out;
    }

    @keyframes tdqChoiceRipple {
        0% { transform: scale(0); opacity: 0.6; }
        100% { transform: scale(2.2); opacity: 0; }
    }

    @keyframes tdqBattleShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(7px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(4px); }
    }

    @media (prefers-reduced-motion: reduce) {
        .tdq-grace-shimmer, .tdq-conviction-flash { animation: none !important; display: none !important; }
        .tdq-choice-ripple { display: none !important; }
        .tdq-battle-impact { animation: none !important; }
    }
`;
document.head.appendChild(style);

// Initialize visual effects
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.visualEffects = new VisualEffectsEngine();
        
        // Grace shimmer on victory; conviction flash on a low-path / wrong choice
        document.addEventListener('battleVictory', () => {
            if (window.visualEffects) window.visualEffects.triggerGraceShimmer();
        });
        document.addEventListener('chapterChanged', (e) => {
            if (!window.visualEffects) return;
            const isLowPath = e && e.detail && e.detail.lowPath;
            if (isLowPath) window.visualEffects.triggerConvictionFlash();
        });

        // Battle impact: brief screen shake when the player takes a hit
        document.addEventListener('battleHit', () => {
            if (window.visualEffects) window.visualEffects.triggerBattleImpact();
        });

        // Choice ripple: tap/click feedback on choice buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest && e.target.closest('.choice-button');
            if (btn && window.visualEffects) {
                window.visualEffects.triggerChoiceRipple(e.clientX, e.clientY, btn);
            }
        });

        // Puzzle-solve and level-up effects are attached once their owners
        // exist (puzzle/progression initialize on later timers).
        let hooked = 0;
        const hookTimer = setInterval(() => {
            try {
                if (window.puzzleSystem && !window.visualEffects._puzzleHooked && typeof window.puzzleSystem.solvePuzzle === 'function') {
                    const originalSolvePuzzle = window.puzzleSystem.solvePuzzle.bind(window.puzzleSystem);
                    window.puzzleSystem.solvePuzzle = function () {
                        const result = originalSolvePuzzle();
                        if (window.visualEffects) {
                            window.visualEffects.triggerPuzzleSolveEffect();
                            window.visualEffects.triggerGraceShimmer();
                        }
                        return result;
                    };
                    window.visualEffects._puzzleHooked = true;
                    hooked++;
                }
                if (window.progressionSystem && !window.visualEffects._levelHooked && typeof window.progressionSystem.onLevelUp === 'function') {
                    const originalOnLevelUp = window.progressionSystem.onLevelUp.bind(window.progressionSystem);
                    window.progressionSystem.onLevelUp = function () {
                        const result = originalOnLevelUp();
                        if (window.visualEffects) window.visualEffects.triggerLevelUpEffect();
                        return result;
                    };
                    window.visualEffects._levelHooked = true;
                    hooked++;
                }
                if (hooked >= 2) {
                    clearInterval(hookTimer);
                }
            } catch (err) { /* leave for next tick */ }
        }, 250);

        setTimeout(() => clearInterval(hookTimer), 8000);
    }, 1000);
});
