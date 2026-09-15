(function () {
    // ---------- Scroll reveal: fade + slide + blur (sections only, cards handled by throw-to-grid) ----------
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.content-layer > div[id], .roadmap-wrap, #dworker-architecture'
        );

        targets.forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                el.style.transitionDelay = (i % 6) * 0.06 + 's';
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    // ---------- Card stagger (disabled — throw-to-grid handles card entrance timing) ----------
    function initCardStagger() {
        return;
    }

    // ---------- Magnetic buttons ----------
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.q-btn, button');
        buttons.forEach((btn) => {
            if (btn.dataset.magnetic) return;
            btn.dataset.magnetic = 'true';

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ---------- Cursor tracking glow ----------
    function initCursorGlow() {
        if (document.getElementById('cursor-glow')) return;

        const glow = document.createElement('div');
        glow.id = 'cursor-glow';
        document.body.appendChild(glow);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.12;
            glowY += (mouseY - glowY) * 0.12;
            glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ---------- Active section indicator ----------
    function initActiveSection() {
        const sections = document.querySelectorAll('.content-layer > div[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        const href = link.getAttribute('href');
                        if (href === '#' + id) {
                            link.classList.add('nav-active');
                        } else {
                            link.classList.remove('nav-active');
                        }
                    });
                }
            });
        }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });

        sections.forEach((s) => observer.observe(s));
    }

    // ---------- Sequential page load reveal ----------
    function initLoadSequence() {
        const steps = [
            { selector: '.navbar', delay: 0 },
            { selector: '.hero-badge', delay: 150 },
            { selector: '.hero-title', delay: 300 },
            { selector: '.typing', delay: 550 },
            { selector: '.hero-wrap .q-row', delay: 750 },
        ];

        steps.forEach(({ selector, delay }) => {
            document.querySelectorAll(selector).forEach((el) => {
                el.classList.add('load-seq');
                setTimeout(() => el.classList.add('load-seq-in'), delay);
            });
        });
    }

    // ---------- Subtle parallax on background blobs ----------
    function initParallax() {
        const blobs = document.querySelectorAll('.blob');
        if (!blobs.length) return;

        let ticking = false;
        function updateParallax() {
            const scrollY = window.scrollY;
            blobs.forEach((blob, i) => {
                const speed = i % 2 === 0 ? 0.15 : 0.25;
                blob.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ---------- Throw to Grid: scroll-driven spring physics card assembly (multi-section) ----------
    function initThrowToGrid() {
        const sectionConfigs = [
            { containerId: 'dworker-features', cardSelector: '.dworker-feature-card' },
            { containerId: 'dworker-roadmap', cardSelector: '.roadmap-version-card' },
            { containerId: 'projects', cardSelector: '.glass-card' },
            { containerId: 'certifications', cardSelector: '.glass-card' },
            { containerId: 'skills', cardSelector: '.glass-card' },
        ];

        function seededRandom(seed) {
            const x = Math.sin(seed * 9999) * 10000;
            return x - Math.floor(x);
        }

        function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
        function lerp(a, b, t) { return a + (b - a) * t; }

        function easeOutElastic(t, decay) {
            if (t <= 0) return 0;
            if (t >= 1) return 1;
            const c4 = (2 * Math.PI) / 3;
            return Math.pow(2, -decay * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        }

        function easeOutBack(t) {
            const c1 = 1.4;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
        }

        sectionConfigs.forEach((config, configIndex) => {
            const section = document.getElementById(config.containerId);
            if (!section) return;
            const cards = Array.from(section.querySelectorAll(config.cardSelector));
            if (!cards.length || section.dataset.throwInit) return;
            section.dataset.throwInit = 'true';

            const shuffledIndices = cards.map((_, i) => i);
            for (let i = shuffledIndices.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom((configIndex + 1) * 100 + i * 13 + 7) * (i + 1));
                [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
            }

            const angleCount = 12;
            const directions = Array.from({ length: angleCount }, (_, i) => {
                const angle = (i / angleCount) * Math.PI * 2;
                return { x: Math.cos(angle), y: Math.sin(angle) };
            });

            const scatter = cards.map((_, i) => {
                const seedBase = (configIndex + 1) * 1000 + i;
                const shuffledPos = shuffledIndices[i];
                const dir = directions[(shuffledPos * 7) % directions.length];
                const dist = 120 + seededRandom(seedBase * 5 + 1) * 160;
                return {
                    rx: dir.x * dist + (seededRandom(seedBase * 5 + 2) - 0.5) * 40,
                    ry: dir.y * dist + (seededRandom(seedBase * 5 + 3) - 0.5) * 40,
                    rot: (seededRandom(seedBase * 5 + 4) - 0.5) * 50,
                    scaleStart: 0.55 + seededRandom(seedBase * 5 + 5) * 0.25,
                    arrivalOffset: seededRandom(seedBase * 7 + 1),
                    bounceStrength: 8 + seededRandom(seedBase * 11 + 3) * 6,
                };
            });

            cards.forEach((card, i) => {
                card.style.willChange = 'transform, opacity, filter, box-shadow, border-color';
                card.style.transformOrigin = 'center center';
                card.style.position = 'relative';
                card.style.zIndex = String(100 - i);
                const icon = card.querySelector('.skill-icon');
                if (icon) icon.style.willChange = 'transform, opacity';
            });

            let ticking = false;

            function update() {
                const rect = section.getBoundingClientRect();
                const vh = window.innerHeight;

                const start = vh * 1.4;
                const end = vh * -0.7;
                let sectionProgress = (start - rect.top) / (start - end);
                sectionProgress = clamp(sectionProgress, 0, 1);

                const n = cards.length;
                const spread = 0.5;

                cards.forEach((card, i) => {
                    const s = scatter[i];
                    const cardStart = clamp(s.arrivalOffset * (1 - spread), 0, 1);
                    const cardEnd = clamp(cardStart + spread, 0, 1);
                    let t = (sectionProgress - cardStart) / (cardEnd - cardStart);
                    t = clamp(t, 0, 1);

                    const springT = easeOutElastic(t, s.bounceStrength);
                    const smoothT = clamp(easeOutBack(t), 0, 1);

                    const scale = lerp(s.scaleStart, 1, springT);
                    const tx = lerp(s.rx, 0, springT);
                    const ty = lerp(s.ry, 0, springT);
                    const rotation = lerp(s.rot, 0, springT);
                    const opacity = smoothT;
                    const blur = lerp(6, 0, smoothT);
                    const shadowAlpha = lerp(0.08, 0.35, smoothT);
                    const shadowY = lerp(50, 16, smoothT);
                    const borderAlpha = lerp(0.03, 0.35, smoothT);

                    card.style.transform =
                        `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
                        `rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
                    card.style.opacity = opacity.toFixed(3);
                    card.style.filter = `blur(${blur.toFixed(2)}px)`;
                    card.style.boxShadow = `0 ${shadowY.toFixed(1)}px 40px rgba(59,130,246,${shadowAlpha.toFixed(3)})`;
                    card.style.borderColor = `rgba(59,130,246,${borderAlpha.toFixed(3)})`;

                    const icon = card.querySelector('.skill-icon');
                    if (icon) {
                        const iconT = clamp((t - 0.2) / 0.8, 0, 1);
                        const iconSpring = easeOutElastic(iconT, s.bounceStrength);
                        const iconSmooth = clamp(easeOutBack(iconT), 0, 1);
                        icon.style.opacity = iconSmooth.toFixed(3);
                        icon.style.transform = `scale(${clamp(iconSpring, 0, 1.25).toFixed(3)})`;
                    }
                });

                ticking = false;
            }

            function onScrollOrResize() {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                    ticking = true;
                }
            }

            window.addEventListener('scroll', onScrollOrResize, { passive: true });
            window.addEventListener('resize', onScrollOrResize, { passive: true });

            update();
        });
    }

    function init() {
        initScrollReveal();
        initCardStagger();
        initMagneticButtons();
        initCursorGlow();
        initActiveSection();
        initParallax();
        initThrowToGrid();
    }

    window.addEventListener('load', () => {
        init();
        initLoadSequence();
        setTimeout(init, 500);
        setTimeout(init, 1500);
    });
})();