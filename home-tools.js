function arrangeDraftHome() {
  const home = document.querySelector('.home-page');
  const cards = home?.querySelector('.home-cards');
  if (!cards || home.dataset.draft === 'ready') return;
  home.dataset.draft = 'ready';
  const election = document.createElement('section');
  election.className = 'draft-election';
  election.setAttribute('aria-labelledby', 'election-title');
  const heading = document.createElement('div');
  heading.className = 'draft-section-heading';
  heading.innerHTML = '<h2 id="election-title">Elecciones · 29N</h2>';
  election.append(heading);
  const vote = cards.querySelector('.home-card-vote');
  const candidates = cards.querySelector('.home-card-candidates');
  const about = cards.querySelector('.home-card-about');
  candidates.querySelector('h2').textContent = 'Guía de candidaturas';
  const electionCards = document.createElement('div');
  electionCards.className = 'home-cards draft-election-grid';
  const resources = document.createElement('section');
  resources.className = 'home-cards draft-resources';
  resources.setAttribute('aria-label', 'Comparador y proyecto Neutralito');
  resources.append(vote, about);
  const newCard = document.createElement('a');
  newCard.className = 'home-card home-card-five';
  newCard.href = '/mapa-de-opciones/';
  newCard.setAttribute('aria-labelledby', 'five-card-title');
  newCard.innerHTML = `
    <div class="home-card-art five-art" aria-hidden="true">
      <img class="five-illustration" src="/mapa-de-opciones/assets/cinco-opciones.svg" alt="">
    </div>
    <div class="home-card-content">
      <h2 id="five-card-title">Mapa de opciones políticas</h2>
      <p class="home-card-subtitle">Cinco formas de posicionarte ante el sistema.</p>
      <p class="home-card-description">Consulta cada opción y descubre sus candidaturas en tu provincia.</p>
      <span class="home-card-action">Explorar las cinco vías</span>
    </div>`;
  electionCards.append(candidates, newCard);
  election.append(electionCards);
  cards.replaceWith(election, resources);
  observer.disconnect();
}
const observer = new MutationObserver(arrangeDraftHome);
observer.observe(document.getElementById('root'), { childList: true, subtree: true });
arrangeDraftHome();
