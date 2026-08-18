/* ===================================================
   CYBERSECURITY + VIBE DEV PORTFOLIO — script.js
   =================================================== */

// ==========================================
// 0. SECRET DAEMON ROUTE  (/daemon → admin)
// ==========================================
(function initDaemonRoute() {
  let buffer = '';
  const SECRET = '/daemon';
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement && document.activeElement.isContentEditable)) {
      buffer = '';
      return;
    }
    buffer += e.key;
    if (buffer.length > SECRET.length) buffer = buffer.slice(-SECRET.length);
    if (buffer === SECRET) {
      buffer = '';
      document.body.style.transition = 'opacity 0.25s';
      document.body.style.opacity = '0';
      setTimeout(() => {
        if (window.location.protocol === 'file:') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = '/daemon';
        }
      }, 260);
    }
  });
})();

// ==========================================
// 1. MATRIX RAIN BACKGROUND
// ==========================================
(function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, drops;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const cols = Math.floor(W / 16);
    drops = new Array(cols).fill(1);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(8,11,16,0.05)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#00ff41';
    ctx.font = '13px JetBrains Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#00d4ff' : '#00ff41';
      ctx.globalAlpha = Math.random() * 0.6 + 0.2;
      ctx.fillText(char, i * 16, y * 16);
      ctx.globalAlpha = 1;
      if (y * 16 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  setInterval(draw, 60);
})();

// ==========================================
// 2. NAVBAR SCROLL BEHAVIOR & MOBILE MENU
// ==========================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && navLinks) {
        navLinks.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = navLinks.querySelector(`[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

// ==========================================
// 3. HERO TERMINAL & TYPEWRITER
// ==========================================
(function initHeroTerminal() {
  const sequences = [
    { el: 'cmd1', text: 'whoami', delay: 400, speed: 80 },
    { el: 'cmd2', show: 'line2', text: 'cat status.txt', delay: 800, speed: 70 },
    { el: 'cmd3', show: 'line3', text: '> Engineering Student (CSE) | Cybersecurity Learner', delay: 300, speed: 20 },
    { el: 'cmd4', show: 'line4', text: '> Status: Building projects & solving CTFs 🚀', delay: 500, speed: 20 },
    { el: null, show: 'line5', delay: 600 },
  ];

  let totalDelay = 500;

  sequences.forEach(seq => {
    if (seq.show) {
      setTimeout(() => {
        const el = document.getElementById(seq.show);
        if (el) el.style.display = 'flex';
      }, totalDelay);
    }

    if (seq.el && seq.text) {
      const cmdEl = document.getElementById(seq.el);
      let charIdx = 0;
      let delay = totalDelay + (seq.delay || 0);

      seq.text.split('').forEach(char => {
        setTimeout(() => {
          if (cmdEl) cmdEl.textContent += char;
        }, delay + charIdx * (seq.speed || 80));
        charIdx++;
      });

      totalDelay = delay + seq.text.length * (seq.speed || 80) + 200;
    } else {
      totalDelay += seq.delay || 0;
    }
  });

  // Student Vibe Subtitle Typewriter
  const subtitleEl = document.getElementById('hero-subtitle');
  if (!subtitleEl) return;

  const roles = [
    'CSE Student 🎓',
    'Cybersecurity Enthusiast 🔐',
    'Vibe Web Developer 🌐',
    'CTF Player 🚩',
    'Continuous Learner ⚡'
  ];
  let roleIdx = 0;
  let charIdx2 = 0;
  let isDeleting = false;

  function typeRole() {
    const role = roles[roleIdx];
    if (!isDeleting) {
      subtitleEl.textContent = role.slice(0, charIdx2 + 1) + '|';
      charIdx2++;
      if (charIdx2 === role.length) {
        isDeleting = true;
        setTimeout(typeRole, 2000);
        return;
      }
    } else {
      subtitleEl.textContent = role.slice(0, charIdx2 - 1) + '|';
      charIdx2--;
      if (charIdx2 === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRole, isDeleting ? 50 : 100);
  }

  setTimeout(typeRole, 1000);
})();

// ==========================================
// 4. SCROLL REVEAL ANIMATIONS
// ==========================================
const globalRevealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      globalRevealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function observeElement(el) {
  if (el) globalRevealObs.observe(el);
}

(function initScrollReveal() {
  const cards = document.querySelectorAll('.project-card, .skill-category, .stat-card');
  cards.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.1}s`;
  });

  const aboutLeft = document.querySelector('.about-grid > *:first-child');
  const aboutRight = document.querySelector('.about-grid > *:last-child');
  if (aboutLeft) aboutLeft.classList.add('reveal-left');
  if (aboutRight) aboutRight.classList.add('reveal-right');

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observeElement(el));
})();

// ==========================================
// 5. STAT COUNTER ANIMATION
// ==========================================
(function initCounters() {
  const statEls = document.querySelectorAll('.stat-num');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 50);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => obs.observe(el));
})();

// ==========================================
// 6. SKILL BAR ANIMATIONS
// ==========================================
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => obs.observe(bar));
})();

