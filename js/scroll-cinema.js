(function () {
  const videos = document.querySelectorAll('video.cinema-video, .hero video');
  const loadSources = (video) => {
    const lazy = video.querySelectorAll('source[data-src]');
    lazy.forEach(s => { if(!s.src) s.src = s.getAttribute('data-src'); });
    video.load();
  };
  const tryPlay = (video) => {
    const p = video.play?.();
    if (p && typeof p.then === 'function') p.catch(() => {});
  };
  const onEnter = (video) => {
    if (!video.dataset.loaded) { loadSources(video); video.dataset.loaded = '1'; }
    tryPlay(video);
  };
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries)=>entries.forEach(e=>{ if(e.isIntersecting) onEnter(e.target); }),{threshold:0.25})
    : null;
  videos.forEach(v=>{
    v.setAttribute('muted',''); v.setAttribute('playsinline',''); v.setAttribute('loop','');
    if(!v.getAttribute('preload')) v.setAttribute('preload','metadata');
    io ? io.observe(v) : onEnter(v);
  });
})();
