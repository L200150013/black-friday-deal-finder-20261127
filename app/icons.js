// Category icons: small inline SVGs drawn for this site, one per category.
// No images, no network, no emoji — just strokes on the card's accent color.

const ICONS = {
  Audio:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  Gaming:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8h10a5 5 0 0 1 5 5v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a5 5 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 11v3M5.5 12.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="11.5" r="1.1" fill="currentColor"/><circle cx="18.5" cy="13.5" r="1.1" fill="currentColor"/></svg>',
  Home:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  Kitchen:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h6v7a3 3 0 0 1-6 0V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M11 5h3a3 3 0 0 1 0 6h-2M8 16v5M14 16v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  Laptops:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2 18h20l-2-3H4l-2 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  Phones:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  "Smart home":
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 6v9a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1V9l8-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  Tablets:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 17.5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  Toys:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8V4M8 4h8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="13" r="1.2" fill="currentColor"/><circle cx="15" cy="13" r="1.2" fill="currentColor"/><path d="M9 17h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  TVs:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 21h6M12 17v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  Wearables:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5V12l2.5 1.5M9.5 3.5L10 6.5M14.5 3.5L14 6.5M9.5 20.5L10 17.5M14.5 20.5L14 17.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

export function iconFor(category) {
  return ICONS[category] ?? ICONS.Home;
}

// Muted tint per category, for the card's visual band. One tint per
// category so the grid reads as varied without any copied imagery.
const TINTS = {
  Audio: "tint-audio",
  Gaming: "tint-gaming",
  Home: "tint-home",
  Kitchen: "tint-kitchen",
  Laptops: "tint-laptops",
  Phones: "tint-phones",
  "Smart home": "tint-smarthome",
  Tablets: "tint-tablets",
  Toys: "tint-toys",
  TVs: "tint-tvs",
  Wearables: "tint-wearables",
};

export function tintFor(category) {
  return TINTS[category] ?? "tint-home";
}
