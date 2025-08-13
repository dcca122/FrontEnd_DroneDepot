(function () {
  const videos = document.querySelectorAll('video.cinema-video, .hero video');
  const loadSources = (video) => {
    const sources = video.querySelectorAll('source[data-src]');
    sources.forEach(s => {
      if (!s.src) s.src = s.getAttribute('data-src');
    });
    // Safari/iOS needs load() to register new sources
    video.load();
  };

  const tryPlay = (video) => {
    // Autoplay is allowed only when muted+playsinline; we set those attributes.
    const p = video.play();
    if (p && typeof p.then === 'function') {
      p.catch(() => {/* ignore autoplay block */});
    }
  };

  const onEnter = (video) => {
    if (!video.dataset.loaded) {
      loadSources(video);
      video.dataset.loaded = '1';
    }
    tryPlay(video);
  };

  const io = ('IntersectionObserver' in window) 
    ? new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) onEnter(e.target);
        });
      }, { threshold: 0.25 })
    : null;

  videos.forEach(v => {
    // Ensure required attrs exist even if HTML missed them
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('loop', '');
    // preload metadata keeps it quick without heavy network upfront
    if (!v.getAttribute('preload')) v.setAttribute('preload', 'metadata');

    if (io) {
      io.observe(v);
    } else {
      // Fallback: load & try to play immediately
      onEnter(v);
    }
  });
})();
