/* ==========================================================================
   DARK GALAXY BEST FRIEND UI - INTERACTIVE ENGINE (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GALAXY CANVAS & STARFIELD ENGINE
     ========================================================================== */
  const canvas = document.getElementById('galaxyCanvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  const stars = [];
  const shootingStars = [];
  const starColors = ['#ffffff', '#ff2a85', '#9d4edd', '#00f0ff', '#ffbe0b'];

  function initStars() {
    stars.length = 0;
    const numStars = Math.floor((width * height) / 3000);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        alpha: Math.random(),
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
      });
    }
  }

  function spawnShootingStar() {
    if (Math.random() < 0.03 && shootingStars.length < 3) {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        angle: Math.PI / 4,
        alpha: 1,
        color: '#ff65b4'
      });
    }
  }

  function animateGalaxy() {
    ctx.clearRect(0, 0, width, height);

    // Draw background stars
    stars.forEach(star => {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, star.alpha);
      ctx.shadowBlur = star.radius > 1 ? 8 : 0;
      ctx.shadowColor = star.color;
      ctx.fill();
    });

    // Draw shooting stars
    spawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const endX = s.x + Math.cos(s.angle) * s.length;
      const endY = s.y + Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 42, 133, ${s.alpha})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.015;

      if (s.alpha <= 0 || s.x > width || s.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(animateGalaxy);
  }

  initStars();
  animateGalaxy();

  /* ==========================================================================
     2. DYNAMIC FLOATING NEON HEARTS SPAWNER
     ========================================================================== */
  const heartsContainer = document.getElementById('floatingHearts');
  const heartIcons = ['💖', '💕', '✨', '💗', '💖', '🌸'];

  function createFloatingHeart() {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.animationDuration = `${Math.random() * 4 + 6}s`;
    heart.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
    
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }

  setInterval(createFloatingHeart, 2500);

  /* ==========================================================================
     3. WEB AUDIO SYNTHESIZER MUSIC PLAYER (REAL SOUND GENERATOR)
     ========================================================================== */
  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;
  let trackProgress = 0;
  let progressTimer = null;

  const mainPlayBtn = document.getElementById('mainPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const eqContainer = document.getElementById('eqContainer');
  const albumArt = document.getElementById('playerAlbumArt');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const progressFill = document.getElementById('progressFill');
  const currentTimeEl = document.getElementById('currentTime');

  // Melody notes frequencies (C Major / A Minor synth chill vibe)
  const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];

  function playSynthChord() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const note = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  }

  const playBadgeIcon = document.getElementById('playBadgeIcon');
  const spotifyIframe = document.getElementById('spotifyIframe');
  const spotifyEmbedWrapper = document.getElementById('spotifyEmbedWrapper');

  const spotifyTrackUrl = "https://open.spotify.com/embed/track/6FjbAnaPRPwiP3sciEYctO?utm_source=generator&theme=0&autoplay=1";
  const spotifyStaticUrl = "https://open.spotify.com/embed/track/6FjbAnaPRPwiP3sciEYctO?utm_source=generator&theme=0";

  function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      playIcon.innerText = '⏸';
      eqContainer.classList.add('playing');
      albumArt.classList.add('spinning');
      audioToggleBtn.classList.add('active');
      if (spotifyIframe) {
        spotifyIframe.src = spotifyTrackUrl;
        spotifyEmbedWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      playSynthChord();
      synthInterval = setInterval(playSynthChord, 800);

      progressTimer = setInterval(() => {
        trackProgress += 1;
        if (trackProgress > 197) trackProgress = 0;
        const pct = (trackProgress / 197) * 100;
        progressFill.style.width = `${pct}%`;

        const mins = Math.floor(trackProgress / 60);
        const secs = String(trackProgress % 60).padStart(2, '0');
        currentTimeEl.innerText = `${mins}:${secs}`;
      }, 1000);

    } else {
      playIcon.innerText = '▶';
      eqContainer.classList.remove('playing');
      albumArt.classList.remove('spinning');
      audioToggleBtn.classList.remove('active');
      if (spotifyIframe) {
        spotifyIframe.src = spotifyStaticUrl;
      }

      clearInterval(synthInterval);
      clearInterval(progressTimer);
    }
  }

  mainPlayBtn.addEventListener('click', togglePlay);
  if (playBadgeIcon) playBadgeIcon.addEventListener('click', togglePlay);
  audioToggleBtn.addEventListener('click', togglePlay);

  // Favorite Heart Song Button
  const favSongBtn = document.getElementById('favSongBtn');
  favSongBtn.addEventListener('click', () => {
    favSongBtn.style.transform = 'scale(1.3)';
    favSongBtn.style.color = '#ff2a85';
    setTimeout(() => favSongBtn.style.transform = 'scale(1)', 200);
    if (window.confetti) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }
  });

  /* ==========================================================================
     4. SECRET MESSAGE MODAL
     ========================================================================== */
  const secretMsgBtn = document.getElementById('secretMsgBtn');
  const secretModal = document.getElementById('secretModal');
  const closeSecretModal = document.getElementById('closeSecretModal');
  const unlockPassBtn = document.getElementById('unlockPassBtn');
  const secretRevealedBox = document.getElementById('secretRevealedBox');

  secretMsgBtn.addEventListener('click', () => {
    secretModal.classList.add('active');
  });

  closeSecretModal.addEventListener('click', () => {
    secretModal.classList.remove('active');
  });

  unlockPassBtn.addEventListener('click', () => {
    secretRevealedBox.classList.remove('hidden');
    if (window.confetti) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    }
  });

  /* ==========================================================================
     5. PHOTO GALLERY LIGHTBOX & FILTERS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxSub = document.getElementById('lightboxSub');
  const closeLightbox = document.getElementById('closeLightbox');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryCards.forEach(card => {
        if (filter === 'all' || card.classList.contains(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.querySelector('img').src;
      const title = card.getAttribute('data-title');
      const sub = card.getAttribute('data-sub');

      lightboxImg.src = imgSrc;
      lightboxTitle.innerText = title;
      lightboxSub.innerText = sub;

      lightboxModal.classList.add('active');
    });
  });

  closeLightbox.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  /* ==========================================================================
     6. INSIDE JOKES 3D FLIP CARDS
     ========================================================================== */
  const jokeCards = document.querySelectorAll('.joke-card-3d');
  jokeCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  /* ==========================================================================
     7. SURPRISE BUTTON & CONFETTI REEL
     ========================================================================== */
  const surpriseChestBtn = document.getElementById('surpriseChestBtn');
  const topSurpriseBtn = document.getElementById('topSurpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const closeSurpriseModal = document.getElementById('closeSurpriseModal');
  const spinAgainBtn = document.getElementById('spinAgainBtn');
  const fortuneText = document.getElementById('fortuneText');

  const fortunes = [
    '"Your friendship will spawn 100+ more legendary adventures and infinite coffee runs!" ☕✨',
    '"You are officially voted the #1 most trustworthy secret keeper in the galaxy!" 🔒🌌',
    '"Warning: Continued friendship may cause uncontrollable laughter and late-night boba cravings!" 🧋😂',
    '"Cosmic Guarantee: 100% chance of remaining best friends for life!" 💖♾️',
    '"Next up: A spontaneous roadtrip with zero plans and 100% good vibes!" 🚗💨'
  ];

  function openSurprise() {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    fortuneText.innerText = randomFortune;
    surpriseModal.classList.add('active');

    if (window.confetti) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }

  surpriseChestBtn.addEventListener('click', openSurprise);
  topSurpriseBtn.addEventListener('click', openSurprise);

  spinAgainBtn.addEventListener('click', () => {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    fortuneText.innerText = randomFortune;
    if (window.confetti) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    }
  });

  closeSurpriseModal.addEventListener('click', () => {
    surpriseModal.classList.remove('active');
  });

  /* ==========================================================================
     8. LOVE COUNTER & INTERACTIVE HEART BURST
     ========================================================================== */
  const loveBtn = document.getElementById('loveBtn');
  const loveCount = document.getElementById('loveCount');
  let currentLove = 1000000;

  loveBtn.addEventListener('click', (e) => {
    currentLove += 1;
    loveCount.innerText = currentLove.toLocaleString();

    // Create small heart burst at cursor/button
    const burst = document.createElement('span');
    burst.innerText = '💖';
    burst.style.position = 'fixed';
    burst.style.left = `${e.clientX}px`;
    burst.style.top = `${e.clientY - 20}px`;
    burst.style.fontSize = '1.5rem';
    burst.style.pointerEvents = 'none';
    burst.style.transition = 'all 0.8s ease-out';
    burst.style.zIndex = '9999';
    document.body.appendChild(burst);

    setTimeout(() => {
      burst.style.transform = 'translateY(-60px) scale(1.5)';
      burst.style.opacity = '0';
    }, 20);

    setTimeout(() => burst.remove(), 850);

    if (window.confetti) {
      confetti({ particleCount: 25, spread: 40, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight } });
    }
  });

  /* ==========================================================================
     9. SCROLL ANIMATIONS & NAVBAR HIGHLIGHT
     ========================================================================== */
  const observerOptions = {
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Highlight active nav link
        const id = entry.target.getAttribute('id');
        if (id) {
          document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(sec => {
    observer.observe(sec);
  });

  // Close modals on overlay click or ESC
  window.addEventListener('click', (e) => {
    if (e.target === secretModal) secretModal.classList.remove('active');
    if (e.target === surpriseModal) surpriseModal.classList.remove('active');
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      secretModal.classList.remove('active');
      surpriseModal.classList.remove('active');
      lightboxModal.classList.remove('active');
    }
  });

});
