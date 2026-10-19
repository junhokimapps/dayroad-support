(() => {
  const video = document.querySelector('#hero-video');
  const button = document.querySelector('#motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  function loadVideo() {
    const source = video.querySelector('source');
    if (!source.src) { source.src = source.dataset.src; video.load(); }
  }
  function reflect() {
    button.textContent = video.paused ? '▶' : 'Ⅱ';
    button.setAttribute('aria-label', video.paused ? button.dataset.play : button.dataset.pause);
  }
  async function play() { loadVideo(); try { await video.play(); } catch (_) { reflect(); } }
  button.addEventListener('click', () => { if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); } });
  video.addEventListener('play', reflect); video.addEventListener('pause', reflect);
  // Motion is decorative and silent. Respect reduced-motion and data-saving preferences.
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) video.pause();
    else if (!userPaused && !reduced.matches && !navigator.connection?.saveData) play();
  }, {threshold: 0.15});
  observer.observe(video);
  reduced.addEventListener('change', () => { if(reduced.matches) video.pause(); });
  document.addEventListener('visibilitychange', () => { if(document.hidden) video.pause(); });
})();
