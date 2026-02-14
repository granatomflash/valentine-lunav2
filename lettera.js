// Lettera di San Valentino per Luna 💌
const config = window.VALENTINE_CONFIG || {};

document.title = `Lettera per ${config.valentineName || 'Luna'} 💌`;

window.addEventListener('DOMContentLoaded', () => {
  // Performance mode (same idea as home)
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 520;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  window.__lowEnd = !!(config.performance?.forceLowEnd || reducedMotion || smallScreen || cores <= 4 || mem <= 4);
  document.documentElement.classList.toggle('low-end', !!window.__lowEnd);

  const name = config.valentineName || 'Luna';

  const title = document.getElementById('letterTitle');
  const to = document.getElementById('letterTo');
  const body = document.getElementById('letterBody');
  const sign = document.getElementById('letterSign');
  const retypeBtn = document.getElementById('retypeBtn');

  if (title) title.textContent = `Per ${name} 💌`;
  if (to) to.textContent = `Cara ${name},`;
  if (sign) sign.textContent = `— Il tuo Makko`;

  // Testo della lettera (modificalo liberamente)
  const lines = [
    
    `non so se esiste un modo perfetto per dirlo, ma ci provo con tutto quello che ho. Quando penso a te mi viene spontaneo sorridere, come se il cuore sapesse già dove vuole andare. Hai quel tipo di presenza che mi calma e mi accende allo stesso tempo, mi fai sentire al sicuro eppure mi fai battere forte. È una cosa rara e tu sei rara, Luna, in un modo che non riesco più a ignorare. Oggi è San Valentino, sì, ma la verità è che per me sei speciale anche nei giorni normali, quelli senza rose e senza cuori, quelli in cui non succede niente di grande, perché basta che ci sia tu a rendere tutto diverso. Mi piace come sei, mi piace come mi fai sentire, mi piace il modo in cui anche solo un tuo messaggio cambia la mia giornata e più passa il tempo, più mi accorgo che non è una semplice cotta. È che ti voglio davvero, ti voglio nella mia vita, nei miei pensieri, nei miei piani, nelle cose piccole e in quelle importanti. Vorrei costruire ricordi con te, veri, semplici, nostri. Vorrei essere la tua persona, quella che ti sceglie ogni giorno, che ti rispetta sempre, che ti ascolta davvero, che ti fa ridere quando il mondo pesa troppo e che ti stringe forte quando ne hai bisogno e voglio dirtelo chiaramente, io ti amo Luna, ti amo in quel modo che non chiede perfezione ma presenza, in quel modo che non si stanca, che non si spegne, che anzi cresce ogni volta che ti penso e se ultimamente sono andato a dormire presto e ti è sembrato strano, mi scuso. C’era un motivo bello eheheh :3 Stavo lavorando a questo sito e volevo farti una sorpresina, qualcosa che parlasse di noi, anche solo un po’, qualcosa che ti facesse sorridere come tu fai sorridere me. Ci tenevo davvero perché tu per me conti tanto. Quindi sì, questa è la mia domanda, con un po’ di coraggio e tantissimo cuore..... Vuoi essere la mia Bimbetta a San Valentino? 💘`,
    `P.S. Se hai detto sì, preparati, in estate ti porto dove vuoi.... e poi ti rubo un bacio MWAHH 😌`,
  ];

  // Render immediato (niente "scrittura lenta")
  const renderInstant = () => {
    if (!body) return;
    body.innerHTML = '';
    for (const line of lines) {
      const lineEl = document.createElement('span');
      lineEl.className = 'line';
      lineEl.textContent = line;
      body.appendChild(lineEl);
    }
  };

  renderInstant();

  // Surprise overlay (busta)
  const overlay = document.getElementById('envelopeOverlay');
  const openBtn = document.getElementById('openEnvelopeBtn');
  const paper = document.querySelector('.letter-paper');

  const reveal = () => {
    if (paper) paper.classList.add('revealed');
    if (overlay && !overlay.classList.contains('is-hidden')) {
      overlay.classList.add('is-hidden');
      window.setTimeout(() => {
        overlay.style.display = 'none';
      }, 380);
    }
    createMiniBurst();
  };

  const replay = () => {
    if (paper) {
      paper.classList.remove('revealed');
      // force reflow to restart transition
      void paper.offsetHeight;
    }
    if (overlay) {
      overlay.style.display = 'grid';
      overlay.classList.remove('is-hidden');
    }
  };

  if (openBtn) openBtn.addEventListener('click', reveal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) reveal();
    });
  }
  if (retypeBtn) retypeBtn.addEventListener('click', replay);

  createFloatingElements();
  startParticles();
  setupMusicPlayer();

  // mostra la lettera automaticamente dopo un attimo (effetto sorpresa)
  window.setTimeout(reveal, 550);
});

