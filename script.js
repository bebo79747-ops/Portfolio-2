/* ═══════════════════════════════════════════════════════════
   ZIAD REDA PORTFOLIO — script.js  (Ultimate Edition)
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── HELPERS ────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const lerp  = (a, b, t)   => a + (b - a) * t;

/* ══════════════════════════════════════════════════════════
   1. LOADER
══════════════════════════════════════════════════════════ */
const loader = $('#loader');
window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hidden'), 900);
});

/* ══════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
const cursorDot  = $('#cursorDot');
const cursorRing = $('#cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  ringX = lerp(ringX, mouseX, 0.13);
  ringY = lerp(ringY, mouseY, 0.13);
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

/* Hover effect on interactive elements */
const hoverTargets = 'a, button, .skill-card, .tilt-card, .social-btn, .nav-link';
document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
});

/* ══════════════════════════════════════════════════════════
   3. PARTICLE CANVAS
══════════════════════════════════════════════════════════ */
const canvas = $('#particleCanvas');
const ctx    = canvas ? canvas.getContext('2d') : null;
const PARTICLES = [];
const COUNT  = 85;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function isDark() { return document.documentElement.dataset.theme !== 'light'; }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.r  = Math.random() * 1.8 + 0.4;
    this.a  = Math.random() * 0.6 + 0.15;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    const color = isDark() ? `rgba(0,191,255,${this.a})` : `rgba(0,120,200,${this.a * 0.7})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

for (let i = 0; i < COUNT; i++) PARTICLES.push(new Particle());

function drawConnections() {
  const lineColor = isDark() ? 'rgba(0,191,255,' : 'rgba(0,120,200,';
  for (let i = 0; i < PARTICLES.length; i++) {
    for (let j = i + 1; j < PARTICLES.length; j++) {
      const dx = PARTICLES[i].x - PARTICLES[j].x;
      const dy = PARTICLES[i].y - PARTICLES[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.18;
        ctx.beginPath();
        ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
        ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
        ctx.strokeStyle = lineColor + alpha + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

(function animateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  PARTICLES.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
})();

/* ══════════════════════════════════════════════════════════
   4. TYPEWRITER
══════════════════════════════════════════════════════════ */
const roles = [
  'Math & CS Student',
  'Penetration Tester',
  'AI & Prompt Engineer',
  'Ethical Hacker',
  'ML Enthusiast',
];
let rIdx = 0, cIdx = 0, deleting = false;
const twEl = $('#typewriter');

function type() {
  const word = roles[rIdx];
  if (!deleting) {
    twEl.textContent = word.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    twEl.textContent = word.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 1400);

/* ══════════════════════════════════════════════════════════
   5. NAVBAR — scroll + active link + mobile
══════════════════════════════════════════════════════════ */
const navbar      = $('#navbar');
const navLinks    = $$('.nav-link');
const hamburger   = $('#hamburger');
const navLinkList = $('#navLinks');
const sections    = $$('.section');

let isSolo = false;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateBackTop();
  if (!isSolo) syncActiveLink();
});

function syncActiveLink() {
  let current = '';
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45) current = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === current));
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinkList.classList.toggle('open');
});

/* NAV LINK CLICK */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    hamburger.classList.remove('open');
    navLinkList.classList.remove('open');
    const id = link.dataset.section;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    enterSolo(id);
  });
});

function enterSolo(id) {
  isSolo = true;
  sections.forEach(s => {
    if (s.id === id) {
      s.classList.remove('hidden-section');
      triggerReveals(s);
    } else {
      s.classList.add('hidden-section');
    }
  });
  const footer = $('footer');
  if (footer) footer.style.display = id === 'contact' ? '' : 'none';
  const target = $('#' + id);
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
}

function exitSolo() {
  if (!isSolo) return;
  isSolo = false;
  sections.forEach(s => s.classList.remove('hidden-section'));
  const footer = $('footer');
  if (footer) footer.style.display = '';
}

let soloTimer = null;
window.addEventListener('wheel',     () => { clearTimeout(soloTimer); soloTimer = setTimeout(exitSolo, 50); }, { passive: true });
window.addEventListener('touchmove', () => { clearTimeout(soloTimer); soloTimer = setTimeout(exitSolo, 50); }, { passive: true });

/* ══════════════════════════════════════════════════════════
   6. MAGNETIC BUTTONS
══════════════════════════════════════════════════════════ */
function initMagnetic() {
  $$('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });
}
initMagnetic();

/* ══════════════════════════════════════════════════════════
   7. 3D TILT CARDS
══════════════════════════════════════════════════════════ */
function initTilt() {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const rx = clamp(-y * 14, -14, 14);
      const ry = clamp( x * 14, -14, 14);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
      card.style.transition = 'transform 0.1s linear';

      /* glow follow */
      const glow = card.querySelector('.skill-card-glow, .form-glow');
      if (glow) {
        glow.style.setProperty('--mx', ((x + 0.5) * 100) + '%');
        glow.style.setProperty('--my', ((y + 0.5) * 100) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}
initTilt();

/* ══════════════════════════════════════════════════════════
   8. SCROLL REVEAL
══════════════════════════════════════════════════════════ */
const revealOpts = { threshold: 0.12 };

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.delay || 0);
      setTimeout(() => e.target.classList.add('in'), delay);
    }
  });
}, revealOpts);

function observeReveals(root = document) {
  $$('.reveal-up, .reveal-left, .reveal-right', root).forEach(el => revealObs.observe(el));
}
observeReveals();

function triggerReveals(section) {
  $$('.reveal-up, .reveal-left, .reveal-right', section).forEach(el => {
    el.classList.remove('in');
    void el.offsetWidth;
    const delay = parseInt(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), delay + 50);
  });
}

/* ══════════════════════════════════════════════════════════
   9. BACK TO TOP + SCROLL PROGRESS RING
══════════════════════════════════════════════════════════ */
const backTop    = $('#backTop');
const ringFill   = $('#progressRing');
const CIRCUMF    = 2 * Math.PI * 18; // r=18

function updateBackTop() {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  const pct      = total > 0 ? scrolled / total : 0;
  const offset   = CIRCUMF * (1 - pct);
  ringFill.style.strokeDashoffset = offset;
  backTop.classList.toggle('visible', scrolled > 350);
}

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ══════════════════════════════════════════════════════════
   10. DARK / LIGHT THEME TOGGLE
══════════════════════════════════════════════════════════ */
const themeToggle = $('#themeToggle');
const html        = document.documentElement;

/* Load saved preference */
const savedTheme = localStorage.getItem('zr-theme') || 'dark';
html.dataset.theme = savedTheme;

themeToggle.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('zr-theme', next);
});

/* ══════════════════════════════════════════════════════════
   11. COUNTER ANIMATION
══════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el     = e.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

$$('[data-count]').forEach(el => counterObs.observe(el));

/* ══════════════════════════════════════════════════════════
   12. PROGRESS BAR IN PROJECTS (trigger on view)
══════════════════════════════════════════════════════════ */
const progressFill = $('.progress-fill');
const progressObs  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && progressFill) {
      progressFill.style.width = '68%';
      progressObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
if (progressFill) progressObs.observe(progressFill.closest('.coming-canvas') || progressFill);

/* ══════════════════════════════════════════════════════════
   13. CONTACT FORM
══════════════════════════════════════════════════════════ */
const contactForm = $('#contactForm');
const formStatus  = $('#formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name  = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    const msg   = $('#f-msg').value.trim();

    formStatus.className = 'form-status';

    if (!name || !email || !msg) {
      formStatus.textContent = '⚠ Please fill in all fields.';
      formStatus.classList.add('error');
      shakeForm();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = '⚠ Enter a valid email address.';
      formStatus.classList.add('error');
      shakeForm();
      return;
    }

    /* Open mailto */
    const mailto = `mailto:bebo79747@gmail.com?subject=Portfolio Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg)}%0A%0AFrom: ${encodeURIComponent(email)}`;
    window.location.href = mailto;

    formStatus.textContent = '✓ Message sent successfully!';
    formStatus.classList.add('success');
    contactForm.reset();
    setTimeout(() => formStatus.textContent = '', 4000);
  });
}

function shakeForm() {
  const box = $('.contact-form-box');
  if (!box) return;
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => box.style.animation = '', 400);
}

/* Inject shake keyframe */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
`;
document.head.appendChild(shakeStyle);

