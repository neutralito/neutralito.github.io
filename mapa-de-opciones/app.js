const paths = [
  {
    id: 'abstencion', number: '1', title: 'Abstención activa', color: '#b53d4d',
    thesis: 'Decido no votar porque rechazo el sistema.',
    intro: 'Me abstengo porque considero que las elecciones no me permiten estar representado ni controlar a quienes gobiernan. Con esa decisión muestro mi rechazo al sistema y cuestiono su legitimidad.',
    limit: 'Si voto en blanco o nulo, mi voto cuenta como participación y doy legitimidad al gobierno que se conforme. Al abstenerme, rechazo el sistema y el futuro gobierno pierde legitimidad.',
  },
  {
    id: 'blanco', number: '2', title: 'Escaños en Blanco', color: '#65758a',
    thesis: 'Voto para dejar vacío un escaño.',
    intro: 'Quiero participar, pero ninguna de las demás candidaturas me representa. Elijo Escaños en Blanco para hacer visible ese rechazo: si obtiene escaños, se compromete a dejarlos vacíos, sin tomar posesión ni cobrar por ellos.',
    limit: 'Puedo elegir esta candidatura en las provincias donde se presenta.',
  },
  {
    id: 'alternativos', number: '3', title: 'Partidos alternativos', color: '#24765e',
    thesis: 'Intento cambiar las reglas desde dentro.',
    intro: 'Doy una oportunidad a otras candidaturas con la esperanza de que cambien cómo funciona la política. Confío en que, si consiguen representación, utilicen ese espacio para transformar el sistema.',
    limit: 'Asumo el riesgo de que se acomoden al llegar al poder y terminen actuando como los partidos reaccionarios o conservadores que quería superar.',
  },
  {
    id: 'reaccionarios', number: '4', title: 'Partidos reaccionarios', color: '#7851a9',
    thesis: 'Voto contra el otro bando y mantengo las mismas reglas.',
    intro: 'Apoyo a partidos cuya acción política se centra en combatir a otros partidos. Me movilizo para que gane mi opción frente al adversario.',
    limit: 'Con mi voto contribuyo a disputar quién ocupa el poder, manteniendo sus reglas de funcionamiento. No estoy apoyando un cambio estructural del sistema.',
  },
  {
    id: 'conservadores', number: '5', title: 'Conservadores del sistema', color: '#3568ae',
    thesis: 'Voto a quienes han diseñado el sistema y perpetúo su poder.',
    intro: 'Apoyo a partidos que han construido y sostenido unas reglas que concentran el poder en sus manos. PP y PSOE son sus principales exponentes. Con mi voto mantengo el funcionamiento del que se benefician.',
    limit: 'Como ciudadano, tengo poca capacidad para poner límites a su poder, controlar sus decisiones y exigirles responsabilidades. Con mi decisión doy continuidad a esa falta de control.',
  }
];

paths.reverse().forEach((path, index) => { path.number = String(index + 1); });

