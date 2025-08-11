// Mobile nav toggle
document.querySelectorAll('.navbar-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('open');
  });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Pause hero video when off-screen
const heroVideo = document.querySelector('.hero video');
if (heroVideo) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVideo.play().catch(() => {});
      } else {
        heroVideo.pause();
      }
    });
  });
  observer.observe(heroVideo);
}

// Forms handling
function handleForm(id, endpoint) {
  const form = document.getElementById(id);
  if (!form) return;
  const alertBox = form.querySelector('.alert');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.style.display = 'none';
    const data = Object.fromEntries(new FormData(form));
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      alertBox.textContent = 'Thanks! We\'ll be in touch.';
      alertBox.className = 'alert success';
      alertBox.style.display = 'block';
      form.reset();
    } catch (err) {
      alertBox.textContent = 'Submission failed. Please email us directly.';
      alertBox.className = 'alert error';
      alertBox.style.display = 'block';
    }
  });
}

handleForm('lead-intake', '/api/lead');
handleForm('remodel-form', '/api/remodel');
handleForm('municipal-form', '/api/municipal');
handleForm('contact-form', '/api/contact');

// Analytics helper
function ddTrack(eventName, payload) {
  if (window.DD_ANALYTICS) {
    navigator.sendBeacon('/dd-analytics', JSON.stringify({ eventName, payload }));
  } else {
    console.log('ddTrack', eventName, payload);
  }
}

// Cookie consent
(function(){
  const consentKey = 'dd-consent';
  if (!localStorage.getItem(consentKey)) {
    const banner = document.createElement('div');
    banner.textContent = 'We use cookies for analytics.';
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.onclick = () => {
      localStorage.setItem(consentKey, '1');
      banner.remove();
    };
    banner.appendChild(btn);
    banner.style.position = 'fixed';
    banner.style.bottom = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.background = '#000';
    banner.style.color = '#fff';
    banner.style.padding = '1rem';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    document.body.appendChild(banner);
  }
})();

// Update year in footers
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
