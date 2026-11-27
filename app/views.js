// HTML for each page, built from the deal data. Every value is escaped
// before it goes into the page. No network: all text and icons come from
// this site's own files.

import { categories, stores, verdictLabels } from './data.js';
import { iconFor, tintFor } from './icons.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const saved = (d) => d.was - d.price;
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

export function verdictBadge(d) {
  return `<span class="badge badge-${d.verdict}">${escape(verdictLabels[d.verdict])}</span>`;
}

function card(d) {
  return `<article class="card">
  <div class="thumb ${tintFor(d.category)}">${iconFor(d.category)}</div>
  <div class="card-body">
  <div class="card-top"><span class="cat">${escape(d.category)}</span>${verdictBadge(d)}</div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="store">${escape(d.store)}</p>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save">You save ${usd(saved(d))}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="card-link"><a class="btn" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
  </div>
</article>`;
}

export function cards(shown) {
  if (shown.length === 0) {
    return '<p class="empty">No deal matches those filters. Clear the search or pick a wider category, store or discount.</p>';
  }
  return `<div class="grid">${shown.map(card).join('')}</div>`;
}

// The filter rail: search, category chips, store, discount, verdict, sort.
export function filterRail(state) {
  const chips = ['All', ...categories]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? ' active' : ''}" data-category="${escape(c)}">${escape(c)}</button>`,
    )
    .join('');
  const storeOptions = ['All stores', ...stores]
    .map((s) => `<option${state.store === s ? ' selected' : ''}>${escape(s)}</option>`)
    .join('');
  const discountOptions = [
    ['0', 'Any discount'],
    ['20', '20% off or more'],
    ['30', '30% off or more'],
    ['40', '40% off or more'],
    ['50', '50% off or more'],
  ]
    .map(([v, label]) => `<option value="${v}"${String(state.minDiscount) === v ? ' selected' : ''}>${label}</option>`)
    .join('');
  const verdictOptions = [
    ['all', 'All verdicts'],
    ['low', 'Record Low only'],
    ['strong', 'Strong Deal only'],
    ['routine', 'Usual Price only'],
  ]
    .map(([v, label]) => `<option value="${v}"${state.verdict === v ? ' selected' : ''}>${label}</option>`)
    .join('');
  const sortOptions = [
    ['saving', 'Biggest saving ($)'],
    ['percent', 'Biggest discount (%)'],
    ['price', 'Lowest price'],
    ['priceDesc', 'Highest price'],
  ]
    .map(([v, label]) => `<option value="${v}"${state.sort === v ? ' selected' : ''}>${label}</option>`)
    .join('');
  return `<form class="rail" id="filters" onsubmit="return false">
  <label class="field">Search deals
    <input type="search" id="q" value="${escape(state.q)}" placeholder="Try &ldquo;AirPods&rdquo; or &ldquo;TV&rdquo;" autocomplete="off">
  </label>
  <fieldset class="field"><legend>Category</legend><div class="chips">${chips}</div></fieldset>
  <label class="field">Store
    <select id="store">${storeOptions}</select>
  </label>
  <label class="field">Discount
    <select id="minDiscount">${discountOptions}</select>
  </label>
  <label class="field">Verdict
    <select id="verdict">${verdictOptions}</select>
  </label>
  <label class="field">Sort by
    <select id="sort">${sortOptions}</select>
  </label>
  <button type="button" class="clear" id="clearFilters">Clear all filters</button>
  <p class="rail-note">Every badge is a verdict, not a sales pitch. Record Low means the lowest price the source has tracked; Usual Price means the cut is real but ordinary.</p>
</form>`;
}

export function isDefaultState(state) {
  return (
    state.q === '' &&
    state.category === 'All' &&
    state.store === 'All stores' &&
    Number(state.minDiscount) === 0 &&
    state.verdict === 'all' &&
    state.sort === 'saving'
  );
}

// The lead deal: the record low with the biggest dollar saving. Shown only
// on the unfiltered board, so a filtered view shows exactly what was asked.
export function leadDeal(all) {
  const lows = all.filter((d) => d.verdict === 'low');
  return lows.reduce((best, d) => (saved(d) > saved(best) ? d : best), lows[0]);
}

export function heroHTML(d) {
  return `<section class="hero">
  <p class="hero-eyebrow">Deal of the day &middot; Record Low</p>
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <p class="hero-store">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save big">You save ${usd(saved(d))}</p>
  <p class="hero-evidence">${escape(d.evidence)}</p>
  <p><a class="btn big" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a>
  <a class="hero-detail" href="#/deal/${encodeURIComponent(d.id)}">Why it is a real deal &rarr;</a></p>
</section>`;
}

export function listPage(shown, total, state, all) {
  const hero = isDefaultState(state) ? heroHTML(leadDeal(all)) : '';
  return `<section class="layout">
  ${filterRail(state)}
  <div class="results">
    <div id="hero">${hero}</div>
    <p class="count" id="count">Showing <strong>${shown.length}</strong> of ${total} deals</p>
    <div id="cards">${cards(shown)}</div>
  </div>
</section>`;
}

export function dealPage(d) {
  const others = d.note ? `<p class="note">${escape(d.note)}</p>` : '';
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="cat">${iconFor(d.category)}${escape(d.category)}</span>${verdictBadge(d)}</div>
  <h1>${escape(d.title)}</h1>
  <p class="store">${escape(d.store)}</p>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="save big">You save ${usd(saved(d))}</p>
  <h2>Is it really a deal?</h2>
  <p class="evidence">${escape(d.evidence)}</p>
  ${others}
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Discount</dt><dd>${percentOff(d)}% off, save ${usd(saved(d))}</dd>
    <dt>Price checked</dt><dd>${day(d.checked)}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="btn big" href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
  <p class="fine">Prices move fast on Black Friday. Verify the price at the store before you buy.</p>
</article>`;
}

export function missingPage() {
  return `<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