/* ══════════════════════════════════════════════════════════
   14. NAVBAR HIGHLIGHT ON SCROLL (section colors)
══════════════════════════════════════════════════════════ */
/* Smooth active link update already handled in syncActiveLink() */

/* ══════════════════════════════════════════════════════════
   15. SECTION ENTER ANIMATION FOR SOLO MODE
══════════════════════════════════════════════════════════ */
/* Already handled inside enterSolo() via triggerReveals() */

/* ══════════════════════════════════════════════════════════
   16. CLOSE MOBILE MENU ON OUTSIDE CLICK
══════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinkList.classList.remove('open');
  }
});

/* ══════════════════════════════════════════════════════════
   17. SKILL CARD MOUSE GLOW TRACKING
══════════════════════════════════════════════════════════ */
$$('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = ((e.clientX - r.left) / r.width)  * 100;
    const y  = ((e.clientY - r.top)  / r.height) * 100;
    const glow = card.querySelector('.skill-card-glow');
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,191,255,0.22) 0%, transparent 60%)`;
    }
  });
});

/* ══════════════════════════════════════════════════════════
   18. STAGGER DELAY FOR SKILL CARDS
══════════════════════════════════════════════════════════ */
$$('.skill-card').forEach((card, i) => {
  card.dataset.delay = i * 80;
});

/* ══════════════════════════════════════════════════════════
   19. WINDOW RESIZE — reinit tilt
══════════════════════════════════════════════════════════ */
window.addEventListener('resize', initTilt);

/* ══════════════════════════════════════════════════════════
   20. PAGE VISIBILITY — pause particles
══════════════════════════════════════════════════════════ */
/* Particles loop uses requestAnimationFrame which auto-pauses on hidden tab */

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  syncActiveLink();
  updateBackTop();
});
