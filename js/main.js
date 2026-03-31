// Mobile tap: expand all cards, highlight the tapped one.
// Desktop uses CSS :hover on the grid — no JS needed.
const servicesGrid = document.querySelector('.services-grid');

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    if (!isActive) {
      card.classList.add('active');
      servicesGrid.classList.add('expanded');
      // After expansion animation settles, scroll the full card into view
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 450);
    } else {
      servicesGrid.classList.remove('expanded');
    }
  });
});

// Nav scroll state
const navWrapper = document.querySelector('.nav-wrapper');
window.addEventListener('scroll', () => {
  navWrapper.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Smooth scroll with fixed nav offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 84, behavior: 'smooth' });
  });
});

// Our Story carousel
(() => {
  const carousel = document.querySelector('.our-story-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.our-story-slide');
  const dots = carousel.querySelectorAll('.our-story-dot');
  const prevBtn = carousel.querySelector('.our-story-prev');
  const nextBtn = carousel.querySelector('.our-story-next');
  const total = slides.length;
  let current = 0;

  function goTo(index) {
    if (index === current || index < 0 || index >= total) return;

    const goingForward = index > current;

    // Mark outgoing slide with exit direction
    slides[current].classList.remove('active');
    slides[current].classList.toggle('exit', goingForward);
    dots[current].classList.remove('active');

    // Clean up exit class after transition
    const outgoing = slides[current];
    setTimeout(() => outgoing.classList.remove('exit'), 460);

    current = index;

    slides[current].classList.add('active');
    dots[current].classList.add('active');

    prevBtn.classList.toggle('disabled', current === 0);
    nextBtn.classList.toggle('disabled', current === total - 1);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Touch swipe (mobile)
  let touchX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const delta = touchX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  }, { passive: true });

  // Trackpad horizontal swipe (desktop)
  let wheelLocked = false;
  carousel.addEventListener('wheel', (e) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!isHorizontal || Math.abs(e.deltaX) < 20) return;
    e.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    setTimeout(() => { wheelLocked = false; }, 700);
    e.deltaX > 0 ? goTo(current + 1) : goTo(current - 1);
  }, { passive: false });
})();

// Contact form validation + stub submission
const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('error'));

  ['firstName', 'lastName', 'email'].forEach(id => {
    const field = document.getElementById(id);
    if (!field.value.trim()) { field.classList.add('error'); valid = false; }
  });

  const emailField = document.getElementById('email');
  if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  fetch('https://usebasin.com/f/fc865f4922d3', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new FormData(form)
  })
    .then(res => {
      if (!res.ok) throw new Error('submission failed');
      form.innerHTML = `
        <div class="form-success">
          <p>Thank you.</p>
          <p>We'll be in touch within one business day.</p>
        </div>
      `;
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      const note = form.querySelector('.form-note');
      if (note) {
        note.textContent = 'Something went wrong. Please try again.';
        note.style.color = '#a04040';
      }
    });
});