function createFloatingElements() {
  const container = document.querySelector('.floating-elements');
  if (!container) return;
  container.innerHTML = '';

  const hearts = config.floatingEmojis?.hearts || ['💖'];
  const sparkles = config.floatingEmojis?.sparkles || ['✨'];

  const spawn = (className, pool, count) => {
    for (let i = 0; i < count; i++) {
      const div = document.createElement('div');
      div.className = className;
      div.textContent = pool[Math.floor(Math.random() * pool.length)];
      div.style.left = Math.random() * 100 + 'vw';
      div.style.animationDelay = Math.random() * 5 + 's';
      div.style.animationDuration = 10 + Math.random() * 20 + 's';
      div.style.fontSize = (1.1 + Math.random() * 1.7) + 'rem';
      div.style.opacity = (0.20 + Math.random() * 0.55).toFixed(2);
      container.appendChild(div);
    }
  };

  const low = !!window.__lowEnd;
  spawn('heart', hearts, low ? 12 : 18);
  spawn('sparkle', sparkles, low ? 6 : 9);
}

function setupMusicPlayer() {
  const musicControls = document.getElementById('musicControls');
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const musicSource = document.getElementById('musicSource');

  if (!musicControls || !musicToggle || !bgMusic || !musicSource) return;

  if (!config.music?.enabled) {
    musicControls.style.display = 'none';
    return;
  }

  musicSource.src = config.music.musicUrl;
  bgMusic.volume = config.music.volume ?? 0.55;
  bgMusic.load();

  musicToggle.textContent = config.music.startText || '🎵 Avvia musica';

  const armUnlock = () => {
    const unlock = () => {
      bgMusic.play()
        .then(() => { musicToggle.textContent = config.music.stopText || '🔇 Ferma musica'; })
        .catch(() => {});
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
  };

  if (config.music.autoplay) {
    bgMusic.play()
      .then(() => { musicToggle.textContent = config.music.stopText || '🔇 Ferma musica'; })
      .catch(() => armUnlock());
  } else {
    armUnlock();
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = config.music.stopText || '🔇 Ferma musica';
    } else {
      bgMusic.pause();
      musicToggle.textContent = config.music.startText || '🎵 Avvia musica';
    }
  });
}

function startParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const pool = [
    ...(config.floatingEmojis?.hearts || ['💖']),
    ...(config.floatingEmojis?.sparkles || ['✨'])
  ];

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
      a: 0.22 + Math.random() * 0.55,
      ch: pool[Math.floor(Math.random() * pool.length)]
    });
    if (particles.length > (low ? 85 : 130)) particles.shift();
  };

  for (let i = 0; i < (low ? 30 : 46); i++) spawn();
  window.setInterval(spawn, low ? 880 : 600);

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

function createMiniBurst() {
  const container = document.querySelector('.floating-elements');
  if (!container) return;
  const pool = config.floatingEmojis?.hearts || ['💖'];

  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'burst-heart';
    el.textContent = pool[Math.floor(Math.random() * pool.length)];
    el.style.left = '50%';
    el.style.top = '55%';
    const dx = (Math.random() * 2 - 1) * (90 + Math.random() * 180);
    const dy = (Math.random() * 2 - 1) * (90 + Math.random() * 180);
    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.fontSize = (1.0 + Math.random() * 1.6) + 'rem';
    container.appendChild(el);
    window.setTimeout(() => el.remove(), 1300);
  }
}
