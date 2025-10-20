const appState = {
    rating: 0,
    galleryIndex: 0
};

(function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem('appState') || '{}');
        if (saved && typeof saved === 'object') {
            if (Number.isFinite(saved.rating)) appState.rating = saved.rating;
            if (Number.isFinite(saved.galleryIndex)) appState.galleryIndex = saved.galleryIndex;
        }
    } catch (e) {}
})();

const siteUtils = {
    displayTime: function(targetEl) {
        if (!targetEl) return;
        const now = new Date();
        targetEl.textContent = now.toLocaleTimeString();
    },
    getGreetingText: function(date = new Date()) {
        const hour = date.getHours();
        switch (true) {
            case hour >= 5 && hour < 12:
                return 'Good morning';
            case hour >= 12 && hour < 17:
                return 'Good afternoon';
            case hour >= 17 && hour < 22:
                return 'Good evening';
            default:
                return 'Good night';
        }
    },
    playBeep: function(freq = 440, durationMs = 180) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            o.connect(g);
            g.connect(ctx.destination);
            g.gain.value = 0.0001;
            o.start();
            g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
            setTimeout(() => {
                g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
                setTimeout(() => {
                    o.stop();
                    try { ctx.close(); } catch (e) {}
                }, 50);
            }, durationMs);
        } catch (e) {
            console.warn('Audio not available', e);
        }
    },

    animatePop: function(el, distance = 6, durationMs = 160) {
        if (!el) return;
        el.style.transition = `transform ${durationMs}ms ease`;
        el.style.transform = `translateY(-${distance}px)`;
        setTimeout(() => {
            el.style.transform = '';
        }, durationMs);
    },

    postForm: function(url, dataObj, callback) {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataObj)
        })
            .then(res => res.json().then(json => ({ ok: res.ok, status: res.status, json })))
            .then(result => callback(result.json, null))
            .catch(err => callback(null, err));
    }
};

const contactBtn = document.getElementById('contact-toggle');
const contactWindow = document.getElementById('form-window');
const contactClose = document.getElementById('close-btn');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const errorMessage = document.getElementById('error-message'); // используем id
const contactForm = document.getElementById('contact-form');
const accordionHeaders = document.querySelectorAll('.faq-question');
const mainNav = document.querySelector('.main-nav');
const navLinks = mainNav ? Array.from(mainNav.querySelectorAll('.nav-link')) : [];

if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        errorMessage.textContent = '';

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) {
            errorMessage.textContent = 'Заполните все поля формы.';
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMessage.textContent = 'Введите корректный email.';
            return;
        }

        const payload = { name, email, message, ts: new Date().toISOString() };

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const prevText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) submitBtn.disabled = true, submitBtn.textContent = 'Sending...';

        siteUtils.postForm('https://jsonplaceholder.typicode.com/posts', payload, (response, err) => {
            if (submitBtn) submitBtn.disabled = false, submitBtn.textContent = prevText || 'Send';
            if (err) {
                errorMessage.textContent = 'Ошибка отправки. Попробуйте позже.';
                console.error(err);
                return;
            }
            errorMessage.style.color = 'lime';
            errorMessage.textContent = 'Сообщение отправлено. Спасибо!';
            siteUtils.playBeep(520, 140); // звуковая обратная связь
            setTimeout(() => {
                errorMessage.style.color = 'red';
                errorMessage.textContent = '';
                contactWindow.style.display = 'none';
                contactForm.reset();
            }, 1600);
        });
    });
}

accordionHeaders.forEach(header => {
    const content = header.nextElementSibling;
    if (content) {
        content.style.maxHeight = '0';
        content.setAttribute('aria-hidden', 'true');
        header.setAttribute('aria-expanded', 'false');
    }
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const willOpen = !header.classList.contains('active');
        header.classList.toggle('active', willOpen);
        if (!content) return;
        if (willOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.setAttribute('aria-hidden', 'false');
            header.setAttribute('aria-expanded', 'true');
        } else {
            content.style.maxHeight = '0';
            content.setAttribute('aria-hidden', 'true');
            header.setAttribute('aria-expanded', 'false');
        }
    });
});

if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        contactWindow.style.display = 'flex';
        setTimeout(() => nameInput && nameInput.focus(), 120);
    });
}
if (contactClose) {
    contactClose.addEventListener('click', () => {
        contactWindow.style.display = 'none';
    });
}
window.addEventListener('click', (event) => {
    if (event.target === contactWindow) contactWindow.style.display = 'none';
});

(function() {
    const btn = document.getElementById('bg-btn');
    if (!btn) return;
    const colors = ['#071023','#0f1724','#082032','#1b2430','#f5efe6','#083a70'];
    let index = 0;
    const saved = localStorage.getItem('bgColorIndex');
    if (saved !== null && !isNaN(Number(saved))) index = Number(saved) % colors.length;
    function applyColor(i) {
        const root = document.documentElement;
        const color = colors[i % colors.length];
        root.style.setProperty('--bg', color);
        localStorage.setItem('bgColorIndex', String(i % colors.length));
    }
    applyColor(index);
    btn.addEventListener('click', () => {
        index = (index + 1) % colors.length;
        applyColor(index);
        btn.setAttribute('aria-pressed', index % 2 === 1 ? 'true' : 'false');
        siteUtils.animatePop(btn, 6, 160);
    });
})();