// ==========================================
// 7. CERTIFICATE DISPLAY SYSTEM (PUBLIC VIEW)
// ==========================================
(function initCertDisplay() {
  const gallery = document.getElementById('cert-gallery');
  const emptyState = document.getElementById('cert-empty');

  if (!gallery) return;

  const defaultCerts = [
    {
      id: 'default_1',
      name: 'Google Cybersecurity Certificate',
      issuer: 'Coursera / Google',
      year: '2025',
      category: 'Security',
      fileData: null
    },
    {
      id: 'default_2',
      name: 'Introduction to Cybersecurity',
      issuer: 'Cisco Networking Academy',
      year: '2024',
      category: 'Security',
      fileData: null
    },
    {
      id: 'default_3',
      name: 'Web Development Bootcamp',
      issuer: 'Udemy / FreeCodeCamp',
      year: '2024',
      category: 'Web Dev',
      fileData: null
    }
  ];

  async function loadCerts() {
    let certs = [];
    try {
      const response = await fetch('/api/certificates', { cache: 'no-store' });
      if (!response.ok) throw new Error('Certificate API returned ' + response.status);
      certs = await response.json();
    } catch (e) {
      console.warn('Unable to load online certificates:', e);
    }

    // If no online certificates exist, show the original starter certificates.
    if (!Array.isArray(certs) || certs.length === 0) {
      certs = defaultCerts;
    }

    renderGallery(certs);
  }

  function renderGallery(certs) {
    gallery.innerHTML = '';

    if (certs.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    certs.forEach(cert => {
      const card = document.createElement('div');
      card.className = 'cert-card reveal';

      let mediaHtml = '';
      if (cert.fileData && cert.fileData !== '__pdf__') {
        mediaHtml = `<img class="cert-img-preview" src="${cert.fileData}" alt="${escapeHtml(cert.name)}" title="Click to view full image" />`;
      } else if (cert.fileData === '__pdf__') {
        mediaHtml = `<div class="cert-no-image">📄</div>`;
      } else {
        mediaHtml = `<div class="cert-no-image">🎓</div>`;
      }

      card.innerHTML = `
        ${mediaHtml}
        <div class="cert-card-inner">
          <div class="cert-badge">✓</div>
          <div class="cert-body">
            <h4 class="cert-name">${escapeHtml(cert.name)}</h4>
            <p class="cert-issuer">${escapeHtml(cert.issuer)}</p>
            <p class="cert-date">${escapeHtml(String(cert.year))}</p>
            ${cert.category ? `<span class="cert-category">${escapeHtml(cert.category)}</span>` : ''}
          </div>
        </div>
      `;

      // Lightbox preview for uploaded images
      if (cert.fileData && cert.fileData !== '__pdf__') {
        const img = card.querySelector('.cert-img-preview');
        if (img) {
          img.addEventListener('click', () => openLightbox(cert.fileData, cert.name));
        }
      }

      gallery.appendChild(card);
      observeElement(card);
    });
  }

  function openLightbox(src, name) {
    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:4000;
      display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;
      animation:fadeIn 0.2s ease;cursor:zoom-out;padding:20px;
    `;
    lb.innerHTML = `
      <button style="position:absolute;top:20px;right:20px;background:none;border:1px solid rgba(255,255,255,0.3);
        color:#fff;border-radius:50%;width:40px;height:40px;font-size:18px;cursor:pointer;
        display:flex;align-items:center;justify-content:center;">✕</button>
      <img src="${src}" alt="${escapeHtml(name)}" style="max-width:90vw;max-height:80vh;object-fit:contain;
        border-radius:8px;border:1px solid rgba(0,255,65,0.3);" />
      <p style="font-family:var(--font-mono);font-size:0.85rem;color:rgba(255,255,255,0.7);">${escapeHtml(name)}</p>
    `;
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target === lb.querySelector('button')) lb.remove();
    });
    document.body.appendChild(lb);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  loadCerts();
})();

// ==========================================
// 8. CONTACT FORM
// ==========================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = (document.getElementById('contact-name')?.value || '').trim();
    const email = (document.getElementById('contact-email-field')?.value || '').trim();
    const subject = (document.getElementById('contact-subject')?.value || '').trim();
    const message = (document.getElementById('contact-message')?.value || '').trim();

    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }

    // Format mailto link to target email: 60bmssawantsugam@gmail.com
    const mailSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : `[Portfolio Message from ${name || 'Visitor'}]`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`
    );

    // Open Gmail Compose directly in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=daemondistro@gmail.com&su=${mailSubject}&body=${mailBody}`;
    window.open(gmailUrl, '_blank');

    setTimeout(() => {
      if (submitBtn) submitBtn.style.display = 'none';
      if (successMsg) successMsg.style.display = 'flex';
      form.reset();

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.style.display = 'inline-flex';
          submitBtn.textContent = '>_ Send it!';
          submitBtn.disabled = false;
        }
        if (successMsg) successMsg.style.display = 'none';
      }, 4000);
    }, 600);
  });
})();

// ==========================================
// 9. FOOTER CLOCK
// ==========================================
(function initClock() {
  const el = document.getElementById('footer-time');
  if (!el) return;
  function update() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
  update();
  setInterval(update, 1000);
})();

// ==========================================
// 10. FLOATING PARTICLES
// ==========================================
(function initFloatingParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isGreen = Math.random() > 0.5;
    p.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${isGreen ? 'var(--accent-green)' : 'var(--accent-cyan)'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.4 + 0.1};
      animation: float-particle ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 ${size * 3}px ${isGreen ? 'rgba(0,255,65,0.6)' : 'rgba(0,212,255,0.6)'};
    `;
    hero.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.2); }
      50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.8); }
      75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.1); }
    }
  `;
  document.head.appendChild(style);
})();
