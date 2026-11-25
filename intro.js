document.addEventListener('DOMContentLoaded', () => {
  // 1. Lock scrolling on body
  document.body.classList.add('intro-active');

  // 2. Inject the overlay HTML at the top of <body>
  const overlayHTML = `
    <div id="introOverlay" class="intro-overlay">
      <div id="crosshair" class="crosshair">
        <div class="crosshair-ring"></div>
        <div class="crosshair-dot"></div>
      </div>

      <div class="intro-hud">
        <div class="hud-status">
          <span class="hud-label">SYSTEM LOCKED //</span>
          <span class="hud-targets">TARGETS REMAINING: <strong id="targetsLeft">3</strong></span>
        </div>
        <button id="skipIntroBtn" class="skip-btn">Skip Intro &raquo;</button>
      </div>

      <div class="intro-center-text">
        <p class="intro-tag">&gt; INITIALIZING PORTFOLIO_v2.6</p>
        <h1 class="intro-title">NICHOLE LIN</h1>
        <p class="intro-sub">Shoot all 3 targets to unlock access</p>
      </div>

      <div id="targetArena" class="target-arena"></div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', overlayHTML);

  // 3. Initialize Shooter Mechanics
  const introOverlay = document.getElementById('introOverlay');
  const crosshair = document.getElementById('crosshair');
  const targetArena = document.getElementById('targetArena');
  const targetsLeftDisplay = document.getElementById('targetsLeft');
  const skipIntroBtn = document.getElementById('skipIntroBtn');

  let remainingTargets = 3;
  let gameActive = true;

  // Custom Crosshair Tracking
  document.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    crosshair.style.left = `${e.clientX}px`;
    crosshair.style.top = `${e.clientY}px`;
  });

  // Shot Recoil & Spark Effect
  introOverlay.addEventListener('mousedown', (e) => {
    if (!gameActive) return;
    crosshair.classList.add('firing');
    setTimeout(() => crosshair.classList.remove('firing'), 120);

    const spark = document.createElement('div');
    spark.className = 'shot-spark';
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    introOverlay.appendChild(spark);
    setTimeout(() => spark.remove(), 350);
  });

  // Unlock Website
  function unlockPortfolio() {
    gameActive = false;
    introOverlay.classList.add('unlocked');
    document.body.classList.remove('intro-active');
    setTimeout(() => {
      introOverlay.remove();
    }, 750);
  }

  skipIntroBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    unlockPortfolio();
  });

  // Spawn & Animate Targets
  function spawnTargets(count) {
    const labels = ['CS', 'ECON', 'CODE', 'GAME', 'EDIT', 'VIDEO', 'TECH'];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * labels.length);
      const pickedLabel = labels.splice(randomIndex, 1)[0] || 'HIT';
      const target = document.createElement('div');
      target.className = 'shooting-target';
      target.innerHTML = `
        <div class="target-outer">
          <div class="target-inner">
            <span>${pickedLabel || 'HIT'}</span>
          </div>
        </div>
      `;

      let posX = 15 + Math.random() * 70;
      let posY = 20 + Math.random() * 60;
      const speedScale = 1000/window.innerWidth;
      let velX = (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.1) *speedScale;
      let velY = (Math.random() > 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.1)*speedScale;

      target.style.left = `${posX}%`;
      target.style.top = `${posY}%`;

      function animateTarget() {
        if (!gameActive || target.classList.contains('destroyed')) return;
        posX += velX;
        posY += velY;

        if (posX <= 8 || posX >= 88) velX *= -1;
        if (posY <= 14 || posY >= 82) velY *= -1;

        target.style.left = `${posX}%`;
        target.style.top = `${posY}%`;
        requestAnimationFrame(animateTarget);
      }
      requestAnimationFrame(animateTarget);

      target.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (target.classList.contains('destroyed')) return;

        target.classList.add('destroyed');
        remainingTargets--;
        targetsLeftDisplay.textContent = remainingTargets;

        const hitText = document.createElement('div');
        hitText.className = 'hit-popup';
        hitText.textContent = 'TARGET DESTROYED';
        hitText.style.left = `${e.clientX}px`;
        hitText.style.top = `${e.clientY}px`;
        introOverlay.appendChild(hitText);
        setTimeout(() => hitText.remove(), 600);

        if (remainingTargets <= 0) {
          targetsLeftDisplay.textContent = '0 — ACCESS GRANTED';
          setTimeout(unlockPortfolio, 450);
        }
      });

      targetArena.appendChild(target);
    }
  }

  spawnTargets(3);
});