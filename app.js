const wrappers = document.querySelectorAll('.movie-list-wrapper');

wrappers.forEach((wrapper) => {
  const movieList = wrapper.querySelector('.movie-list');
  const left = wrapper.querySelector('.arrow.left');
  const right = wrapper.querySelector('.arrow.right');
  const items = movieList.querySelectorAll('img');
  const itemWidth = 300; // 270px image + ~30px margin

  let visibleCount = Math.max(1, Math.floor(window.innerWidth / itemWidth));
  let maxTranslate = Math.max(0, (items.length - visibleCount) * itemWidth);
  let currentTranslate = 0;

  function applyTransform() {
    movieList.style.transform = `translateX(${ -currentTranslate }px)`;
  }

  function recalc() {
    visibleCount = Math.max(1, Math.floor(window.innerWidth / itemWidth));
    maxTranslate = Math.max(0, (items.length - visibleCount) * itemWidth);
    if (currentTranslate > maxTranslate) currentTranslate = maxTranslate;
    if (currentTranslate < 0) currentTranslate = 0;
    applyTransform();
  }

  function resetSlider() {
    currentTranslate = 0;
    recalc();
    movieList.style.transform = 'translateX(0px)';
  }

  if (document.readyState !== 'loading') {
    resetSlider();
  }

  window.addEventListener('load', resetSlider);
  window.addEventListener('DOMContentLoaded', resetSlider);

  right && right.addEventListener('click', () => {
    currentTranslate = Math.min(currentTranslate + itemWidth, maxTranslate);
    applyTransform();
  });

  left && left.addEventListener('click', () => {
    currentTranslate = Math.max(currentTranslate - itemWidth, 0);
    applyTransform();
  });

  window.addEventListener('resize', () => {
    // debounce not necessary for small projects
    recalc();
  });
});

const slides = document.querySelectorAll('.hero-slider .featured-content');
const dots = document.querySelectorAll('.slider-dots .dot');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    currentSlide = Number(dot.dataset.slide);
    showSlide(currentSlide);
  });
});

if (slides.length > 1) {
  setInterval(nextSlide, 4500);
}

//TOGGLE

const ball = document.querySelector('.toggle-ball');
const items = document.querySelectorAll('.container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle');

ball.addEventListener('click', () => {
  items.forEach((item) => item.classList.toggle('active'));
  ball.classList.toggle('active');
});

// Sidebar panel interactions
const sidebar = document.querySelector('.sidebar');
const panel = document.getElementById('sidebarPanel');
const panelClose = document.getElementById('panelClose');

const actionMap = {
  search: 'search',
  users: 'users',
  bookmarks: 'bookmarks',
  movies: 'movies',
  time: 'time'
};

function hideAllSections() {
  panel.querySelectorAll('.panel-section').forEach(s => s.hidden = true);
}

function showPanel(action){
  if(!action) return;
  panel.classList.add('active');
  panel.setAttribute('aria-hidden','false');
  hideAllSections();
  const target = panel.querySelector(`[data-panel="${action}"]`);
  if(target) target.hidden = false;
  const title = panel.querySelector('.panel-title');
  title.textContent = action.charAt(0).toUpperCase() + action.slice(1);
}

function hidePanel(){
  panel.classList.remove('active');
  panel.setAttribute('aria-hidden','true');
}

panelClose.addEventListener('click', hidePanel);

document.querySelectorAll('.sidebar .left-menu-icon').forEach(icon => {
  const action = icon.dataset.action;
  icon.style.cursor = 'pointer';
  icon.addEventListener('click', () => {
    if(action && actionMap[action]){
      showPanel(actionMap[action]);
    }
  });
});

// Populate movies thumbnails in the panel
function loadPanelMovies(){
  const container = document.getElementById('panelMovies');
  const sample = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','15.jpg','16.jpg','17.jpg'];
  sample.forEach(name => {
    const img = document.createElement('img');
    img.src = `img/${name}`;
    img.className = 'thumb';
    img.alt = name;
    container.appendChild(img);
  });
}
loadPanelMovies();

// Search behavior (simple client-side filter)
const searchInput = document.getElementById('panelSearchInput');
const searchResults = document.getElementById('panelSearchResults');
if(searchInput){
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if(!q) return;
    // naive search over movie titles in the DOM
    const titles = Array.from(document.querySelectorAll('.movie-list-item-title'))
      .map(t => t.textContent.trim())
      .filter(t => t.toLowerCase().includes(q));
    titles.slice(0,6).forEach(t => {
      const div = document.createElement('div');
      div.className = 'search-result';
      div.textContent = t;
      searchResults.appendChild(div);
    });
  });
}

// Live clock
const clockEl = document.getElementById('panelClock');
function updateClock(){
  if(!clockEl) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;
}
setInterval(updateClock, 1000);
updateClock();

// close panel when clicking outside
document.addEventListener('click', (e)=>{
  if(!panel.classList.contains('active')) return;
  if(e.target.closest('.sidebar') || e.target.closest('.sidebar-panel')) return;
  hidePanel();
});
