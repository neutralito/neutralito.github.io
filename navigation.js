function unifyHomeLinks(){for(const link of document.querySelectorAll('a.page-back,a.back-home')){if(/Volver a(?:l)? inicio/i.test(link.textContent)&&link.textContent!=='← Volver al inicio')link.textContent='← Volver al inicio';}}
unifyHomeLinks();new MutationObserver(unifyHomeLinks).observe(document.body,{childList:true,subtree:true});
