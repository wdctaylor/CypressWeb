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

  setTimeout(() => {
    // TODO: replace with fetch('/api/contact', { method: 'POST', body: formData })
    form.innerHTML = `
      <div class="form-success">
        <p>Thank you.</p>
        <p>We'll be in touch within one business day.</p>
      </div>
    `;
  }, 800);
});
