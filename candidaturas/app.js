const $=id=>document.getElementById(id);
const shapes=window.provinceShapes;
const parties=window.directoryData.parties;
let selected=new URLSearchParams(location.search).get('provincia')||'';if(!shapes.some(p=>p.name===selected))selected='';let activeParty='';
// Cobertura derivada exclusivamente de candidaturas proclamadas al Congreso en el BOE.
const partyProvinces={...window.directoryData.coverage};
const selectorFamilies=[
 {id:'PSOE',ids:['PSOE','PSC','PSE-EE (PSOE)','PSIB-PSOE','PSN-PSOE','PSdeG-PSOE'],labels:['PSOE','PSC','PSE-EE (PSOE)','PSIB-PSOE','PSN-PSOE','PSdeG-PSOE']},
 {id:'PCTE',ids:['PCTE','PCTE/ELAK','PCTG','PCTC'],labels:['PCTE','ELAK/PCTE','PCTG','PCTC']}
];
const familyById=new Map(selectorFamilies.map(f=>[f.id,f]));
const groupedVariants=new Set(selectorFamilies.flatMap(f=>f.ids.filter(id=>id!==f.id)));
const partyOptions=parties.filter(p=>!groupedVariants.has(p.id)).map(p=>{
 const f=familyById.get(p.id);if(!f)return p;
 const ids=f.ids.filter(id=>parties.some(p=>p.id===id));
 partyProvinces[p.id]=[...new Set(ids.flatMap(id=>window.directoryData.coverage[id]||[]))];
 return {...p,selectorGroup:true,groupMemberIds:ids,members:f.labels,membersLabel:'Denominaciones territoriales',membersSource:window.directoryData.source.url};
});
function normalizeSearch(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').replace(/[^a-z0-9]+/g, ' ').trim();
}
function selectParty(id) {
  const party = partyOptions.find(item => item.id === id);
  if (!party) return;
  activeParty = id;
  $('party-search').value = party.shortLabel || party.displaySigla || party.id;
  $('party-results').hidden = true;
  $('party-search-status').textContent = 'Partido seleccionado: ' + party.name;
  render();
  $('party-search').focus();
}
function filterParties() {
  const query = normalizeSearch($('party-search').value);
  const matches = partyOptions.filter(party => {
    const variants = familyById.get(party.id)?.ids || [party.id];
    const names = parties.filter(item => variants.includes(item.id)).flatMap(item => [item.name, item.cardName, item.id, item.shortLabel, item.displaySigla]);
    const searchable = normalizeSearch(names.filter(Boolean).join(' '));
    return query.split(/\s+/).every(word => searchable.includes(word));
  });
  const results = matches.map(party => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'party-result';
    button.style.setProperty('--result-party', party.color);
    const logo = document.createElement('span');
    logo.className = 'party-result-logo';
    if (party.logo) {
      const image = document.createElement('img');
      image.src = party.logo;
      image.alt = '';
      logo.append(image);
    } else {
      logo.textContent = party.shortLabel || party.id;
    }
    const text = document.createElement('span');
    const sigla = document.createElement('strong');
    sigla.textContent = party.shortLabel || party.displaySigla || party.id;
    const name = document.createElement('span');
    name.className = 'party-result-name';
    name.textContent = party.name;
    text.append(sigla, name);
    button.append(logo, text);
    button.addEventListener('click', () => selectParty(party.id));
    button.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        $('party-results').hidden = true;
        $('party-search').focus();
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const index = results.indexOf(button);
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        results[(index + offset + results.length) % results.length].focus();
      }
    });
    return button;
  });
  $('party-results').replaceChildren(...results);
  $('party-results').hidden = false;
  $('party-search-status').textContent = matches.length
    ? (query ? matches.length + ' resultados. Elige uno para ver su ficha y mapa.' : 'Elige un partido o escribe para buscarlo.')
    : 'No encontramos ese partido. Prueba con otro nombre o sus siglas.';
}
$('party-search').addEventListener('input', filterParties);
$('party-search').addEventListener('click', filterParties);
$('party-search').addEventListener('keydown', event => {
  if (event.key === 'Escape') $('party-results').hidden = true;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if ($('party-results').hidden) filterParties();
    $('party-results').children[0]?.focus();
  }
  if (event.key === 'Enter') {
    const results = $('party-results').children;
    if (!$('party-results').hidden && results.length === 1) {
      event.preventDefault();
      results[0].click();
    }
  }
});
const ordered=[...shapes].sort((a,b)=>a.name.localeCompare(b.name,'es'));
for(const id of ['province']){$(id).replaceChildren(new Option('Selecciona una provincia',''),...ordered.map(p=>new Option(p.name,p.name)));$(id).value=selected;$(id).addEventListener('change',()=>choose($(id).value));}
function card(p,territorial=true){
const c=territorial?window.directoryData.candidacies.find(c=>c.partyId===p.id&&c.provinceId===shapes.find(s=>s.name===selected)?.id):null;
const article=document.createElement('article');article.className='candidate party-candidate'+(p.logoLayout==='wide'?' party-brand-wide':p.logoLayout==='landscape'?' party-brand-landscape':'');article.style.setProperty('--party',p.color);article.style.setProperty('--party-soft',p.soft);article.style.setProperty('--party-ink',p.ink||p.color);
const head=document.createElement('div');head.className='candidate-head';const logo=document.createElement('div');logo.className='party-logo';logo.style.background=p.logoBackground||'white';if(p.logo){const img=document.createElement('img');img.src=p.logo;img.alt=p.logoAlt||'Logo de '+p.name;logo.append(img);}else{logo.classList.add('wordmark');logo.textContent=p.id;logo.setAttribute('aria-label','Identificación textual: '+p.id);}const text=document.createElement('div'),short=document.createElement('span'),title=document.createElement('h3');short.className='party-short';short.textContent=p.shortLabel||c?.sigla||p.displaySigla||p.id;title.textContent=p.cardName||c?.displayName||p.name;text.append(short,title);head.append(logo,text);article.append(head);
const location=document.createElement('p');location.className='candidate-location';location.textContent='Congreso'+(territorial&&selected?' · '+selected:'');article.append(location);
const members=c?.members||p.members||[];if(members.length){const details=document.createElement('details');details.className='coalition-members';const summary=document.createElement('summary');summary.textContent=c?.membersLabel||p.membersLabel||'Integrantes de la coalición';const body=document.createElement('p');body.textContent=members.join(' · ');details.append(summary,body);const source=c?.membersSource||p.membersSource;if(source){const link=document.createElement('a');link.href=source;link.textContent=p.selectorGroup?'Fuente BOE ↗':'Fuente de la composición ↗';link.target='_blank';link.rel='noopener noreferrer';details.append(link);}article.append(details);}
if(p.url){const official=document.createElement('a');official.className='official-link';official.href=p.url;official.target='_blank';official.rel='noopener noreferrer';official.textContent='Web oficial ↗';const domain=document.createElement('small');domain.textContent=p.domain;official.append(domain);article.append(official);}
return article;
}
function renderMap(id){const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 710 605');svg.setAttribute('role','group');svg.setAttribute('aria-label','Mapa de provincias de España');const p=partyOptions.find(p=>p.id===activeParty);for(const shape of [...shapes].sort((a,b)=>Number(a.name===selected)-Number(b.name===selected))){const path=document.createElementNS(ns,'path');path.setAttribute('d',shape.d);path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',shape.name);path.setAttribute('aria-pressed',String(shape.name===selected));path.setAttribute('class','province-shape'+(shape.name===selected&&(id==='province-map'||(p&&(partyProvinces[p.id]||[]).includes(shape.id)))?' selected':'')+(id==='party-map'&&p&&(partyProvinces[p.id]||[]).includes(shape.id)?' party-coverage':''));path.style.setProperty('--province-color',id==='province-map'?'#d6b65c':(p?p.color:'#d6b65c'));const title=document.createElementNS(ns,'title');title.textContent=shape.name;path.append(title);path.addEventListener('click',()=>choose(shape.name,false));path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(shape.name,false);}});svg.append(path);}const borders=document.createElementNS(ns,'g');borders.setAttribute('aria-hidden','true');borders.setAttribute('class','province-borders');for(const shape of [...shapes].sort((a,b)=>Number(a.name===selected)-Number(b.name===selected))){const border=document.createElementNS(ns,'path');border.setAttribute('d',shape.d);border.setAttribute('class','province-boundary'+(shape.name===selected?' boundary-selected':''));borders.append(border);}svg.append(borders);for(const [text,x,y] of [['Canarias',40,465],['Ceuta',430,480],['Melilla',565,480]]){const t=document.createElementNS(ns,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.textContent=text;svg.append(t);}for(const [x,y,w,h] of [[25,445,245,140],[410,455,110,100],[550,455,125,100]]){const r=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x,y,width:w,height:h,rx:10}))r.setAttribute(k,v);r.setAttribute('class','inset-frame');svg.append(r);}$(id).replaceChildren(svg);}
function render(){ updateProvinceShare(); $('territory').textContent=selected||'Elige tu provincia';$('intro').textContent=selected?'Conoce las candidaturas y accede a sus canales oficiales.':'Selecciona una provincia para ver las fichas.';$('candidate-list').replaceChildren(...(selected?window.directoryData.candidacies.filter(c=>c.provinceId===shapes.find(s=>s.name===selected)?.id).sort((a,b)=>a.order-b.order).map(c=>card(parties.find(p=>p.id===c.partyId))):[]));for(const id of ['province'])$(id).value=selected;$('map-selection').textContent=selected||'Selecciona una provincia en el mapa.';renderMap('province-map');renderMap('party-map');$('party-body').hidden=!activeParty;const p=partyOptions.find(p=>p.id===activeParty);if(p)$('party-card').replaceChildren(card(p,false));$('party-location').textContent=p?(partyProvinces[p.id]||[]).length+' circunscripciones con candidatura proclamada al Congreso.':'';$('party-map').hidden=false;$('all-in-province').disabled=!selected;}
function choose(name,focus=true){selected=name;const url=new URL(location.href);if(name)url.searchParams.set('provincia',name);else url.searchParams.delete('provincia');try{history.replaceState(null,'',url);}catch{}render();if(!focus){const visible=$('province-view').hidden?'party-map':'province-map';const path=[...$(visible).querySelectorAll('[role=button]')].find(p=>p.getAttribute('aria-label')===name);path?.focus({preventScroll:true});}}
function view(party){$('party-view').hidden=!party;$('province-view').hidden=party;$('by-party').setAttribute('aria-pressed',String(party));$('by-province').setAttribute('aria-pressed',String(!party));}
$('by-party').addEventListener('click',()=>view(true));$('by-province').addEventListener('click',()=>view(false));$('all-in-province').addEventListener('click',()=>view(false));