(function() {
    const el = document.getElementById('date-time');
    if (!el) return;

    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    function formatDateTime(dt) {
        try { return dt.toLocaleString('en-US', options); }
        catch (e) {
            const year = dt.getFullYear();
            const month = dt.toLocaleString('en-US', { month: 'long' });
            const day = dt.getDate();
            let hours = dt.getHours(), minutes = String(dt.getMinutes()).padStart(2,'0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
        }
    }
    function update() {
        el.textContent = formatDateTime(new Date());
    }
    update();
    const timer = setInterval(update, 1000);
    window.addEventListener('beforeunload', () => clearInterval(timer));

    const container = el.parentNode;
    if (container) {
        const timeBtn = document.createElement('button');
        timeBtn.type = 'button';
        timeBtn.id = 'show-time-btn';
        timeBtn.textContent = 'Show time';
        timeBtn.title = 'Show current time';
        timeBtn.style.marginLeft = '8px';
        timeBtn.style.cursor = 'pointer';
        timeBtn.className = 'bg-btn'; // реиспользуем стиль кнопки
        container.appendChild(timeBtn);

        const display = document.createElement('div');
        display.id = 'manual-time-display';
        display.style.fontSize = '0.9rem';
        display.style.color = 'var(--muted)';
        display.style.marginLeft = '8px';
        display.style.minWidth = '120px';
        display.setAttribute('aria-live','polite');
        container.appendChild(display);

        timeBtn.addEventListener('click', () => {
            siteUtils.displayTime(display);
            siteUtils.animatePop(timeBtn, 5, 140);
            siteUtils.playBeep(660, 90);
        });

    }
})();

if (navLinks.length) {
    navLinks.forEach((link, idx) => {
        link.setAttribute('tabindex', '0');
        link.addEventListener('keydown', (ev) => {
            if (ev.key === 'ArrowRight') {
                ev.preventDefault();
                const next = navLinks[(idx + 1) % navLinks.length];
                next.focus();
            } else if (ev.key === 'ArrowLeft') {
                ev.preventDefault();
                const prev = navLinks[(idx - 1 + navLinks.length) % navLinks.length];
                prev.focus();
            }
        });
    });
}

(function() {
    const about = document.querySelector('.about p');
    if (!about) return;

    const previewMaxHeight = 88;
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    wrapper.style.transition = 'max-height 0.28s ease';
    wrapper.style.maxHeight = previewMaxHeight + 'px';
    wrapper.className = 'about-preview-wrapper';

    about.parentNode.replaceChild(wrapper, about);
    wrapper.appendChild(about);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Read more';
    btn.className = 'read-more-toggle';
    btn.style.marginTop = '12px';
    btn.style.display = 'inline-block';
    btn.style.cursor = 'pointer';
    btn.style.background = 'transparent';
    btn.style.border = 'none';
    btn.style.color = 'var(--accent)';
    btn.style.fontWeight = '600';
    btn.setAttribute('aria-expanded', 'false');

    wrapper.after(btn);

    let expanded = false;
    btn.addEventListener('click', () => {
        expanded = !expanded;
        if (expanded) {
            wrapper.style.maxHeight = '1000px';
            btn.textContent = 'Show less';
            btn.setAttribute('aria-expanded', 'true');
        } else {
            wrapper.style.maxHeight = previewMaxHeight + 'px';
            btn.textContent = 'Read more';
            btn.setAttribute('aria-expanded', 'false');
        }
    });
})();

(function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const container = document.createElement('div');
    container.id = 'rating-container';
    container.style.marginTop = '18px';
    container.setAttribute('aria-label', 'Rating');

    const label = document.createElement('div');
    label.textContent = 'Rate this site:';
    label.style.marginBottom = '8px';
    label.style.color = 'var(--muted)';
    container.appendChild(label);

    const stars = document.createElement('div');
    stars.id = 'rating-stars';
    stars.setAttribute('role', 'radiogroup');
    stars.style.fontSize = '28px';
    stars.style.display = 'inline-flex';
    stars.style.gap = '6px';
    container.appendChild(stars);

    function renderStars(value) {
        stars.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const s = document.createElement('button');
            s.type = 'button';
            s.className = 'star';
            s.dataset.index = String(i);
            s.setAttribute('aria-checked', String(i === value));
            s.setAttribute('role', 'radio');
            s.style.background = 'transparent';
            s.style.border = 'none';
            s.style.cursor = 'pointer';
            s.style.color = i <= value ? 'gold' : 'rgba(255,255,255,0.2)';
            s.textContent = i <= value ? '★' : '☆';
            s.title = i + ' out of 5';
            s.addEventListener('click', () => {
                appState.rating = i;
                saveAppState();
                renderStars(appState.rating);
                siteUtils.playBeep(720, 80);
            });
            stars.appendChild(s);
        }
    }

    hero.appendChild(container);
    renderStars(appState.rating || 0);

    function saveAppState() {
        try {
            localStorage.setItem('appState', JSON.stringify({
                rating: appState.rating,
                galleryIndex: appState.galleryIndex
            }));
        } catch (e) {}
    }
})();

