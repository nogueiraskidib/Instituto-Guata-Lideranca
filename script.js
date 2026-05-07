document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initCarousel();
    initSmoothScroll();
    initParallax();
    initAccordion();
    initHeroAnimations();
    initCopyPix();
});

/* --- HERO ANIMATIONS (Particles & Title) --- */
function initHeroAnimations() {
    // 1. Split text into spans for letter-by-letter animation
    const title = document.querySelector('.animate-letters');
    if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        let charIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.classList.add('char', 'space');
            } else {
                span.textContent = char;
                span.classList.add('char');
            }
            // Delay: 0.8s (line drawing) + charIndex * 0.05s
            span.style.animationDelay = (0.8 + (charIndex * 0.05)) + 's';
            title.appendChild(span);
            charIndex++;
        }
    }

    // 2. Particles Canvas
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const count = 40; // 30-50 particles requested
    const colors = ['#C21F20', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.2, // slightly upward
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.2 + 0.2 // 20% to 40%
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

/* --- NAVBAR --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

/* --- MOBILE MENU --- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');
    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active');
        navbar.classList.toggle('menu-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            navbar.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

/* --- SCROLL REVEAL WITH STAGGER --- */
function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- COUNTERS --- */
function initCounters() {
    const counters = document.querySelectorAll('.impacto-number[data-target]');
    let done = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !done) {
                done = true;
                counters.forEach(c => animateCounter(c));
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();
    function ease(t) { return 1 - Math.pow(1 - t, 4); }
    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(ease(p) * target).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('pt-BR');
    }
    requestAnimationFrame(tick);
}

/* --- CAROUSEL --- */
function initCarousel() {
    const track = document.getElementById('carousel');
    const cards = track.querySelectorAll('.depo-card');
    const dotsBox = document.getElementById('carouselDots');
    const prev = document.getElementById('carouselPrev');
    const next = document.getElementById('carouselNext');
    let idx = 0;
    const total = cards.length;

    for (let i = 0; i < total; i++) {
        const d = document.createElement('button');
        d.classList.add('carousel-dot');
        d.setAttribute('aria-label', 'Depoimento ' + (i + 1));
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => go(i));
        dotsBox.appendChild(d);
    }

    function go(i) {
        idx = i;
        track.style.transform = 'translateX(-' + (i * 100) + '%)';
        dotsBox.querySelectorAll('.carousel-dot').forEach((d, j) => d.classList.toggle('active', j === i));
    }

    prev.addEventListener('click', () => go(idx === 0 ? total - 1 : idx - 1));
    next.addEventListener('click', () => go(idx === total - 1 ? 0 : idx + 1));

    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = sx - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) go(diff > 0 ? (idx === total - 1 ? 0 : idx + 1) : (idx === 0 ? total - 1 : idx - 1));
    }, { passive: true });
}

/* --- SMOOTH SCROLL --- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
    });
}

/* --- PARALLAX --- */
function initParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wm = document.querySelector('.hero-watermark');
    if (!wm) return;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            wm.style.transform = 'translate(-50%, calc(-50% + ' + (y * 0.15) + 'px))';
        }
    }, { passive: true });
}

/* --- COPY PIX --- */
function initCopyPix() {
    const btn = document.getElementById('copyPix');
    const key = document.getElementById('pixKey');
    if (!btn || !key) return;
    btn.addEventListener('click', () => {
        navigator.clipboard.writeText(key.textContent.trim()).then(() => {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        });
    });
}
