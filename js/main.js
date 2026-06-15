// === HEADER SCROLL ===
const header = document.getElementById('main-header');
if (header && header.classList.contains('hero-page')) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// === BACK TO TOP ===
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === SLIDER ===
const sliderTrack = document.querySelector('.slider-track');
if (sliderTrack) {
  const slides = sliderTrack.querySelectorAll('.slide');
  let current = 0;
  const total = slides.length;

  function getVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function goToSlide(n) {
    const visible = getVisible();
    const max = Math.max(0, total - visible);
    current = Math.max(0, Math.min(n, max));
    const gap = 16;
    const slideWidth = slides[0].offsetWidth + gap;
    sliderTrack.style.transform = `translateX(-${current * slideWidth}px)`;
  }

  document.getElementById('prev-slide')?.addEventListener('click', () => goToSlide(current - 1));
  document.getElementById('next-slide')?.addEventListener('click', () => {
    const visible = getVisible();
    goToSlide(current + 1 >= total - visible + 1 ? 0 : current + 1);
  });

  setInterval(() => {
    const visible = getVisible();
    goToSlide(current + 1 >= total - visible + 1 ? 0 : current + 1);
  }, 4500);
}

// === COUNTER ANIMATION ===
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const counterSection = document.querySelector('.counter-wrap');
if (counterSection) {
  let animated = false;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      document.querySelectorAll('.counter-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 1500);
      });
    }
  }, { threshold: 0.4 }).observe(counterSection);
}

// === ORDER MODAL ===
const modal = document.getElementById('order-modal');
const modalProductName = document.getElementById('modal-product-name');

document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (modalProductName) modalProductName.textContent = btn.dataset.product;
    modal?.classList.add('active');
  });
});

document.getElementById('modal-close')?.addEventListener('click', () => modal?.classList.remove('active'));
document.getElementById('modal-confirm')?.addEventListener('click', () => {
  modal?.classList.remove('active');
  showToast('Заказ принят! Мы свяжемся с вами.');
});
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

// === TOAST ===
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;bottom:5rem;right:2rem;
    background:#0d0d0d;color:white;
    padding:0.8rem 1.4rem;border-radius:100px;
    font-size:0.875rem;z-index:1000;
    box-shadow:0 4px 20px rgba(0,0,0,0.15);
    animation:slideIn 0.3s ease;
    font-family:'Inter',sans-serif;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === REQUEST FORM (главная) ===
const requestForm = document.getElementById('request-form');
if (requestForm) {
  requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { input: document.getElementById('req-name'), err: document.getElementById('req-err-name'), msg: 'Введите имя' },
      { input: document.getElementById('req-product'), err: document.getElementById('req-err-product'), msg: 'Укажите продукт' },
      { input: document.getElementById('req-email'), err: document.getElementById('req-err-email'), msg: 'Введите email или телефон' },
    ];

    fields.forEach(({ input, err }) => {
      input?.classList.remove('error');
      if (err) err.style.display = 'none';
    });

    fields.forEach(({ input, err, msg }) => {
      if (!input?.value.trim()) {
        input?.classList.add('error');
        if (err) { err.textContent = msg; err.style.display = 'block'; }
        valid = false;
      }
    });

    if (valid) {
      requestForm.reset();
      const success = document.getElementById('request-success');
      if (success) { success.style.display = 'flex'; }
      setTimeout(() => { if (success) success.style.display = 'none'; }, 4000);
    }
  });
}

// === CONTACT FORM (новости) ===
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameInput = document.getElementById('sub-name');
    const emailInput = document.getElementById('sub-email');
    const msgInput = document.getElementById('sub-message');
    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMsg = document.getElementById('err-msg');

    [nameInput, emailInput, msgInput].forEach(i => i?.classList.remove('error'));
    [errName, errEmail, errMsg].forEach(e => { if(e) e.style.display = 'none'; });

    if (!nameInput?.value.trim()) {
      nameInput?.classList.add('error');
      if (errName) { errName.textContent = 'Введите имя'; errName.style.display = 'block'; }
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput?.value.trim() || !emailRegex.test(emailInput.value)) {
      emailInput?.classList.add('error');
      if (errEmail) { errEmail.textContent = 'Введите корректный email'; errEmail.style.display = 'block'; }
      valid = false;
    }

    if (!msgInput?.value.trim()) {
      msgInput?.classList.add('error');
      if (errMsg) { errMsg.textContent = 'Напишите сообщение'; errMsg.style.display = 'block'; }
      valid = false;
    }

    if (valid) {
      subscribeForm.reset();
      const success = document.getElementById('form-success');
      if (success) { success.style.display = 'flex'; }
      setTimeout(() => { if (success) success.style.display = 'none'; }, 4000);
    }
  });
}

// === LIVE CLOCK ===
const clockEl = document.getElementById('farm-clock');
if (clockEl) {
  function updateClock() {
    const now = new Date();
    clockEl.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':');
  }
  updateClock();
  setInterval(updateClock, 1000);
}
