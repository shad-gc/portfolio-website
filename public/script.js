// client-side bits. no framework, no build step.
// each block is wrapped in an IIFE so nothing leaks to the global scope.

// ── highlight the active nav link based on the current path ──
(function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  // strip the path down to the filename. "" on the root means index.
  const current = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── live clock in the nav status bar ─────────────────────────
// purely decorative. matches the terminal vibe.
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

// ── animate skill bars when they scroll into view ────────────
// snapshot the css width, zero it out, then animate to target on intersect.
(function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  fills.forEach(bar => {
    bar.dataset.target = bar.style.width;
    bar.style.width = '0';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        // tiny delay so the css transition has something to animate from
        setTimeout(() => { bar.style.width = bar.dataset.target; }, 100);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(bar => observer.observe(bar));
})();

// ── typewriter effect for [data-typewriter] elements ─────────
// stagger multiples so they don't all type at once.
(function runTypewriters() {
  const targets = document.querySelectorAll('[data-typewriter]');
  if (!targets.length) return;

  targets.forEach((el, index) => {
    const text = el.dataset.typewriter;
    const speed = parseInt(el.dataset.speed || '50', 10);
    el.textContent = '';
    el.style.borderRight = '2px solid var(--accent-green)';

    let i = 0;
    const delay = index * 400;

    setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          // leave the cursor blinking after the text lands
          el.style.animation = 'blink 0.8s step-end infinite';
        }
      }, speed);
    }, delay);
  });
})();

// ── fade panels in on scroll ──────────────────────────────────
// initial state is set in JS so there's no flash of visible content
// if the script is slow to load.
(function animatePanels() {
  const panels = document.querySelectorAll('.panel, .project-card');
  if (!panels.length) return;

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
