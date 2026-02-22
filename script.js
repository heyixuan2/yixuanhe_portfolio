/* ============================================
   YIXUAN HE PORTFOLIO — Advanced Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. TIME-BASED GREETING
  // ==========================================
  const greetingEl = document.getElementById('greeting');
  if (greetingEl) {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      greetingEl.textContent = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      greetingEl.textContent = 'Good afternoon';
    } else if (hour >= 17 && hour < 21) {
      greetingEl.textContent = 'Good evening';
    } else {
      greetingEl.textContent = 'Good evening';
    }
  }

  // ==========================================
  // 1. TYPEWRITER NAME REVEAL
  //    Types out hero name character by character,
  //    then hands off to the role typewriter below
  // ==========================================
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const fullText = heroName.textContent.trim();
    heroName.textContent = '';
    heroName.classList.add('hero-name-typing');

    setTimeout(() => {
      let charIndex = 0;
      const speed = 110; // slower, more deliberate

      function typeChar() {
        if (charIndex < fullText.length) {
          heroName.textContent = fullText.substring(0, charIndex + 1);
          charIndex++;
          const nextDelay = speed + Math.random() * 50;
          setTimeout(typeChar, nextDelay);
        } else {
          // Name done — cursor blinks on this line briefly
          setTimeout(() => {
            // Remove name cursor
            heroName.classList.remove('hero-name-typing');
            // Short pause, then "hop" cursor to role line
            setTimeout(() => {
              const cursor = document.querySelector('.role-cursor');
              if (cursor) cursor.style.opacity = '1';
              // Start role typewriter
              if (typeof window.__startRoleTypewriter === 'function') {
                window.__startRoleTypewriter();
              }
            }, 300);
          }, 800);
        }
      }
      typeChar();
    }, 500);
  }

  // ==========================================
  // 1b. ROTATING ROLE TEXT (Typewriter)
  // ==========================================
  const roleEl = document.querySelector('.role-rotate-text');
  if (roleEl) {
    const roles = [
      'AI Engineer',
      'Machine Learning Engineer',
      'Data Scientist',
      'Business Intelligence Analyst',
      'Digital Transformation Analyst',
      'Data Analyst',
      'Systems Engineer',
      'Marketing Analytics Engineer',
      'AI Workflow Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeRole() {
      const current = roles[roleIndex];

      if (!isDeleting) {
        roleEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = false;
          setTimeout(() => { isDeleting = true; typeRole(); }, 2000);
          return;
        }
        typingSpeed = 120 + Math.random() * 80;
      } else {
        roleEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingSpeed = 500;
        } else {
          typingSpeed = 60;
        }
      }
      setTimeout(typeRole, typingSpeed);
    }

    // Role typewriter waits for name to finish, then gets triggered
    window.__startRoleTypewriter = function() {
      typeRole();
    };

    // Fallback: if hero name doesn't exist, start after delay
    if (!document.querySelector('.hero-name')) {
      setTimeout(() => {
        const cursor = document.querySelector('.role-cursor');
        if (cursor) cursor.style.opacity = '1';
        typeRole();
      }, 2200);
    }
  }

  // ==========================================
  // 1c. STATS BAR COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          const duration = 1200;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
          }
          requestAnimationFrame(tick);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statsObserver.observe(el));
  }

  // ==========================================
  // 2. TERMINAL TYPING EFFECT
  //    Types out lines one by one
  // ==========================================
  function typeTerminal(terminalBody) {
    terminalBody.style.opacity = '1';

    // Preserve interactive elements (form, hint) — don't destroy them
    const preservedEls = [];
    terminalBody.querySelectorAll('form, .terminal-hint').forEach(el => {
      preservedEls.push(el);
      el.remove();
    });

    const originalContent = terminalBody.innerHTML;
    terminalBody.innerHTML = '';

    // Re-insert static content with staggered reveal
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContent;
    const children = Array.from(tempDiv.childNodes);

    children.forEach((child, i) => {
      const wrapper = document.createElement('div');
      wrapper.style.opacity = '0';
      wrapper.style.transform = 'translateY(8px)';
      wrapper.style.transition = `opacity 0.3s ease ${i * 0.12}s, transform 0.3s ease ${i * 0.12}s`;

      if (child.nodeType === 3) {
        wrapper.textContent = child.textContent;
      } else {
        wrapper.appendChild(child.cloneNode(true));
      }

      terminalBody.appendChild(wrapper);

      requestAnimationFrame(() => {
        setTimeout(() => {
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'translateY(0)';
        }, 50);
      });
    });

    // Re-append preserved interactive elements with fade-in
    preservedEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = `opacity 0.3s ease ${(children.length + i) * 0.12}s, transform 0.3s ease ${(children.length + i) * 0.12}s`;
      terminalBody.appendChild(el);
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 50);
      });
    });
  }

  const terminalBodies = document.querySelectorAll('.terminal-body');
  terminalBodies.forEach(terminal => {
    terminal.style.opacity = '0';
    const termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeTerminal(entry.target);
          termObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    termObserver.observe(terminal);
  });

  // ==========================================
  // 3. SCROLL-TRIGGERED FADE-IN (Enhanced)
  //    Different animations per element type
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
  fadeElements.forEach(el => fadeObserver.observe(el));

  // Staggered reveal for grid children
  const grids = document.querySelectorAll('.grid-2, .grid-3, .skills-grid');
  grids.forEach(grid => {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(30px)';
            child.style.transition = `opacity 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s, transform 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`;
            requestAnimationFrame(() => {
              setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              }, 50);
            });
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    gridObserver.observe(grid);
  });

  // Timeline progressive reveal (old vertical — kept as fallback)
  const timelineItems = document.querySelectorAll('.timeline-item, .timeline-group');
  timelineItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;

    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    tlObserver.observe(item);
  });

  // ==========================================
  // HORIZONTAL TIMELINE (Experience Page)
  // ==========================================
  (function() {
    var htlScroll = document.querySelector('.htl-scroll');
    if (!htlScroll) return;

    var slides = document.querySelectorAll('.htl-slide');
    var crumbNodes = document.querySelectorAll('.htl-crumb');
    var prevBtn = document.querySelector('.htl-nav-prev');
    var nextBtn = document.querySelector('.htl-nav-next');
    var progressFill = document.querySelector('.htl-progress-fill');
    var counterCurrent = document.querySelector('.htl-counter-current');
    var totalSlides = slides.length;
    var currentIndex = 0;
    var isScrolling = false;
    var scrollTimeout;

    // Set first slide active
    if (slides[0]) slides[0].classList.add('htl-slide-active');

    // No fill line needed for breadcrumb style

    function retriggerAnimations(index) {
      // Force re-trigger CSS transitions on the newly active slide
      var slide = slides[index];

      // Remove active class to reset all transitions to their base state
      slide.classList.remove('htl-slide-active');

      // Force reflow so the browser registers the removal
      void slide.offsetHeight;

      // Re-add active class — triggers fresh transitions
      slide.classList.add('htl-slide-active');
    }

    function updateState(index) {
      var prevIndex = currentIndex;
      currentIndex = index;
      slides.forEach(function(s, i) {
        s.classList.toggle('htl-slide-active', i === index);
      });
      crumbNodes.forEach(function(node, i) {
        node.classList.remove('htl-crumb-active', 'htl-crumb-passed');
        if (i === index) {
          node.classList.add('htl-crumb-active');
        } else if (i < index) {
          node.classList.add('htl-crumb-passed');
        }
      });
      if (counterCurrent) counterCurrent.textContent = index + 1;
      if (progressFill) {
        progressFill.style.width = ((index + 1) / totalSlides * 100) + '%';
      }
      if (prevIndex !== index) {
        retriggerAnimations(index);
      }
    }

    function scrollToSlide(index) {
      if (index < 0 || index >= totalSlides || isScrolling) return;
      isScrolling = true;
      programmaticScroll = true;
      var target = slides[index];
      htlScroll.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
      updateState(index);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        isScrolling = false;
        programmaticScroll = false;
      }, 1200);
    }

    // IntersectionObserver to detect active slide on native touch/swipe (not programmatic)
    var programmaticScroll = false;
    var observer = new IntersectionObserver(function(entries) {
      if (programmaticScroll) return;
      entries.forEach(function(entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          var idx = parseInt(entry.target.getAttribute('data-slide'));
          if (!isNaN(idx)) updateState(idx);
        }
      });
    }, { root: htlScroll, threshold: 0.5 });
    slides.forEach(function(s) { observer.observe(s); });

    // Nav buttons
    if (prevBtn) prevBtn.addEventListener('click', function() { scrollToSlide(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { scrollToSlide(currentIndex + 1); });

    // Breadcrumb click
    crumbNodes.forEach(function(node) {
      node.addEventListener('click', function() {
        var idx = parseInt(node.getAttribute('data-slide'));
        if (!isNaN(idx)) scrollToSlide(idx);
      });
    });

    // Keyboard
    document.addEventListener('keydown', function(e) {
      if (!document.querySelector('.htl-container')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToSlide(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToSlide(currentIndex - 1);
      }
    });

    // Mouse wheel → horizontal scroll (with accumulated delta for trackpad)
    var wheelAccum = 0;
    var wheelTimer = null;
    var WHEEL_THRESHOLD = 50;
    htlScroll.addEventListener('wheel', function(e) {
      e.preventDefault();
      if (isScrolling) return;
      wheelAccum += (e.deltaY || e.deltaX);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function() { wheelAccum = 0; }, 200);
      if (wheelAccum > WHEEL_THRESHOLD) {
        wheelAccum = 0;
        scrollToSlide(currentIndex + 1);
      } else if (wheelAccum < -WHEEL_THRESHOLD) {
        wheelAccum = 0;
        scrollToSlide(currentIndex - 1);
      }
    }, { passive: false });

    // Mercedes role tab controller
    var subSlides = document.querySelectorAll('.htl-sub-slide');
    var subTabs = document.querySelectorAll('.htl-sub-tab');
    var subIndex = 0;

    function switchSubSlide(newIndex) {
      if (newIndex < 0 || newIndex >= subSlides.length || newIndex === subIndex) return;
      var direction = newIndex > subIndex ? 'next' : 'prev';
      // Update tabs
      subTabs.forEach(function(t) { t.classList.remove('htl-sub-tab-active'); });
      subTabs[newIndex].classList.add('htl-sub-tab-active');
      // Update slides
      subSlides.forEach(function(s) { s.classList.remove('htl-sub-slide-active'); });
      var target = subSlides[newIndex];
      target.style.animation = 'none';
      target.offsetHeight;
      target.style.animation = direction === 'next' ? 'htlSubSlideIn 0.45s ease' : 'htlSubSlideInReverse 0.45s ease';
      target.classList.add('htl-sub-slide-active');
      subIndex = newIndex;
    }

    subTabs.forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        e.stopPropagation();
        var idx = parseInt(tab.getAttribute('data-sub'));
        if (!isNaN(idx)) switchSubSlide(idx);
      });
    });

    // Breadcrumb initialized via HTML classes
  })();

  // ==========================================
  // 4. 3D CARD TILT EFFECT
  // ==========================================
  const tiltCards = document.querySelectorAll('.card:not(.skill-category):not(.edu-glow), .cert-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(37,99,235,0.04), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      card.style.background = 'var(--bg-card)';
    });
  });

  // ==========================================
  // 5. MAGNETIC BUTTON EFFECT
  // ==========================================
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s ease';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  // ==========================================
  // 6. COUNTER ANIMATION
  //    For stat numbers (90%, 140+, 80%+)
  // ==========================================
  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Observe stat cards
  document.querySelectorAll('.card [style*="font-size: 2rem"]').forEach(el => {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(el);
  });

  // ==========================================
  // 7. CURSOR GLOW FOLLOWER
  //    Subtle light following cursor
  // ==========================================
  const cursorGlow = document.createElement('div');
  cursorGlow.classList.add('cursor-glow');
  document.body.appendChild(cursorGlow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ==========================================
  // 8. MOBILE NAVIGATION
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 9. NAV SHRINK ON SCROLL
  // ==========================================
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.height = '52px';
      nav.style.borderBottomColor = 'rgba(200, 200, 200, 0.8)';
      nav.style.boxShadow = '0 1px 20px rgba(0,0,0,0.04)';
    } else {
      nav.style.height = '64px';
      nav.style.borderBottomColor = 'rgba(200, 200, 200, 0.3)';
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });

  // ==========================================
  // 10. PARALLAX GRID BACKGROUND
  // ==========================================
  const gridBg = document.querySelector('.grid-bg');
  if (gridBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      gridBg.style.transform = `translateY(${scrolled * 0.15}px)`;
    }, { passive: true });
  }

  // ==========================================
  // 11. TAG HOVER RIPPLE
  // ==========================================
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('tag-ripple');
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================================
  // 12. PROJECT FILTER TABS
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projCards = document.querySelectorAll('.proj-card[data-categories], .proj-compact[data-categories]');

  if (filterTabs.length && projCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filterValue = tab.getAttribute('data-filter');

        // Update active state
        filterTabs.forEach(t => t.classList.remove('filter-tab-active'));
        tab.classList.add('filter-tab-active');

        // Filter cards (featured + compact)
        projCards.forEach(card => {
          const categories = (card.getAttribute('data-categories') || '').split(' ');
          const isMatch = filterValue === 'all' || categories.includes(filterValue);

          if (isMatch) {
            card.classList.remove('hidden');
            card.style.opacity = '0';
            requestAnimationFrame(() => {
              setTimeout(() => {
                card.style.opacity = '1';
              }, 50);
            });
          } else {
            card.style.opacity = '0';
            setTimeout(() => {
              card.classList.add('hidden');
            }, 300);
          }
        });
      });
    });
  }

  // ==========================================
  // 13. SMOOTH PAGE LOAD SEQUENCE
  // ==========================================
  document.body.classList.add('page-loaded');

  // ==========================================
  // 13. NEURAL NETWORK BACKGROUND
  //     Isolated in try-catch so earlier errors don't kill it
  // ==========================================
  try {
  const neuralCanvas = document.getElementById('neural-bg');
  if (neuralCanvas && window.innerWidth > 768) {
    const ctx = neuralCanvas.getContext('2d');
    let mouseX = -1000, mouseY = -1000;

    const PARTICLE_COUNT = 20;
    const CONNECTION_DIST = 180;
    let particles = [];

    function resizeCanvas() {
      neuralCanvas.width = window.innerWidth;
      neuralCanvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = Math.random() * neuralCanvas.width;
        const py = Math.random() * neuralCanvas.height;
        particles.push({
          x: px,
          y: py,
          homeX: px,
          homeY: py,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 1.5 + Math.random() * 1.5
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
      const W = neuralCanvas.width;
      const H = neuralCanvas.height;

      // Update particle positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        // Mouse interaction
        const dmx = p.x - mouseX;
        const dmy = p.y - mouseY;
        const md = Math.sqrt(dmx * dmx + dmy * dmy);

        if (mouseX > 0 && mouseY > 0) {
          if (md < 200 && md > 50) {
            // Attract toward cursor but stop at ~50px (don't clump)
            const force = (1 - md / 200) * 0.04;
            p.vx -= (dmx / md) * force;
            p.vy -= (dmy / md) * force;
          } else if (md < 50) {
            // Repel if too close — keeps them spread around cursor
            const force = (1 - md / 50) * 0.15;
            p.vx += (dmx / md) * force;
            p.vy += (dmy / md) * force;
          }
        }

        // Gentle friction after mouse interactions only
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Random nudge keeps them wandering
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        // Clamp max velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.5) {
          p.vx = (p.vx / speed) * 0.5;
          p.vy = (p.vy / speed) * 0.5;
        }
      }

      // Check if dark theme is active for stronger visibility
      const isDark = document.documentElement.classList.contains('dark-theme');
      const lineAlphaBase = isDark ? 0.14 : 0.10;
      const nodeAlpha = isDark ? 0.22 : 0.18;
      const lineW = isDark ? 0.6 : 0.5;
      const nodeW = isDark ? 0.8 : 0.7;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * lineAlphaBase;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = lineW;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (outline only)
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37, 99, 235, ${nodeAlpha})`;
        ctx.lineWidth = nodeW;
        ctx.stroke();
      }

      // Draw lines from mouse cursor to nearby nodes
      const MOUSE_CONNECT_DIST = 200;
      if (mouseX > 0 && mouseY > 0) {
        for (const p of particles) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_CONNECT_DIST) {
            const alpha = (1 - dist / MOUSE_CONNECT_DIST) * (isDark ? 0.25 : 0.18);
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = isDark ? 0.5 : 0.4;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    resizeCanvas();
    createParticles();
    requestAnimationFrame(draw);

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = -1000;
      mouseY = -1000;
    });
  }
  } catch(e) { console.warn('Neural network error:', e); }

  // 14. Theme persistence (terminal commands are inline in index.html)
  try {
    if (localStorage.getItem('portfolio-theme') === 'dark') {
      document.documentElement.classList.add('dark-theme');
    }
  } catch(e) {}

});
