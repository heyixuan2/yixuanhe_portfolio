/* ============================================
   ADAM HE PORTFOLIO — Shared JavaScript
   ============================================ */

// --- Intersection Observer for fade-in animations ---
document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Nav scroll effect ---
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      nav.style.borderBottomColor = 'rgba(200, 200, 200, 0.8)';
    } else {
      nav.style.borderBottomColor = 'rgba(200, 200, 200, 0.3)';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // --- Smooth cursor glow effect on project cards ---
  const cards = document.querySelectorAll('.project-card, .card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(0,0,0,0.02), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--bg-card)';
    });
  });

  // --- Typing effect for terminal (optional enhancement) ---
  const terminalOutputs = document.querySelectorAll('.terminal-body');
  terminalOutputs.forEach(terminal => {
    terminal.style.opacity = '0';
    terminal.style.transition = 'opacity 0.6s ease';

    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          terminalObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    terminalObserver.observe(terminal);
  });
});