const data = window.directoryData;
const shapes = window.provinceShapes;
const byId = new Map(data.parties.map(party => [party.id, party]));
paths.find(path => path.id === 'blanco').color = byId.get('Escaños en Blanco').color;
const allColor = '#C4A24C';
const initialClassification = {
  'Escaños en Blanco': 'blanco', 'PODEMOS': 'reaccionarios', 'Vox': 'reaccionarios',
  'SALF': 'alternativos', 'FO': 'alternativos', 'IE': 'alternativos', 'D21': 'alternativos',
  'PACMA': 'alternativos', 'MUNDO+JUSTO': 'alternativos',
  'COMPROMIS': 'reaccionarios',
  'ADELANTE ANDALUCÍA': 'alternativos',
  'BNG': 'reaccionarios', 'CHA-FA': 'reaccionarios',
  'CCa-1ºCAN': 'alternativos',
  'GEROA BAI': 'reaccionarios',
  'ARAMÉS-EU-MS': 'reaccionarios',
  'FE de las JONS': 'alternativos', 'PH': 'alternativos',
  'PARTIDO AUTÓNOMOS': 'alternativos',
  'PUEDE': 'alternativos', 'P ALANTRE': 'alternativos', 'PREPAL': 'alternativos',
  'PANCAL-URCI': 'alternativos', 'PDSJE': 'alternativos', 'EGUZKILORE': 'alternativos',
  'EH BILDU-ERC': 'reaccionarios', 'UPN-PP': 'conservadores',
  'FIA': 'alternativos', 'TERUEL EXISTE': 'alternativos', 'SY': 'alternativos',
  'NEX': 'alternativos', 'ALHORA': 'alternativos', 'CNV': 'alternativos',
  'COMUNS-FA': 'reaccionarios',
  '3e': 'alternativos',
  'D.R.G': 'alternativos', 'LIB': 'alternativos', 'UPC': 'reaccionarios',
  'PCPC': 'alternativos', '29': 'alternativos',
  'PFAC': 'alternativos',
  'PCTE': 'alternativos', 'PCTE/ELAK': 'alternativos',
  'PCTG': 'alternativos', 'PCTC': 'alternativos',
  'RRB': 'alternativos', 'VLC': 'alternativos', 'AGENDA VALENCIANA': 'alternativos',
  'ERC': 'conservadores', 'EAJ-PNV': 'conservadores',
  'JxCat': 'reaccionarios', 'EH Bildu': 'reaccionarios',
  'FA': 'reaccionarios', 'FA-GAL': 'reaccionarios', 'FA-EUS': 'reaccionarios',
  'FA-NAV': 'reaccionarios', 'FA-AND': 'reaccionarios', 'FA-AST': 'reaccionarios',
  'PP': 'conservadores', 'PSOE': 'conservadores', 'PSC': 'conservadores',
  'PSE-EE (PSOE)': 'conservadores', 'PSIB-PSOE': 'conservadores',
  'PSN-PSOE': 'conservadores', 'PSdeG-PSOE': 'conservadores'
};
const classification = initialClassification;
const parameters = new URLSearchParams(location.search);
let activePath = paths.some(path => path.id === parameters.get('via')) || parameters.get('via') === 'todos'
  ? parameters.get('via') : 'conservadores';
let selectedProvince = shapes.some(shape => shape.id === parameters.get('provincia'))
  ? parameters.get('provincia') : '';
let shareScope = '';
let shareScopeChosen = false;
const get = id => document.getElementById(id);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function currentCandidates(provinceId) {
  return data.candidacies.filter(candidate => candidate.provinceId === provinceId);
}

function matches(candidate) {
  return activePath === 'todos' || classification[candidate.partyId] === activePath;
}

function renderFilters() {
  createFilterButtons('path-filters', false);
  createFilterButtons('map-filters', true);
}

function createFilterButtons(containerId, compact) {
  const options = compact ? [...paths, { id: 'todos', number: '6', title: 'Todas las opciones', color: allColor }] : paths;
  const buttons = options.map(path => {
    const button = element('button', compact ? 'path-button compact-path' : 'path-button');
    button.type = 'button';
    button.style.setProperty('--path', path.color);
    button.setAttribute('aria-pressed', String(activePath === path.id));
    button.append(element('span', 'path-number', path.number), element('strong', '', path.title));
    button.addEventListener('click', () => {
      activePath = path.id;
      render();
      get(containerId).children[options.indexOf(path)].focus({ preventScroll: true });
    });
    return button;
  });
  get(containerId).replaceChildren(...buttons);
}

