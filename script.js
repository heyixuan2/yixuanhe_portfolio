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
  // 1. TECH MOSAIC NAME REVEAL
  //    Wraps chars in-place, no layout shift
  // ==========================================
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    const glyphSets = [
      '█▓▒░▄▀■□▪▫',
      '0110100101',
      '⠁⠂⠄⡀⢀⠈⠐⠠⡁⢁',
      '╔╗╚╝║═╬╣╠╩╦├┤┬┴┼',
      'ΞΣΠΩΔΦΨΛABCDEFGHXYZ',
    ];
    const allGlyphs = glyphSets.join('');
    const originalHTML = heroName.innerHTML;

    heroName.style.transform = 'none';

    // Wrap every visible character in a span, preserving structure (.outline etc)
    function wrapChars(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          for (const ch of text) {
            if (ch === ' ' || ch === '\n') {
              frag.appendChild(document.createTextNode(ch));
            } else {
              const s = document.createElement('span');
              s.className = 'mc';
              s.dataset.f = ch;
              s.textContent = allGlyphs[Math.floor(Math.random() * allGlyphs.length)];
              frag.appendChild(s);
            }
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('mc')) {
          wrapChars(child);
        }
      });
    }

    setTimeout(() => {
      wrapChars(heroName);
      heroName.classList.add('mosaic-active');

      // Add scanline as a real element; track when it started
      const scanline = document.createElement('div');
      scanline.className = 'mosaic-scanline';
      heroName.appendChild(scanline);
      const scanlineStart = performance.now();
      const scanlineCycle = 800; // matches CSS 0.8s

      const chars = heroName.querySelectorAll('.mc');
      const totalDuration = 1200;
      const staggerBase = totalDuration / chars.length;

      chars.forEach((span, i) => {
        const final = span.dataset.f;
        const resolveAt = 300 + (i * staggerBase * 0.6) + Math.random() * 200;
        const cycleInterval = 50;
        let elapsed = 0;

        const timer = setInterval(() => {
          elapsed += cycleInterval;
          const phase = Math.min(Math.floor(elapsed / (resolveAt / glyphSets.length)), glyphSets.length - 1);
          const set = glyphSets[phase];
          span.textContent = set[Math.floor(Math.random() * set.length)];
          span.style.opacity = 0.3 + Math.random() * 0.7;
          // Mix of black, white, and blue for mosaic feel
          const colorRoll = Math.random();
          if (colorRoll < 0.45) {
            span.style.color = 'var(--text-primary)';
          } else if (colorRoll < 0.7) {
            span.style.color = '#ccc';
          } else {
            span.style.color = 'var(--accent-blue)';
          }

          if (elapsed >= resolveAt) {
            clearInterval(timer);
            span.textContent = final;
            span.style.opacity = '1';
            // Brief blue flash, then fade to final black
            span.style.color = 'var(--accent-blue)';
            span.style.textShadow = '0 0 12px rgba(37,99,235,0.6)';
            span.style.transition = 'color 0.4s ease, text-shadow 0.4s ease';
            requestAnimationFrame(() => {
              setTimeout(() => {
                span.style.color = 'var(--text-primary)';
                span.style.textShadow = 'none';
              }, 80);
            });
          }
        }, cycleInterval);
      });

      // After all resolved, let scanline finish its current cycle then remove
      setTimeout(() => {
        const elapsed = performance.now() - scanlineStart;
        const msIntoCurrentCycle = elapsed % scanlineCycle;
        const msUntilCycleEnd = scanlineCycle - msIntoCurrentCycle;

        // Wait for cycle to finish (scanline reaches bottom at opacity 0.3)
        setTimeout(() => {
          // Stop repeating — freeze at end-of-cycle position
          scanline.style.animation = 'none';
          scanline.style.opacity = '0';
          scanline.style.transition = 'opacity 0.15s ease';

          setTimeout(() => {
            heroName.classList.remove('mosaic-active');
            heroName.innerHTML = originalHTML;
          }, 200);
        }, msUntilCycleEnd);
      }, totalDuration + 100);

      // Start idle glitch after full cleanup
      setTimeout(() => {

        // Idle glitch: randomly flicker 1-2 chars every few seconds
        let glitchRunning = false;

        function idleGlitch() {
          if (glitchRunning) return;
          glitchRunning = true;

          // Snapshot the full original text so we can always restore cleanly
          const fullText = heroName.textContent;
          const textNodes = [];

          // Collect all text nodes
          function walk(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              textNodes.push(node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              Array.from(node.childNodes).forEach(walk);
            }
          }
          walk(heroName);

          if (!textNodes.length) { glitchRunning = false; return; }

          // Pick a random text node and a random char in it
          const node = textNodes[Math.floor(Math.random() * textNodes.length)];
          const str = node.textContent;
          const validIndices = [];
          for (let i = 0; i < str.length; i++) {
            if (str[i] !== ' ' && str[i] !== '\n') validIndices.push(i);
          }
          if (!validIndices.length) { glitchRunning = false; return; }

          const idx = validIndices[Math.floor(Math.random() * validIndices.length)];
          const originalChar = str[idx];

          // Split text node into 3 parts: before, glitch span, after
          const before = str.substring(0, idx);
          const after = str.substring(idx + 1);

          const beforeNode = document.createTextNode(before);
          const afterNode = document.createTextNode(after);
          const glitchSpan = document.createElement('span');
          glitchSpan.style.color = 'var(--accent-blue)';
          glitchSpan.style.transition = 'color 0.3s ease';
          glitchSpan.textContent = allGlyphs[Math.floor(Math.random() * allGlyphs.length)];

          const parent = node.parentNode;
          parent.insertBefore(beforeNode, node);
          parent.insertBefore(glitchSpan, node);
          parent.insertBefore(afterNode, node);
          parent.removeChild(node);

          // Flicker a couple glyphs then restore
          let flicks = 0;
          const maxFlicks = 2 + Math.floor(Math.random() * 3);
          const flickInterval = setInterval(() => {
            flicks++;
            glitchSpan.textContent = allGlyphs[Math.floor(Math.random() * allGlyphs.length)];
            if (flicks >= maxFlicks) {
              clearInterval(flickInterval);
              glitchSpan.textContent = originalChar;
              glitchSpan.style.color = 'inherit';
              // After transition, merge nodes back safely
              setTimeout(() => {
                try {
                  // Rebuild the full string from the 3 sibling nodes
                  const merged = document.createTextNode(before + originalChar + after);
                  if (beforeNode.parentNode === parent) parent.removeChild(beforeNode);
                  if (glitchSpan.parentNode === parent) parent.removeChild(glitchSpan);
                  if (afterNode.parentNode === parent) parent.removeChild(afterNode);
                  // Insert merged node where the group was
                  // Find the right position — use the next sibling if available
                  parent.normalize(); // merge adjacent text nodes first
                  // Re-walk to find where to insert
                  const existingNodes = Array.from(parent.childNodes);
                  if (existingNodes.length === 0) {
                    parent.appendChild(merged);
                  } else {
                    // Just set the parent's innerHTML back to the original
                    heroName.innerHTML = originalHTML;
                  }
                } catch (e) {
                  // Safety fallback: restore original HTML
                  heroName.innerHTML = originalHTML;
                }
                glitchRunning = false;
              }, 350);
            }
          }, 70);
        }

        // Run idle glitch every 3–6 seconds
        setInterval(() => {
          idleGlitch();
        }, 3000 + Math.random() * 3000);

      }, totalDuration + 1200);
    }, 400);
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
        typingSpeed = 80 + Math.random() * 60;
      } else {
        roleEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typingSpeed = 400;
        } else {
          typingSpeed = 40;
        }
      }
      setTimeout(typeRole, typingSpeed);
    }

    setTimeout(typeRole, 1200);
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
    const lines = terminalBody.querySelectorAll('div, br');
    const originalContent = terminalBody.innerHTML;
    terminalBody.innerHTML = '';
    terminalBody.style.opacity = '1';

    let delay = 0;
    const lineElements = originalContent.split('\n').filter(l => l.trim());

    terminalBody.innerHTML = '';

    // Re-insert with staggered reveal
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

  // Timeline progressive reveal
  const timelineItems = document.querySelectorAll('.timeline-item');
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
  // 4. 3D CARD TILT EFFECT
  // ==========================================
  const tiltCards = document.querySelectorAll('.card, .cert-card');
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
  // 12. SMOOTH PAGE LOAD SEQUENCE
  // ==========================================
  document.body.classList.add('page-loaded');

  // ==========================================
  // 13. NEURAL NETWORK BACKGROUND
  // ==========================================
  const neuralCanvas = document.getElementById('neural-bg');
  if (neuralCanvas) {
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
      const lineAlphaBase = isDark ? 0.20 : 0.14;
      const nodeAlpha = isDark ? 0.33 : 0.25;
      const lineW = isDark ? 0.8 : 0.7;
      const nodeW = isDark ? 1.0 : 0.9;

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
            ctx.lineWidth = isDark ? 0.7 : 0.6;
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

  // 14. Theme persistence (terminal commands are inline in index.html)
  try {
    if (localStorage.getItem('portfolio-theme') === 'dark') {
      document.documentElement.classList.add('dark-theme');
    }
  } catch(e) {}

});