(function() {
    const items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!items.length) return;

    const gallery = items.map((it, i) => {
        const img = it.querySelector('img');
        const caption = it.querySelector('.caption-text') ? it.querySelector('.caption-text').textContent : (img ? img.alt : '');
        return { index: i, src: img ? img.getAttribute('src') : '', alt: img ? img.getAttribute('alt') : '', caption: caption };
    });

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    Object.assign(lightbox.style, { position:'fixed', inset:'0', display:'none', justifyContent:'center', alignItems:'center', background:'rgba(2,6,23,0.85)', zIndex:10000, padding:'24px' });

    const box = document.createElement('div');
    box.tabIndex = 0;
    Object.assign(box.style, { maxWidth:'100%', maxHeight:'100%', outline:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' });

    const bigImg = document.createElement('img');
    bigImg.alt = '';
    Object.assign(bigImg.style, { maxWidth:'90vw', maxHeight:'80vh', objectFit:'contain', borderRadius:'10px', boxShadow:'0 8px 30px rgba(0,0,0,0.6)' });

    const captionEl = document.createElement('div');
    captionEl.style.color = 'var(--muted)';
    captionEl.style.fontSize = '0.95rem';
    captionEl.style.maxWidth = '90vw';
    captionEl.style.textAlign = 'center';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, { position:'absolute', top:'18px', right:'22px', fontSize:'34px', background:'transparent', color:'white', border:'none', cursor:'pointer' });

    box.appendChild(bigImg);
    box.appendChild(captionEl);
    lightbox.appendChild(box);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    function openAt(index) {
        index = Math.max(0, Math.min(index | 0, gallery.length - 1));
        appState.galleryIndex = index;
        const item = gallery[index];
        bigImg.src = item.src;
        bigImg.alt = item.alt || '';
        captionEl.textContent = item.caption || '';
        lightbox.style.display = 'flex';
        box.focus();
        saveAppState();
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        bigImg.src = '';
    }

    function saveAppState() {
        try {
            localStorage.setItem('appState', JSON.stringify({
                rating: appState.rating,
                galleryIndex: appState.galleryIndex
            }));
        } catch (e) {}
    }

    items.forEach((it, i) => {
        it.addEventListener('click', () => openAt(i));
        it.tabIndex = 0;
        it.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openAt(i); }
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (ev) => { if (ev.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (ev) => {
        if (lightbox.style.display !== 'flex') return;
        if (ev.key === 'Escape') closeLightbox();
        if (ev.key === 'ArrowLeft') openAt(appState.galleryIndex - 1);
        if (ev.key === 'ArrowRight') openAt(appState.galleryIndex + 1);
    });

})();

function processList(items, fn) {
    if (!Array.isArray(items) || typeof fn !== 'function') return;
    items.forEach(fn);
}
(function() {
    const captionEls = Array.from(document.querySelectorAll('.caption-text'));
    if (!captionEls.length) return;
    processList(captionEls, (el, i) => {
        // добавим индекс в конец подписи (не меняем оригинальный текст сильно)
        el.textContent = el.textContent.replace(/\s*$/, '') + ` (${i+1})`;
    });
})();

(function() {
    const footerNav = document.querySelector('.footer-nav');
    if (!footerNav) return;
    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.id = 'play-sound-btn';
    playBtn.title = 'Play sound';
    playBtn.textContent = '🔔';
    playBtn.style.marginLeft = '12px';
    playBtn.style.cursor = 'pointer';
    playBtn.className = 'bg-btn';
    footerNav.appendChild(playBtn);

    playBtn.addEventListener('click', () => {
        siteUtils.playBeep(880, 200);
        siteUtils.animatePop(playBtn, 6, 140);
    });
})();

(function() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    heroTitle.style.transition = 'transform 180ms ease';
    heroTitle.addEventListener('click', () => {
        siteUtils.animatePop(heroTitle, 8, 160);
        siteUtils.playBeep(520, 90);
    });
})();

(function() {
    const brand = document.querySelector('.brand');
    if (!brand) return;

    const greetingEl = document.createElement('div');
    greetingEl.id = 'time-greeting';
    greetingEl.style.fontSize = '0.9rem';
    greetingEl.style.color = 'var(--muted)';
    greetingEl.style.marginLeft = '12px';
    greetingEl.style.display = 'inline-block';

    brand.after(greetingEl);

    function updateGreeting() {
        greetingEl.textContent = siteUtils.getGreetingText();
    }
    updateGreeting();
    setInterval(updateGreeting, 60 * 1000); // обновляем каждую минуту
})();

window.addEventListener('beforeunload', () => {
    try {
        localStorage.setItem('appState', JSON.stringify({
            rating: appState.rating,
            galleryIndex: appState.galleryIndex
        }));
    } catch (e) {}
});
