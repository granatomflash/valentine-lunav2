// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Lightweight performance detection (mobile / low-end devices)
function isLowEndDevice() {
    try {
        const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 520;
        const cores = navigator.hardwareConcurrency || 4;
        const mem = navigator.deviceMemory || 4;
        return reducedMotion || smallScreen || cores <= 4 || mem <= 4;
    } catch {
        return false;
    }
}

function applyPerformanceMode() {
    window.__lowEnd = !!(config.performance?.forceLowEnd || isLowEndDevice());
    document.documentElement.classList.toggle('low-end', !!window.__lowEnd);
}

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Apply performance mode early
    applyPerformanceMode();

    // Set texts from config
    const titleEl = document.getElementById('valentineTitle');
    if (titleEl) titleEl.textContent = `${config.valentineName}…`; 
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements + particle canvas
    createFloatingElements();
    startParticles();

    // Setup music player
    setupMusicPlayer();

    // Wire "Apri lettera" button (se presente)
    const openLetterBtn = document.getElementById('openLetterBtn');
    if (openLetterBtn && config.links?.loveLetterUrl) {
        openLetterBtn.href = config.links.loveLetterUrl;
        openLetterBtn.textContent = config.links.loveLetterBtn || 'Apri la lettera 💌';
    }
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;

    // Clear in case of reloads
    container.innerHTML = '';

    const hearts = config.floatingEmojis?.hearts || ['💖'];
    const bears = config.floatingEmojis?.bears || [];
    const sparkles = config.floatingEmojis?.sparkles || [];

    // Helper to spawn a bunch of floating items
    const spawn = (className, pool, count) => {
        if (!pool || pool.length === 0) return;
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = className;
            div.innerHTML = pool[Math.floor(Math.random() * pool.length)];
            setRandomPosition(div);
            div.style.fontSize = (1.2 + Math.random() * 1.6) + 'rem';
            div.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
            container.appendChild(div);
        }
    };

    const low = !!window.__lowEnd;
    spawn('heart', hearts, low ? 14 : 22);
    spawn('sparkle', sparkles, low ? 8 : 12);
    spawn('bear', bears, low ? 3 : 5);
    
    // Keep it lively (but avoid lag): add a random heart occasionally
    window.clearInterval(window.__floatInterval);
    window.__floatInterval = window.setInterval(() => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        setRandomPosition(div);
        div.style.fontSize = (1.1 + Math.random() * 1.8) + 'rem';
        div.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
        container.appendChild(div);

        // cap DOM nodes to avoid buildup
        const maxNodes = low ? 40 : 70;
        while (container.children.length > maxNodes) {
            container.removeChild(container.firstChild);
        }

        // cleanup
        window.setTimeout(() => div.remove(), 25000);
    }, low ? 3200 : 2200);
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

// Function to move the "No" button when clicked
function moveButton(button) {
    // Keep the “No” button away from fixed UI (music button, secret answer) so nothing overlaps.
    const pad = 12;

    let topPad = pad;
    let bottomPad = pad;

    // Avoid the fixed music control area (top-right)
    const musicControls = document.getElementById('musicControls');
    if (musicControls && musicControls.style.display !== 'none') {
        const r = musicControls.getBoundingClientRect();
        // reserve the whole top strip up to the music button bottom
        topPad = Math.max(topPad, Math.ceil(r.bottom + 12));
    }

    // Avoid the secret answer area (bottom-left)
    const secret = document.querySelector('.secret-answer');
    if (secret) {
        const r = secret.getBoundingClientRect();
        // reserve a bottom strip from secret top to bottom
        bottomPad = Math.max(bottomPad, Math.ceil(window.innerHeight - r.top + 12));
    }

    const maxX = Math.max(pad, window.innerWidth - button.offsetWidth - pad);
    const maxY = Math.max(topPad, window.innerHeight - button.offsetHeight - bottomPad);

    const x = pad + Math.random() * (maxX - pad);
    const y = topPad + Math.random() * (maxY - topPad);

    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;
    
    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';
        
        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    // Create heart explosion effect
    createHeartExplosion();

    // Se la musica è abilitata ma bloccata dall'autoplay, proviamo ad avviarla ora (click su "Sì")
    tryStartMusicOnUserGesture();
}