// Compartir siempre apunta a la provincia de la guía pública.
function provinceShareData() {
  const url = new URL('https://neutralito.github.io/candidaturas/');
  url.searchParams.set('provincia', selected);
  return {
    title: 'Candidaturas al Congreso por ' + selected + ' · 29N',
    text: 'Consulta las candidaturas al Congreso por ' + selected + ' para el 29N y accede a sus canales oficiales. Guía de Neutralito.',
    url: url.href
  };
}
function updateProvinceShare() {
  $('province-share').hidden = !selected;
  $('share-options').hidden = true;
  $('share-province').setAttribute('aria-expanded', 'false');
  $('share-status').textContent = '';
  if (!selected) return;
  const data = provinceShareData();
  $('share-territory').textContent = selected;
  $('share-heading').textContent = '¿Conoces a alguien que vote en ' + selected + '?';
  $('share-province').textContent = 'Compartir candidaturas de ' + selected + ' ↗';
  $('province-share-url').value = data.url;
  $('share-whatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(data.text + '\n' + data.url);
  $('share-telegram').href = 'https://t.me/share/url?url=' + encodeURIComponent(data.url) + '&text=' + encodeURIComponent(data.text);
}
$('share-province').addEventListener('click', async () => {
  if (!selected) return;
  if (navigator.share) {
    try {
      await navigator.share(provinceShareData());
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  $('share-options').hidden = !$('share-options').hidden;
  $('share-province').setAttribute('aria-expanded', String(!$('share-options').hidden));
});
$('copy-province-link').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(provinceShareData().url);
    $('share-status').textContent = 'Enlace copiado. Ya puedes pegarlo donde quieras.';
  } catch {
    $('province-share-url').focus();
    $('province-share-url').select();
    $('share-status').textContent = 'Selecciona y copia el enlace para compartirlo.';
  }
});

render();
