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

// V2 journal: native content remains readable when JavaScript is unavailable.
(() => {
  document.querySelectorAll('[data-tabs]').forEach(gallery => {
    const tabs = [...gallery.querySelectorAll('[data-tab]')];
    const panels = [...gallery.querySelectorAll('[data-panel]')];
    const list = gallery.querySelector('.journal-tabs');
    list.setAttribute('role', 'tablist');
    function select(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].tabIndex = 0;
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    select(0);
    gallery.classList.add('js-tabs');
  });

  const dialog = document.querySelector('.image-dialog');
  let trigger;
  if (!dialog || typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('[data-zoom]').forEach(link => {
    link.addEventListener('click', event => {
      // Preserve standard open-in-new-tab and download behavior.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      const original = link.querySelector('img');
      dialog.querySelector('img').src = link.href;
      const alt = original?.alt || link.dataset.imageAlt || link.textContent.trim();
      dialog.querySelector('img').alt = alt;
      dialog.querySelector('p').textContent = alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.querySelector('img').removeAttribute('src');
    trigger?.focus();
  });
})();