function renderExplanation() {
  const path = paths.find(item => item.id === activePath);
  document.documentElement.style.setProperty('--active', path?.color || allColor);
  const box = get('path-explanation');
  if (!path) {
    box.replaceChildren(element('span', 'tag', 'VISTA CONJUNTA'), element('h2', '', 'Todas las opciones'), element('p', '', 'Consulta las candidaturas de tu provincia y la opción de abstención activa. Selecciona un bloque para conocer su argumento y explorar sus candidaturas.'));
    return;
  }
  box.replaceChildren(element('span', 'tag', 'OPCIÓN ' + path.number), element('h2', '', path.title), element('p', 'thesis', path.thesis), element('p', '', path.intro), element('p', 'path-limit', path.limit));
  if (path.id === 'blanco') {
    box.append(element('p', 'path-limit option-difference', 'Al votar a Escaños en Blanco elijo una candidatura. Si voto en blanco o nulo, mi voto no se convierte en un escaño vacío.'));
    const link = element('a', 'source-small', 'Consultar el compromiso de Escaños en Blanco');
    link.href = 'https://escanos.org/conocenos/estatutos-del-partido/';
    box.append(link);
    const provincesLink = element('a', 'source-small', 'Ver en qué provincias se presenta');
    provincesLink.href = '/candidaturas/?partido=' + encodeURIComponent('Escaños en Blanco');
    box.append(provincesLink);
  }
  if (path.id === 'blanco' || path.id === 'abstencion') {
    const comparisonLink = element('a', 'source-small', 'Ver las diferencias con el voto en blanco y nulo');
    comparisonLink.href = 'https://neutralito.github.io/comparador/';
    box.append(comparisonLink);
  }
}

function renderMap() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 710 605');
  svg.setAttribute('role', 'group');
  svg.setAttribute('aria-label', activePath === 'abstencion'
    ? 'Seleccionar provincia. La abstención activa está disponible en todas las provincias.'
    : 'Seleccionar provincia. El color indica presencia de las opciones del filtro.');
  for (const shape of shapes) {
    const covered = activePath === 'abstencion' || activePath === 'todos' || currentCandidates(shape.id).some(matches);
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', shape.d);
    path.setAttribute('class', 'province-shape' + (covered ? ' coverage' : '') + (selectedProvince === shape.id ? ' selected' : ''));
    path.setAttribute('role', 'button');
    path.setAttribute('tabindex', '0');
    path.setAttribute('aria-label', shape.name);
    path.setAttribute('aria-pressed', String(selectedProvince === shape.id));
    const title = document.createElementNS(ns, 'title');
    title.textContent = shape.name;
    path.append(title);
    function choose() {
      selectedProvince = shape.id;
      render();
      get('province-map').querySelector('[data-id="' + shape.id + '"]').focus({ preventScroll: true });
    }
    path.dataset.id = shape.id;
    path.addEventListener('click', choose);
    path.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose();
      }
    });
    svg.append(path);
  }
  for (const [text, x, y] of [['Canarias', 40, 465], ['Ceuta', 430, 480], ['Melilla', 565, 480]]) {
    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.textContent = text;
    svg.append(label);
  }
  for (const [x, y, width, height] of [[25, 445, 245, 140], [410, 455, 110, 100], [550, 455, 125, 100]]) {
    const frame = document.createElementNS(ns, 'rect');
    for (const [name, value] of Object.entries({ x, y, width, height, rx: 10 })) frame.setAttribute(name, value);
    frame.setAttribute('class', 'inset-frame');
    svg.append(frame);
  }
  get('province-map').replaceChildren(svg);
  get('province').value = selectedProvince;
  const province = shapes.find(shape => shape.id === selectedProvince);
  get('map-caption').textContent = province ? province.name + ' · Congreso' : 'Selecciona una provincia en el mapa o en la lista.';
  get('map-legend').textContent = activePath === 'abstencion'
    ? 'Rojo · La abstención activa puede ejercerse en cualquier provincia.'
    : activePath === 'todos'
      ? 'Dorado · Consulta las candidaturas y la abstención activa en la provincia que elijas.'
      : 'El color del bloque indica presencia de candidaturas clasificadas en esa opción. El tono más intenso destaca la provincia que elijas.';
}

function partyCard(candidate) {
  const party = byId.get(candidate.partyId);
  const block = paths.find(path => path.id === classification[party.id]);
  const card = element('article', 'party-card');
  card.style.setProperty('--block-color', block.color);
  const logo = element('div', 'party-logo');
  if (party.logoBackground) logo.style.backgroundColor = party.logoBackground;
  if (party.logo) {
    const image = document.createElement('img');
    image.src = '/' + 'candidaturas/' + party.logo;
    image.alt = '';
    image.loading = 'lazy';
    logo.append(image);
  } else logo.append(element('span', '', party.shortLabel || party.id));
  const content = element('div', 'party-content');
  content.append(
    element('h4', '', party.shortLabel || candidate.sigla || party.displaySigla || party.id),
    element('p', '', party.cardName || candidate.displayName || party.name),
    element('span', 'classification-label', block.title)
  );
  card.append(logo, content);
  return card;
}

