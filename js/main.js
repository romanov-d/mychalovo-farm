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
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function goToSlide(n) {
    const visible = getVisible();
    const max = total - visible;
    current = Math.max(0, Math.min(n, max));
    const slideWidth = slides[0].offsetWidth + 16;
    sliderTrack.style.transform = `translateX(-${current * slideWidth}px)`;
  }

  document.getElementById('prev-slide')?.addEventListener('click', () => goToSlide(current - 1));
  document.getElementById('next-slide')?.addEventListener('click', () => goToSlide(current + 1));

  setInterval(() => {
    const visible = getVisible();
    goToSlide(current + 1 > total - visible ? 0 : current + 1);
  }, 4000);
}

// === COUNTER ANIMATION ===
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

const counterSection = document.querySelector('.counter-wrap');
if (counterSection) {
  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      document.querySelectorAll('.counter-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 1500);
      });
    }
  }, { threshold: 0.4 });
  observer.observe(counterSection);
}

// === ORDER MODAL ===
const modal = document.getElementById('order-modal');
const modalProductName = document.getElementById('modal-product-name');
const modalClose = document.getElementById('modal-close');
const modalConfirm = document.getElementById('modal-confirm');

document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (modalProductName) modalProductName.textContent = btn.dataset.product;
    modal?.classList.add('active');
  });
});

modalClose?.addEventListener('click', () => modal?.classList.remove('active'));
modalConfirm?.addEventListener('click', () => {
  modal?.classList.remove('active');
  showToast('Заказ принят! Мы свяжемся с вами.');
});
modal?.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// === TOAST ===
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 5rem; right: 2rem;
    background: #0d0d0d; color: white;
    padding: 0.9rem 1.5rem; border-radius: 100px;
    font-size: 0.9rem; z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
    font-family: inherit;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === FORM VALIDATION ===
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

    // Reset
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
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}
