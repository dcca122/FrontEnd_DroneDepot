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

// API helpers and form wiring
const API_BASE = (window.API_BASE && window.API_BASE !== "__USE_SAME_ORIGIN__") ? window.API_BASE : "";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = { name: 120, email: 160, address: 180, notes: 2000 };
const MIN_SUBMIT_SECONDS = 3;

function postJSON(url, payload) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function postMultipart(url, formEl) {
  const fd = new FormData(formEl);
  fd.delete('company');
  fd.delete('form_started_at');
  return fetch(url, { method: 'POST', body: fd });
}

function setFeedback(el, type, message) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('success', 'error');
  if (type) el.classList.add(type);
  el.style.display = message ? 'block' : 'none';
  if (message) {
    el.setAttribute('tabindex', '-1');
    el.focus();
  }
}

function applyHoneypot(formEl) {
  formEl.querySelectorAll('input[name="company"],input[name="form_started_at"]').forEach(el => el.remove());
  const honey = document.createElement('input');
  honey.type = 'text';
  honey.name = 'company';
  honey.autocomplete = 'off';
  honey.style.display = 'none';
  const ts = document.createElement('input');
  ts.type = 'hidden';
  ts.name = 'form_started_at';
  ts.value = Date.now();
  formEl.append(honey, ts);
}

function initForms() {
  const forms = [
    {
      selector: '#lead-intake-form',
      payload: 'json',
      endpoint: '/api/lead',
      required: ['name', 'email', 'projectType', 'address'],
      optional: ['phone', 'city', 'state', 'postal', 'country', 'targetDate', 'notes', 'remodelNeeded'],
      success: 'Thanks! We\'ll reach out shortly.',
      error: 'Couldn\'t submit your request. Please try again.'
    },
    {
      selector: '#remodel-form',
      payload: 'multipart',
      endpoint: '/api/remodel',
      required: ['name', 'email', 'address', 'city', 'jurisdiction', 'package'],
      optional: ['phone', 'permitNumber', 'hoa', 'targetInspectionStart', 'targetInspectionEnd', 'notes'],
      filesField: 'permitDocs[]',
      fileRules: { max_files: 10, max_size_bytes: 10485760, accept: /\.(pdf|jpe?g|png)$/i },
      success: 'Submitted! You\'ll receive a confirmation email with next steps.',
      error: 'Upload failed. Check file size/types and try again.'
    },
    {
      selector: '#municipal-form',
      payload: 'json',
      endpoint: '/api/municipal',
      required: ['contactName', 'contactEmail', 'department', 'jurisdiction'],
      optional: ['estMonthlyVolume', 'notes'],
      success: 'Thanks! We\'ll contact you about the pilot program.',
      error: 'Couldn\'t send your request. Please try again.'
    },
    {
      selector: '#contact-form',
      payload: 'json',
      endpoint: '/api/contact',
      required: ['name', 'email', 'message'],
      optional: ['topic'],
      success: 'Message sent. We\'ll be in touch.',
      error: 'Couldn\'t send your message. Please try again.'
    },
    {
      selector: '#newsletter-form',
      payload: 'json',
      endpoint: '/api/newsletter',
      required: ['email'],
      optional: [],
      success: 'Subscribed! Check your inbox.',
      error: 'Couldn\'t subscribe. Try again later.'
    }
  ];

  forms.forEach(cfg => {
    const form = document.querySelector(cfg.selector);
    if (!form) return;
    applyHoneypot(form);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const feedbackEl = form.querySelector('[data-feedback]');
      setFeedback(feedbackEl, '', '');
      const formData = new FormData(form);
      if (formData.get('company')) return;
      const started = parseInt(formData.get('form_started_at'), 10);
      if (!started || Date.now() - started < MIN_SUBMIT_SECONDS * 1000) {
        setFeedback(feedbackEl, 'error', cfg.error);
        return;
      }

      for (const field of cfg.required) {
        const value = formData.get(field);
        if (!value) { setFeedback(feedbackEl, 'error', cfg.error); return; }
        if (field === 'email' && !EMAIL_REGEX.test(String(value))) { setFeedback(feedbackEl, 'error', cfg.error); return; }
        const max = MAX_LENGTHS[field];
        if (max && String(value).length > max) { setFeedback(feedbackEl, 'error', cfg.error); return; }
      }
      for (const [field, max] of Object.entries(MAX_LENGTHS)) {
        const value = formData.get(field);
        if (value && String(value).length > max) { setFeedback(feedbackEl, 'error', cfg.error); return; }
      }
      if (cfg.payload === 'multipart' && cfg.filesField) {
        const files = formData.getAll(cfg.filesField);
        if (files.length > cfg.fileRules.max_files) { setFeedback(feedbackEl, 'error', cfg.error); return; }
        for (const file of files) {
          if (file.size > cfg.fileRules.max_size_bytes || !cfg.fileRules.accept.test(file.name)) {
            setFeedback(feedbackEl, 'error', cfg.error);
            return;
          }
        }
      }

      try {
        let res;
        const url = API_BASE + cfg.endpoint;
        if (cfg.payload === 'multipart') {
          res = await postMultipart(url, form);
        } else {
          formData.delete('company');
          formData.delete('form_started_at');
          const payload = {};
          formData.forEach((v, k) => { payload[k] = v; });
          res = await postJSON(url, payload);
        }
        if (!res.ok) throw new Error('net');
        setFeedback(feedbackEl, 'success', cfg.success);
        form.reset();
        applyHoneypot(form);
      } catch (err) {
        setFeedback(feedbackEl, 'error', cfg.error);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initForms);

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
