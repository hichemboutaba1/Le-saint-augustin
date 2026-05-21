/* ═══════════════════════════════════════════════════════
   LE SAINT AUGUSTIN — Script principal
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar : fond au scroll ──────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Menu mobile (burger) ─────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });

  /* ─── Onglets menu ─────────────────────────────────── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b  => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ─── Reveal au scroll — éléments discrets ─────────── */
  const revealSelectors = [
    '.card', '.menu-item', '.horaire-row', '.contact-item',
    '.avis-card', '.formule-card', '.histoire-text',
    '.histoire-img-wrap', '.priv-feature', '.chiffre'
  ].join(', ');

  const revealEls = document.querySelectorAll(revealSelectors);
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.dataset.delay ?? i * 80);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── Reveal sections entières (titre + contenu) ───── */
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(el => el.classList.add('reveal'));
  sectionHeaders.forEach(el => revealObserver.observe(el));

  /* ─── Bande défilante : duplication pour boucle ────── */
  const band = document.querySelector('.band-inner');
  if (band) band.innerHTML += band.innerHTML;

  /* ─── Galerie : pause/reprise au touch mobile ───────── */
  const track = document.getElementById('galleryTrack');
  if (track) {
    track.addEventListener('touchstart', () => {
      track.style.animationPlayState = 'paused';
    }, { passive: true });
    track.addEventListener('touchend', () => {
      track.style.animationPlayState = 'running';
    }, { passive: true });
  }

  /* ─── Compteur animé pour les chiffres-clés ─────────── */
  const counters = document.querySelectorAll('.chiffre-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const num = parseFloat(text);
        if (!isNaN(num) && num > 1) {
          let start = 0;
          const step = num / 30;
          const timer = setInterval(() => {
            start += step;
            if (start >= num) { el.textContent = text; clearInterval(timer); }
            else el.textContent = Math.floor(start) + (text.includes('+') ? '+' : '');
          }, 40);
        }
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));

  /* ─── Lien actif dans la nav selon section visible ──── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle(
          'active-nav',
          a.getAttribute('href') === '#' + entry.target.id
        ));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

});
