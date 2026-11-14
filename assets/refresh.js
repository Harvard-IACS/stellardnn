'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    menu.focus();
  }
});
const search = document.querySelector('#pub-search');
if (search) {
  const rows = [...document.querySelectorAll('.publication')];
  const filters = ['year', 'topic', 'type'].map(key => ({key, element: document.querySelector(`#pub-${key}`)}));
  const parameters = new URLSearchParams(location.search);
  for (const {key, element} of filters) {
    const values = [...new Set(rows.map(row => row.dataset[key]).filter(Boolean))];
    values.sort(key === 'year' ? (a, b) => b.localeCompare(a) : (a, b) => a.localeCompare(b));
    for (const value of values) {
      const option = document.createElement('option');
      option.value = option.textContent = value;
      element.append(option);
    }
    if (values.includes(parameters.get(key))) element.value = parameters.get(key);
  }
  const update = () => {
    const query = search.value.toLocaleLowerCase().trim();
    let count = 0;
    for (const row of rows) {
      const match = row.textContent.toLocaleLowerCase().includes(query) && filters.every(({key, element}) => !element.value || row.dataset[key] === element.value);
      row.hidden = !match;
      count += Number(match);
    }
    document.querySelector('#pub-count').textContent = `${count} publication ${count === 1 ? 'record' : 'records'} shown`;
    document.querySelector('#no-results').hidden = count !== 0;
  };
  search.addEventListener('input', update);
  filters.forEach(({element}) => element.addEventListener('change', update));
  document.querySelector('.filter-reset').addEventListener('click', () => {
    search.value = '';
    filters.forEach(({element}) => element.value = '');
    update();
    search.focus();
  });
  update();
}
