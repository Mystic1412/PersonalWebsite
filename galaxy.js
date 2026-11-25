document.addEventListener('DOMContentLoaded', () => {
  // Create and insert the canvas behind everything
  const canvas = document.createElement('canvas');
  canvas.id = 'galaxyCanvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let shootingStars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  // Generate twinkling stars
  function initStars() {
    stars = [];
    const starCount = Math.floor((width * height) / 4500); // Scales automatically with screen size
    const colors = ['#ffffff', '#bae6fd', '#38bdf8', '#e0e7ff', '#fbcfe8'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random(),
        twinkleSpeed: (Math.random() * 0.015) + 0.003,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.08
      });
    }
  }

  // Soft nebula glow clouds matching your site's theme
  function drawNebula() {
    // Top-right sky-blue nebula
    const grad1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 20, width * 0.8, height * 0.2, width * 0.45);
    grad1.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
    grad1.addColorStop(0.5, 'rgba(30, 58, 138, 0.06)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    // Bottom-left deep indigo/purple nebula
    const grad2 = ctx.createRadialGradient(width * 0.2, height * 0.75, 20, width * 0.2, height * 0.75, width * 0.5);
    grad2.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
    grad2.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);
  }

  // Occasional shooting star
  function spawnShootingStar() {
    if (Math.random() < 0.008 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        alpha: 1
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawNebula();

    // Draw & update stars
    for (let star of stars) {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 1 || star.alpha < 0.15) {
        star.twinkleSpeed *= -1;
      }

      star.x += star.driftX;
      star.y += star.driftY;

      // Wrap around screen edges
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
      ctx.restore();
    }

    // Draw & update shooting stars
    spawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += s.speed;
      s.y += s.speed * 0.6;
      s.alpha -= 0.02;

      if (s.alpha <= 0) {
        shootingStars.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.alpha;
      const tailGrad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.6);
      tailGrad.addColorStop(0, '#bae6fd');
      tailGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * 0.6);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
});