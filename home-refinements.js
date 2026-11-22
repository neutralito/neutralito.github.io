// Ajustes de Inicio pendientes de publicación junto con las cabeceras.
(() => {
  if (location.pathname.replace(/\/+$/, '') !== '') return;
  function updateHome() {
    const intro = document.querySelector('.home-intro');
    const brand = document.querySelector('.site-footer .footer-brand');
    if (!intro || !brand) return;
    intro.querySelector('.eyebrow')?.remove();
    brand.setAttribute('href', '/');
    brand.setAttribute('aria-label', 'Neutralito, inicio');
    brand.removeAttribute('target');
    brand.removeAttribute('rel');
    const legacy = document.createElement('a');
    legacy.className = 'home-legacy-link';
    legacy.href = 'https://neutralito.github.io/web/';
    legacy.target = '_blank';
    legacy.rel = 'noopener noreferrer';
    legacy.textContent = 'Web anterior ↗';
    legacy.setAttribute('aria-label', 'Web anterior de Neutralito (nueva pestaña)');
    brand.parentElement.append(legacy);
    observer.disconnect();
  }
  const observer = new MutationObserver(updateHome);
  observer.observe(document.body, {childList:true, subtree:true});
  updateHome();
})();
