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
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

function applyCityCopyOverrides(cityCode) {
  const overrides = (window.DD_CITY_COPY_OVERRIDES || {})[cityCode];
  if (!overrides) return;
  Object.entries(overrides).forEach(([selector, text]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  });
}

function initPilotCityMode() {
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city');
  if (!city) return;
  document.querySelectorAll('[data-city-badge]').forEach(el => {
    el.textContent = `Pilot: ${city}`;
    el.hidden = false;
  });
  applyCityCopyOverrides(city);
  ['#remodel-form', '#municipal-form'].forEach(sel => {
    const form = document.querySelector(sel);
    if (!form) return;
    let input = form.querySelector('input[name="city"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'city';
      form.appendChild(input);
    }
    input.value = city;
  });
}

function initUploadUI(formEl, inputName, listSelector) {
  if (!formEl) return;
  const input = formEl.querySelector(`input[name="${inputName}"]`);
  const list = formEl.querySelector(listSelector);
  if (!input || !list) return;
  let files = [];

  function updateInput() {
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    input.files = dt.files;
  }

  function render() {
    list.innerHTML = '';
    files.forEach((file, idx) => {
      const li = document.createElement('li');
      li.setAttribute('data-file-item', '');
      const nameSpan = document.createElement('span');
      nameSpan.setAttribute('data-name', '');
      nameSpan.textContent = file.name;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-remove', '');
      btn.setAttribute('aria-label', 'Remove file');
      btn.innerHTML = '&times;';
      btn.addEventListener('click', () => {
        files.splice(idx, 1);
        updateInput();
        render();
      });
      li.append(nameSpan, ' ', btn);
      list.appendChild(li);
    });
  }

  input.addEventListener('change', () => {
    const selected = Array.from(input.files);
    selected.forEach(file => {
      if (files.length >= 10) return;
      if (file.size > 10485760) return;
      if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) return;
      files.push(file);
    });
    updateInput();
    render();
    input.value = '';
  });
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

document.addEventListener('DOMContentLoaded', () => {
  initForms();
  initPilotCityMode();
  const remodelForm = document.querySelector('#remodel-form');
  if (remodelForm) initUploadUI(remodelForm, 'permitDocs[]', '[data-file-list]');
  initConsentAnalytics();
  initAnalyticsEvents();
});
 
function initConsentAnalytics() {
  const toggle = document.querySelector('[data-consent-toggle]');
  if (!toggle) return;
  const key = 'dd-analytics-consent';
  const enable = () => {
    if (window.DD_ANALYTICS) return;
    window.DD_ANALYTICS = true;
    if (window.DD_GA_ID) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${window.DD_GA_ID}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){dataLayer.push(arguments);};
      gtag('js', new Date());
      gtag('config', window.DD_GA_ID);
    }
  };
  if (localStorage.getItem(key) === '1') {
    toggle.checked = true;
    enable();
  }
  toggle.addEventListener('change', e => {
    if (e.target.checked) {
      localStorage.setItem(key, '1');
      enable();
    } else {
      localStorage.removeItem(key);
      window.DD_ANALYTICS = false;
    }
  });
}

function ddTrack(eventName, payload) {
  if (window.DD_ANALYTICS && typeof gtag === 'function') {
    gtag('event', eventName, payload);
  } else {
    console.log('ddTrack', eventName, payload);
  }
}

function initAnalyticsEvents() {
  const events = [
    { name: 'lead_submit', selector: '#lead-intake-form' },
    { name: 'remodel_submit', selector: '#remodel-form' },
    { name: 'municipal_submit', selector: '#municipal-form' },
    { name: 'contact_submit', selector: '#contact-form' },
    { name: 'newsletter_submit', selector: '#newsletter-form' }
  ];
  events.forEach(evt => {
    const el = document.querySelector(evt.selector);
    if (el) {
      el.addEventListener('submit', () => ddTrack(evt.name, {}));
    }
  });
}

// Update year in footers
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function initScrollCinema(){
  const sections = document.querySelectorAll('.scroll-cinema');
  if(!sections.length) return;
  // Lazy-load video sources and control play/pause based on viewport
  const loadVideoSources = (video)=>{
    if(video.dataset.loaded) return;
    const srcMp4 = video.getAttribute('data-src-mp4');
    const srcWebm = video.getAttribute('data-src-webm');
    const sWebm = video.querySelector('source[type="video/webm"]');
    const sMp4  = video.querySelector('source[type="video/mp4"]');
    if(sWebm && srcWebm) sWebm.src = srcWebm;
    if(sMp4  && srcMp4)  sMp4.src  = srcMp4;
    video.load();
    video.dataset.loaded = '1';
  };
  // Pause all but one
  const pauseAll = (except)=>{
    sections.forEach(sec=>{
      const v = sec.querySelector('.cinema-video');
      if(v && v !== except && !v.paused){ try{ v.pause(); }catch(e){} }
    });
  };
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const sec = entry.target;
      const video = sec.querySelector('.cinema-video');
      if(!video) return;
      if(entry.isIntersecting && entry.intersectionRatio > 0.5){
        loadVideoSources(video);
        pauseAll(video);
        sec.classList.add('is-active');
        try{ video.play(); }catch(e){}
      } else {
        sec.classList.remove('is-active');
        try{ video.pause(); }catch(e){}
      }
    });
  }, { threshold: [0, 0.5, 0.75] });
  sections.forEach(sec=>obs.observe(sec));
}

function initHeroVideo(){
  const video = document.getElementById('hero-video');
  if(!video) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        try{ video.play(); }catch(e){}
      } else {
        try{ video.pause(); }catch(e){}
      }
    });
  },{threshold:0.5});
  obs.observe(video);
}

document.addEventListener('DOMContentLoaded', ()=>{
  try{ initHeroVideo(); }catch(e){ console.warn('HeroVideo init failed', e); }
  try{ initScrollCinema(); }catch(e){ console.warn('ScrollCinema init failed', e); }
});
