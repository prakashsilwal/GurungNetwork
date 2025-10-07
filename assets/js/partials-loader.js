// assets/js/partials-loader.js
async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  const res = await fetch(url + `?v=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  el.innerHTML = await res.text();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });
}

// Always remove preloader
window.addEventListener("load", () => {
  document.getElementById("preloader")?.remove();
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Absolute paths so it works on subpages too
    await Promise.all([
      inject("site-header", "/partials/header.html"),
      inject("site-footer", "/partials/footer.html"),
    ]);

    // Make sure AOS shows your sections even if main.js hasn't run yet
    if (window.AOS) {
      AOS.init({ duration: 600, once: true });
    }

    // Load your template logic AFTER header/footer exist (cache-bust in dev)
    await loadScript("/assets/js/main.js?v=" + Date.now());
  } catch (e) {
    console.error("Partials loader error:", e);
  }
});