// Create heart explosion animation
function createHeartExplosion() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    const pool = config.floatingEmojis?.hearts || ['💖'];

    const n = window.__lowEnd ? 40 : 60;
    for (let i = 0; i < n; i++) {
        const el = document.createElement('div');
        el.className = 'burst-heart';
        el.textContent = pool[Math.floor(Math.random() * pool.length)];

        // posizione di partenza: centro schermo
        el.style.left = '50%';
        el.style.top = '50%';

        // direzione casuale
        const dx = (Math.random() * 2 - 1) * (120 + Math.random() * 220);
        const dy = (Math.random() * 2 - 1) * (120 + Math.random() * 220);
        el.style.setProperty('--dx', `${dx}px`);
        el.style.setProperty('--dy', `${dy}px`);
        el.style.fontSize = (1.0 + Math.random() * 1.8) + 'rem';
        container.appendChild(el);
        window.setTimeout(() => el.remove(), 1300);
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    // Set music source and volume
    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    // Initial label
    musicToggle.textContent = config.music.startText;

    // Try autoplay if enabled (potrebbe essere bloccato)
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => { musicToggle.textContent = config.music.stopText; })
                .catch(() => {
                    console.log('Autoplay blocked — will start on first interaction.');
                    musicToggle.textContent = config.music.startText;
                    armMusicUnlock(bgMusic, musicToggle);
                });
        }
    } else {
        // Even without autoplay, allow 1-click unlock if user taps anywhere
        armMusicUnlock(bgMusic, musicToggle);
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
} 

function armMusicUnlock(bgMusic, musicToggle) {
    if (!bgMusic) return;
    const unlock = () => {
        bgMusic.play()
            .then(() => { musicToggle.textContent = config.music.stopText; })
            .catch(() => {});
        document.removeEventListener('pointerdown', unlock);
        document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
    window.__musicUnlock = unlock;
}

function tryStartMusicOnUserGesture() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!bgMusic || !musicToggle) return;
    if (!config.music?.enabled) return;
    if (!bgMusic.paused) return;
    bgMusic.play().then(() => { musicToggle.textContent = config.music.stopText; }).catch(() => {});
}

// =====================================
// Canvas particles (cuori che “nevicano”)
// =====================================
function startParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pool = [...(config.floatingEmojis?.hearts || ['💖']), ...(config.floatingEmojis?.sparkles || [])];
    const particles = [];
    const low = !!window.__lowEnd;
    const DPR = Math.min(low ? 1.25 : 1.75, window.devicePixelRatio || 1);

    const resize = () => {
        canvas.width = Math.floor(window.innerWidth * DPR);
        canvas.height = Math.floor(window.innerHeight * DPR);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: -20 - Math.random() * 120,
            s: 10 + Math.random() * 18,
            r: Math.random() * Math.PI * 2,
            vr: (Math.random() * 2 - 1) * 0.02,
            vx: (Math.random() * 2 - 1) * 0.25,
            vy: 0.7 + Math.random() * 1.2,
            a: 0.25 + Math.random() * 0.55,
            ch: pool[Math.floor(Math.random() * pool.length)]
        });
        if (particles.length > (low ? 95 : 140)) particles.shift();
    };

    for (let i = 0; i < (low ? 34 : 52); i++) spawn();
    window.setInterval(spawn, low ? 820 : 560);

    // Throttle FPS to reduce CPU usage on low-end devices
    const targetFps = low ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let lastTs = 0;

    const tick = (ts) => {
        if (document.hidden) {
            requestAnimationFrame(tick);
            return;
        }
        if (ts - lastTs < frameInterval) {
            requestAnimationFrame(tick);
            return;
        }
        lastTs = ts;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.r += p.vr;
            if (p.y > window.innerHeight + 40) {
                p.y = -40;
                p.x = Math.random() * window.innerWidth;
            }

            ctx.save();
            ctx.globalAlpha = p.a;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.r);
            ctx.font = `${p.s}px "Poppins", system-ui, sans-serif`;
            ctx.fillText(p.ch, -p.s / 2, p.s / 2);
            ctx.restore();
        }
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}