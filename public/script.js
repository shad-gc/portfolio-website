// script.js — Client-side interactivity for the portfolio
// Handles: active nav link, skill bar animation, typewriter effect, clock

// ── Active nav link ──────────────────────────────────────────
(function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  // Match the current page filename (e.g. "resume.html")
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Live clock in nav status bar ─────────────────────────────
(function startClock() {
  const clockEl = document.getElementById('nav-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    clockEl.textContent =
      `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  update();
  setInterval(update, 1000);
})();

// ── Skill bar animation on scroll ────────────────────────────
// Bars start at width:0 and animate to their data-width when visible.
(function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  // Store target widths then reset to 0
  fills.forEach(bar => {
    bar.dataset.target = bar.style.width;
    bar.style.width = '0';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // Small delay so the CSS transition is visible
        setTimeout(() => { bar.style.width = bar.dataset.target; }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(bar => observer.observe(bar));
})();

// ── Typewriter effect for elements with class .typewriter ────
// Replaces CSS-only version so it works for any string length.
(function runTypewriters() {
  const targets = document.querySelectorAll('[data-typewriter]');
  if (!targets.length) return;

  targets.forEach((el, index) => {
    const text = el.dataset.typewriter;
    const speed = parseInt(el.dataset.speed || '50', 10);
    el.textContent = '';
    el.style.borderRight = '2px solid var(--accent-green)';

    let i = 0;
    const delay = index * 400; // stagger multiple typewriters

    setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          // Keep cursor blinking after done
          el.style.animation = 'blink 0.8s step-end infinite';
        }
      }, speed);
    }, delay);
  });
})();

// ── Panel entrance animation ──────────────────────────────────
// Panels fade + slide up when they enter the viewport.
(function animatePanels() {
  const panels = document.querySelectorAll('.panel, .project-card');
  if (!panels.length) return;

  // Set initial invisible state via JS (avoids flash if JS is slow)
  panels.forEach(panel => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(12px)';
    panel.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  panels.forEach(panel => observer.observe(panel));
})();