function abstentionImage() {
  const image = document.createElement('img');
  image.src = 'assets/abstencion-activa.svg';
  image.alt = '';
  return image;
}

function abstentionCard() {
  const card = element('article', 'party-card abstention-card');
  const logo = element('div', 'party-logo abstention-logo');
  logo.append(abstentionImage());
  const content = element('div', 'party-content');
  content.append(element('h4', '', 'Abstención activa'), element('p', '', 'Decido no votar porque rechazo el sistema.'), element('span', 'availability-label', 'Disponible en todas las provincias'));
  const link = element('a', 'source-small', 'Consultar esta opción');
  const url = new URL(location.href);
  url.searchParams.set('via', 'abstencion');
  url.searchParams.set('provincia', selectedProvince);
  link.href = url.href;
  content.append(link);
  card.append(logo, content);
  return card;
}

function renderResults() {
  const province = shapes.find(shape => shape.id === selectedProvince);
  const candidates = currentCandidates(selectedProvince).sort((a, b) => a.order - b.order);
  const visible = candidates.filter(matches);
  const path = paths.find(item => item.id === activePath);
  get('province-title').textContent = province?.name || 'Elige tu provincia';
  get('result-filter').textContent = path?.title || 'Todas las opciones';
  get('result-summary').textContent = '';
  get('candidate-list').replaceChildren();
  if (!province) {
    get('result-summary').textContent = 'Selecciona una provincia para explorar esta opción.';
    const prompt = element('div', 'empty-state');
    prompt.append(element('h4', '', 'Empieza por tu provincia'), element('p', '', 'Usa el mapa o el desplegable para consultar las candidaturas y su clasificación. Puedes cambiar de bloque con los filtros de arriba.'));
    get('candidate-list').append(prompt);
    return;
  }
  if (activePath === 'abstencion') {
    get('result-summary').textContent = 'La abstención activa se plantea en cualquier provincia.';
    const state = element('div', 'empty-state abstention-detail');
    const symbol = element('div', 'abstention-symbol');
    symbol.append(abstentionImage());
    state.append(symbol, element('h4', '', 'Decido abstenerme'), element('p', '', 'Elijo no votar de forma consciente para expresar mi rechazo al sistema y cuestionar su legitimidad.'), element('span', 'availability-label', 'Disponible en todas las provincias'));
    const explanationLink = element('a', 'source-small', 'Leer la explicación de la abstención activa');
    explanationLink.href = '#path-explanation';
    state.append(explanationLink);
    const link = element('a', 'source-small', 'Entender los efectos de abstención, blanco y nulo');
    link.href = 'https://neutralito.github.io/comparador/';
    state.append(link);
    get('candidate-list').append(state);
    return;
  }
  if (visible.length) get('candidate-list').append(...visible.map(partyCard));
  else {
    const state = element('div', 'empty-state');
    state.append(element('h4', '', 'Sin candidaturas de este bloque'), element('p', '', 'En el directorio consultado no figuran candidaturas de este bloque para ' + province.name + '. Puedes consultar otra opción o cambiar de provincia.'));
    get('candidate-list').append(state);
  }
  if (activePath === 'todos') get('candidate-list').append(abstentionCard());
}

function render() {
  renderFilters();
  renderExplanation();
  renderMap();
  renderResults();
  const url = new URL(location.href);
  url.searchParams.set('via', activePath);
  if (selectedProvince) url.searchParams.set('provincia', selectedProvince);
  else url.searchParams.delete('provincia');
  history.replaceState(null, '', url);
  updateShare();
}

get('province').append(new Option('Selecciona una provincia', ''));
for (const shape of [...shapes].sort((a, b) => a.name.localeCompare(b.name, 'es'))) get('province').append(new Option(shape.name, shape.id));
get('province').addEventListener('change', event => {
  selectedProvince = event.target.value;
  render();
});

const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.protocol === 'file:';

