const contactBtn = document.getElementById('contact-toggle');
const contactWindow = document.getElementById('form-window');
const contactClose = document.getElementById('close-btn');
const accordionHeaders = document.querySelectorAll('.faq-question');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const errorMessage = document.querySelector('.error');

contactWindow.addEventListener('submit', function(event) {

    errorMessage.textContent = '';
    if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
        event.preventDefault();
        errorMessage.textContent = 'Заполните все поля формы.';
        return;
    }

    alert(`Спасибо за ваш отзыв!`);
});



accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;

    header.classList.toggle('active');

    if (header.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = 0;
    }

    accordionHeaders.forEach(otherHeader => {
      if (otherHeader !== header) {
        otherHeader.classList.remove('active');
        otherHeader.nextElementSibling.style.maxHeight = 0;
      }
    });
  });
});


contactBtn.addEventListener('click', () => {
  contactWindow.style.display = 'flex';
});
contactClose.addEventListener('click', () => {
  contactWindow.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === contactWindow) {
    contactWindow.style.display = 'none';
  }
});


(function() {
    const btn = document.getElementById('bg-btn');
    if (!btn) return;

    const colors = [
        '#071023',
        '#0f1724',
        '#082032',
        '#1b2430',
        '#f5efe6',
        '#083a70'
    ];

    let index = 0;
    try {
        const saved = localStorage.getItem('bgColorIndex');
        if (saved !== null && !isNaN(Number(saved))) index = Number(saved) % colors.length;
    } catch (e) {
    }

    function applyColor(i) {
        const root = document.documentElement;
        const color = colors[i % colors.length];
        root.style.setProperty('--bg', color);
        try { localStorage.setItem('bgColorIndex', String(i % colors.length)); } catch (e) {}
    }

    applyColor(index);

    btn.addEventListener('click', () => {
        index = (index + 1) % colors.length;
        applyColor(index);
        btn.setAttribute('aria-pressed', index % 2 === 1 ? 'true' : 'false');
    });
})();

(function() {
    const el = document.getElementById('date-time');
    if (!el) return;

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    function formatDateTime(dt) {
        try {
            return dt.toLocaleString('en-US', options);
        } catch (e) {
            const year = dt.getFullYear();
            const month = dt.toLocaleString('en-US', { month: 'long' });
            const day = dt.getDate();
            let hours = dt.getHours();
            const minutes = String(dt.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${month} ${day}, ${year}, ${hours}:${minutes} ${ampm}`;
        }
    }
    function update() {
        const now = new Date();
        el.textContent = formatDateTime(now);
    }
    update();
    const timer = setInterval(update, 1000);
    window.addEventListener('beforeunload', () => clearInterval(timer));
})();
