/* Native <details> keeps each abstract usable without JavaScript.
   This script adds show/hide-all, direct abstract links, and print expansion. */
(() => {
  'use strict';
  const toggle = document.querySelector('[data-abstracts-toggle]');
  const abstracts = Array.from(document.querySelectorAll('details.abstract'));
  if (!abstracts.length) return;

  const sync = () => {
    if (!toggle) return;
    const allOpen = abstracts.every(item => item.open);
    toggle.textContent = allOpen ? 'Hide all abstracts' : 'Show all abstracts';
    toggle.setAttribute('aria-expanded', String(allOpen));
  };
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const shouldOpen = !abstracts.every(item => item.open);
      abstracts.forEach(item => { item.open = shouldOpen; });
      sync();
    });
  }
  abstracts.forEach(item => item.addEventListener('toggle', sync));
  sync();

  // A URL ending in #paper-id-abstract opens that abstract on arrival.
  const openLinkedAbstract = () => {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target || !target.matches('details.abstract')) return;
    target.open = true;
    sync();
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
    });
  };
  window.addEventListener('hashchange', openLinkedAbstract);
  openLinkedAbstract();

  // Print complete abstracts, and restore the prior open/closed state afterward.
  let beforePrint = null;
  window.addEventListener('beforeprint', () => {
    if (beforePrint) return;
    beforePrint = abstracts.map(item => item.open);
    abstracts.forEach(item => { item.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!beforePrint) return;
    abstracts.forEach((item, index) => { item.open = beforePrint[index]; });
    beforePrint = null;
    sync();
  });
})();
