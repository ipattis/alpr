/* ============================================
   ALPR - AI Learning Process Record
   Interactive Components
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initRevealAnimations();
  initUseCaseTabs();
  initFAQ();
  initRadarChart();
  initMobileMenu();
});

/* --- Navigation --- */
function initNav() {
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScrollY = scrollY;
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -80% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__mobile-toggle');
  const links = document.querySelector('.nav__links');

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '\u2715' : '\u2630';
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '\u2630';
      });
    });
  }
}

/* --- Reveal on Scroll --- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

/* --- Use Case Tabs --- */
function initUseCaseTabs() {
  const tabs = document.querySelectorAll('.usecases__tab');
  const panels = document.querySelectorAll('.usecases__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const inner = item.querySelector('.faq__answer-inner');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq__answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
}

/* --- Radar Chart (Canvas) --- */
function initRadarChart() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Set canvas size
  const displaySize = Math.min(380, window.innerWidth - 100);
  canvas.width = displaySize * dpr;
  canvas.height = displaySize * dpr;
  canvas.style.width = displaySize + 'px';
  canvas.style.height = displaySize + 'px';
  ctx.scale(dpr, dpr);

  const centerX = displaySize / 2;
  const centerY = displaySize / 2;
  const maxRadius = displaySize * 0.38;

  const labels = [
    'Intellectual\nAutonomy',
    'Metacognitive\nAwareness',
    'Productive\nStruggle',
    'Iterative\nRefinement',
    'Knowledge\nTransfer',
    'AI\nLiteracy'
  ];

  const profiles = {
    'independent': {
      name: 'Independent Thinker',
      values: [0.92, 0.78, 0.85, 0.72, 0.68, 0.65],
      color: '99, 102, 241'
    },
    'collaborative': {
      name: 'Collaborative Learner',
      values: [0.65, 0.82, 0.70, 0.88, 0.80, 0.75],
      color: '6, 182, 212'
    },
    'explorer': {
      name: 'Creative Explorer',
      values: [0.70, 0.60, 0.90, 0.65, 0.85, 0.88],
      color: '245, 158, 11'
    },
    'methodical': {
      name: 'Methodical Builder',
      values: [0.75, 0.90, 0.60, 0.95, 0.70, 0.72],
      color: '16, 185, 129'
    }
  };

  let currentProfile = 'independent';
  let animatedValues = [0, 0, 0, 0, 0, 0];
  let targetValues = profiles[currentProfile].values;
  let animationFrame = null;

  function drawRadar() {
    ctx.clearRect(0, 0, displaySize, displaySize);
    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;
    const startAngle = -Math.PI / 2;

    // Draw concentric rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = (maxRadius / 5) * ring;
      ctx.beginPath();
      for (let i = 0; i <= numAxes; i++) {
        const angle = startAngle + i * angleStep;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ring === 5 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon
    const profile = profiles[currentProfile];
    ctx.beginPath();
    for (let i = 0; i <= numAxes; i++) {
      const idx = i % numAxes;
      const angle = startAngle + idx * angleStep;
      const r = maxRadius * animatedValues[idx];
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fillStyle = `rgba(${profile.color}, 0.15)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(${profile.color}, 0.8)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const r = maxRadius * animatedValues[i];
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${profile.color}, 1)`;
      ctx.fill();

      // Score label near point
      ctx.fillStyle = `rgba(${profile.color}, 0.9)`;
      ctx.font = `bold 11px Inter, sans-serif`;
      ctx.textAlign = 'center';
      const labelR = r + 14;
      const lx = centerX + labelR * Math.cos(angle);
      const ly = centerY + labelR * Math.sin(angle);
      ctx.fillText(Math.round(animatedValues[i] * 100), lx, ly + 4);
    }

    // Draw axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const labelRadius = maxRadius + 30;
      const lx = centerX + labelRadius * Math.cos(angle);
      const ly = centerY + labelRadius * Math.sin(angle);

      const lines = labels[i].split('\n');
      lines.forEach((line, idx) => {
        ctx.fillText(line, lx, ly + idx * 14 - (lines.length - 1) * 7);
      });
    }
  }

  function animate() {
    let needsUpdate = false;
    for (let i = 0; i < 6; i++) {
      const diff = targetValues[i] - animatedValues[i];
      if (Math.abs(diff) > 0.005) {
        animatedValues[i] += diff * 0.08;
        needsUpdate = true;
      } else {
        animatedValues[i] = targetValues[i];
      }
    }

    drawRadar();

    if (needsUpdate) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function switchProfile(profileKey) {
    currentProfile = profileKey;
    targetValues = profiles[profileKey].values;

    document.querySelectorAll('.demo__radar-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.profile === profileKey);
    });

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animate();
  }

  // Init
  targetValues = profiles[currentProfile].values;
  animate();

  // Bind controls
  document.querySelectorAll('.demo__radar-btn').forEach(btn => {
    btn.addEventListener('click', () => switchProfile(btn.dataset.profile));
  });

  // Handle resize
  window.addEventListener('resize', () => {
    const newSize = Math.min(380, window.innerWidth - 100);
    canvas.width = newSize * dpr;
    canvas.height = newSize * dpr;
    canvas.style.width = newSize + 'px';
    canvas.style.height = newSize + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    drawRadar();
  });
}

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
