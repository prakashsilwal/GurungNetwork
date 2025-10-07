// assets/js/partials-loader.js
(() => {
  // Resolve against <base> if present; otherwise the current page's directory
  const baseHref =
    document.querySelector('base')?.href || new URL('.', window.location.href).href;
  const resolve = (p) => new URL(p, baseHref).href;

  async function inject(id, path) {
    const el = document.getElementById(id);
    if (!el) return;
    const url = resolve(path) + (path.includes('?') ? '' : `?v=${Date.now()}`);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
    el.innerHTML = await res.text();
  }

  function loadScript(path) {
    return new Promise((resolveFn, rejectFn) => {
      const s = document.createElement('script');
      s.src = resolve(path) + (path.includes('?') ? '' : `?v=${Date.now()}`);
      s.defer = true;
      s.onload = resolveFn;
      s.onerror = rejectFn;
      document.body.appendChild(s);
    });
  }

  // Always remove preloader (with a fallback timeout)
  const killPreloader = () => document.getElementById('preloader')?.remove();
  window.addEventListener('load', killPreloader);
  setTimeout(killPreloader, 3000);

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      // NOTE: no leading slashes; these are relative to <base>
      await Promise.all([
        inject('site-header', 'partials/header.html'),
        inject('site-footer', 'partials/footer.html'),
      ]);

      // Initialize AOS if it's on the page
      if (window.AOS) AOS.init({ duration: 600, once: true });

      // Load template main script AFTER header/footer are injected
      await loadScript('assets/js/main.js');
    } catch (e) {
      console.error('Partials loader error:', e);
      killPreloader();
    }
  });
})();