function selectionShareData() {
  const path = paths.find(item => item.id === activePath);
  const province = shapes.find(shape => shape.id === selectedProvince);
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  if (shareScope === 'tool') {
    return {
      title: 'Mapa de opciones políticas para el 29N | Neutralito',
      text: 'La decisión va más allá de elegir partido. Explora cinco formas de posicionarte ante el sistema y descubre qué candidaturas hay en tu provincia.',
      url: url.href
    };
  }
  if (shareScope === 'province') {
    url.searchParams.set('via', 'todos');
    url.searchParams.set('provincia', province.id);
    url.hash = 'explore';
    return {
      title: 'Todas las opciones · ' + province.name + ' | Neutralito',
      text: '¿Qué opciones hay en ' + province.name + '? Consulta cómo clasifica Neutralito las candidaturas al Congreso y explora también la abstención activa.',
      url: url.href
    };
  }
  const blockTexts = {
    conservadores: '¿Qué implica apoyar a quienes sostienen el sistema? Explora este bloque y la crítica a la continuidad del poder de los partidos.',
    reaccionarios: '¿Cambiar quién gobierna o cambiar las reglas? Explora la crítica a la política de bandos y las candidaturas de este bloque.',
    alternativos: '¿Se puede cambiar el sistema desde dentro? Conoce esta opción y el riesgo de que una candidatura termine acomodándose al poder.',
    blanco: '¿Votar para dejar vacío un escaño? Conoce la propuesta de Escaños en Blanco y sus diferencias con el voto en blanco y nulo.',
    abstencion: '¿Qué significa abstenerse de forma consciente? Conoce la abstención activa como rechazo al sistema y sus diferencias con el voto en blanco y nulo.'
  };
  url.searchParams.set('via', path.id);
  let title = path.title;
  let text = blockTexts[path.id];
  if (shareScope === 'selection') {
    title += ' · ' + province.name;
    text += path.id === 'abstencion'
      ? ' Consulta esta opción en ' + province.name + '.'
      : ' Consulta las candidaturas que Neutralito sitúa en este bloque en ' + province.name + '.';
    url.searchParams.set('provincia', province.id);
    url.hash = 'explore';
  } else url.hash = 'path-explanation';
  return { title: title + ' | Neutralito', text, url: url.href };
}

function shareMessage() {
  const selection = selectionShareData();
  return selection.title + '\n\n' + selection.text + '\n\n' + selection.url;
}

function updateShare() {
  const hasBlock = activePath !== 'todos';
  const allowedScopes = { tool: true, block: hasBlock, province: Boolean(selectedProvince), selection: hasBlock && Boolean(selectedProvince) };
  if (!shareScopeChosen || !allowedScopes[shareScope]) {
    shareScope = allowedScopes.selection ? 'selection' : allowedScopes.province ? 'province' : allowedScopes.block ? 'block' : 'tool';
  }
  for (const button of document.querySelectorAll('[data-share-scope]')) {
    button.disabled = !allowedScopes[button.dataset.shareScope];
    button.setAttribute('aria-pressed', String(button.dataset.shareScope === shareScope));
  }
  const selection = selectionShareData();
  get('share-preview-title').textContent = selection.title;
  get('share-preview-text').textContent = selection.text;
  get('share-scope-hint').hidden = Object.values(allowedScopes).every(Boolean);
  get('share-status').textContent = '';
}

for (const button of document.querySelectorAll('[data-share-scope]')) {
  button.addEventListener('click', () => {
    shareScope = button.dataset.shareScope;
    shareScopeChosen = true;
    updateShare();
  });
}

get('share-submit').addEventListener('click', async () => {
  const button = get('share-submit');
  button.disabled = true;
  try {
    if (!localPreview && typeof navigator.share === 'function') {
      await navigator.share(selectionShareData());
      return;
    }
    await navigator.clipboard.writeText(shareMessage());
    get('share-status').textContent = 'Mensaje y enlace copiados. Ya puedes pegarlos donde quieras compartirlos.';
  } catch (error) {
    if (error.name !== 'AbortError') get('share-status').textContent = 'No se ha podido compartir. Puedes copiar la dirección desde la barra del navegador.';
  } finally {
    button.disabled = false;
  }
});
render();
