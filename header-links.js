// Ajuste exclusivo de cabeceras; no modifica el cierre de ninguna página.
(() => {
  function updateHeaderLinks() {
    const nav = document.querySelector('header nav[aria-label="Enlaces de Neutralito"]');
    if (!nav) return;
    const home = location.pathname.replace(/\/+$/, '') === '';
    for (const link of nav.querySelectorAll('a')) {
      const label = link.textContent.trim();
      if (home && /^Web(?:\s|↗|$)/.test(label)) { link.remove(); continue; }
      const url = new URL(link.href);
      const text = url.hostname === 't.me' ? 'Telegram'
        : ['x.com', 'twitter.com'].includes(url.hostname) ? 'X'
        : /^Inicio/.test(label) ? 'Inicio' : null;
      if (text && link.textContent !== text) link.textContent = text;
      if (text === 'Inicio') {
        link.setAttribute('href', '/');
        link.removeAttribute('target');
      }
    }
    observer.disconnect();
  }
  const observer = new MutationObserver(updateHeaderLinks);
  observer.observe(document.body, {childList:true, subtree:true});
  updateHeaderLinks();
})();
