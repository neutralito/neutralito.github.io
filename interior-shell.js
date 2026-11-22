// Cabecera y pie únicos para las cuatro páginas interiores.
(() => {
  const route = location.pathname.replace(/\/+$/, '');
  if (!['/comparador', '/que-es-neutralito', '/candidaturas', '/mapa-de-opciones'].includes(route)) return;
  const telegram = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 14.36l-2.945-.918c-.64-.203-.658-.64.135-.953l11.57-4.461c.537-.194 1.006.131.964.193z"/></svg>';
  const x = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
  const brand = '<img src="/images/logo-neutralito.png" alt="" width="496" height="225"><span>NEUTRALITO</span>';
  function mount() {
    const oldHeader = document.querySelector('header');
    const oldFooter = document.querySelector('footer');
    if (!oldHeader || !oldFooter) return;
    if (oldHeader.classList.contains('neutralito-header')) { observer.disconnect(); return; }
    const header = document.createElement('header');
    header.className = 'neutralito-header';
    header.innerHTML = `<div class="neutralito-shell-inner"><a class="neutralito-shell-brand" href="/" aria-label="Neutralito, inicio">${brand}</a><nav aria-label="Enlaces de Neutralito"><a href="/">Inicio</a><a href="https://t.me/neutralito" target="_blank" rel="noopener noreferrer" aria-label="Telegram de Neutralito (se abre en otra pestaña)">Telegram<span aria-hidden="true"> ↗</span></a><a href="https://x.com/Neutralito_e" target="_blank" rel="noopener noreferrer" aria-label="X de Neutralito (se abre en otra pestaña)">X<span aria-hidden="true"> ↗</span></a></nav></div>`;
    const footer = document.createElement('footer');
    footer.className = 'neutralito-footer';
    footer.innerHTML = `<div class="neutralito-shell-inner"><div><a class="neutralito-footer-brand" href="/" aria-label="Neutralito, inicio">${brand}</a><p>Divulgación política para entender y reflexionar.<br>Contenido educativo, sin recomendación electoral.</p></div><nav aria-label="Comunidad Neutralito"><a class="neutralito-social" href="https://t.me/neutralito" target="_blank" rel="noopener noreferrer" aria-label="Telegram de Neutralito (nueva pestaña)">${telegram}<span>Telegram</span></a><a class="neutralito-social" href="https://x.com/Neutralito_e" target="_blank" rel="noopener noreferrer" aria-label="X de Neutralito (nueva pestaña)">${x}<span>X</span></a></nav></div>`;
    oldHeader.replaceWith(header);
    // La guía tenía el pie dentro del contenedor de contenido limitado en anchura.
    if (oldFooter.parentElement?.tagName === 'MAIN') {
      oldFooter.parentElement.after(footer);
      oldFooter.remove();
    } else oldFooter.replaceWith(footer);
    observer.disconnect();
  }
  const observer = new MutationObserver(mount);
  observer.observe(document.body, {childList:true, subtree:true});
  mount();
})();
