// A deal finder: every deal and a page for each, on hash routes. The deals
// live in data.js, so the site needs no network to show them; each deal
// links out to its store.
//
//   #/                 the board, with search and filters
//   #/?verdict=low     the board with a filter preset (for screenshots)
//   #/deal/<id>        one deal, with its verdict and evidence
//
// The lead-deal hero shows only on the unfiltered board; any filter or
// search hides it, so a filtered view shows exactly what was asked for.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CHECKED_AT, deals } from './data.js';
import { cards, dealPage, heroHTML, isDefaultState, leadDeal, listPage, missingPage } from './views.js';

const app = document.getElementById('app');

const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);

function defaultState() {
  return { q: '', category: 'All', store: 'All stores', minDiscount: 0, verdict: 'all', sort: 'saving' };
}

function stateFromHash() {
  const state = defaultState();
  const query = location.hash.split('?')[1] ?? '';
  for (const [key, value] of new URLSearchParams(query)) {
    if (key === 'q') state.q = value;
    if (key === 'category') state.category = value;
    if (key === 'store') state.store = value;
    if (key === 'minDiscount') state.minDiscount = Number(value) || 0;
    if (key === 'verdict') state.verdict = value;
    if (key === 'sort') state.sort = value;
  }
  return state;
}

function applyFilters(all, state) {
  const q = state.q.trim().toLowerCase();
  const shown = all.filter((d) => {
    if (q !== '' && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (state.category !== 'All' && d.category !== state.category) return false;
    if (state.store !== 'All stores' && d.store !== state.store) return false;
    if (percentOff(d) < state.minDiscount) return false;
    if (state.verdict !== 'all' && d.verdict !== state.verdict) return false;
    return true;
  });
  const by = {
    saving: (a, b) => b.was - b.price - (a.was - a.price),
    percent: (a, b) => percentOff(b) - percentOff(a),
    price: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
  }[state.sort] ?? ((a, b) => b.was - b.price - (a.was - a.price));
  return [...shown].sort(by);
}

function bindFilters(state) {
  const form = document.getElementById('filters');
  if (!form) return;
  const rerender = () => {
    const shown = applyFilters(deals, state);
    const hero = document.getElementById('hero');
    if (hero) hero.innerHTML = isDefaultState(state) ? heroHTML(leadDeal(deals)) : '';
    document.getElementById('count').innerHTML = `Showing <strong>${shown.length}</strong> of ${deals.length} deals`;
    document.getElementById('cards').innerHTML = cards(shown);
  };
  form.querySelector('#q').addEventListener('input', (event) => {
    state.q = event.target.value;
    rerender();
  });
  form.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.category = chip.dataset.category;
      form.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c === chip));
      rerender();
    });
  });
  form.querySelector('#store').addEventListener('change', (event) => {
    state.store = event.target.value;
    rerender();
  });
  form.querySelector('#minDiscount').addEventListener('change', (event) => {
    state.minDiscount = Number(event.target.value) || 0;
    rerender();
  });
  form.querySelector('#verdict').addEventListener('change', (event) => {
    state.verdict = event.target.value;
    rerender();
  });
  form.querySelector('#sort').addEventListener('change', (event) => {
    state.sort = event.target.value;
    rerender();
  });
  form.querySelector('#clearFilters').addEventListener('click', () => {
    Object.assign(state, defaultState());
    render();
  });
}

function render() {
  window.__shotReady = false;
  const dealMatch = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : 'Not found'} | Price Proof`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    const state = stateFromHash();
    document.title = 'Price Proof — Black Friday deals, checked';
    const shown = applyFilters(deals, state);
    app.innerHTML = listPage(shown, deals.length, state, deals);
    bindFilters(state);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();

// Checked time, for the footer line in index.html.
document.getElementById('checkedAt').textContent = new Date(CHECKED_AT).toLocaleString('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
