const $ = (selector) => document.querySelector(selector);
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const state = await fetch('./state.json').then((response) => response.json());
const runs = state.runs ?? [];
const latest = runs.at(-1);

$('#status').textContent = latest ? 'Sistema listo' : 'Sin publicaciones';
$('#status').className = 'status ok';
$('#count').textContent = String(runs.length);
$('#next').textContent = latest?.nextDate ?? state.nextDate ?? 'Pendiente';
$('#topic').textContent = latest?.topic ?? 'Sin pieza generada';
$('#stage').textContent = latest ? 'Publicado' : 'Pendiente';
$('#progress').style.width = latest ? '100%' : '0%';

const cards = runs.slice().reverse().map((run) => {
  const slides = (run.finalSlides ?? []).map((slide, index) =>
    `<a href="${slide}" target="_blank" rel="noreferrer"><img src="${slide}" alt="Slide ${index + 1} de ${esc(run.topic ?? 'carrusel')}" loading="lazy"></a>`
  ).join('');
  const links = [
    run.copy && `<a href="${run.copy}" target="_blank">Leer copy</a>`,
    run.qa && `<a href="${run.qa}" target="_blank">Ver QA</a>`,
    run.contactSheet && `<a href="${run.contactSheet}" target="_blank">Vista completa</a>`,
  ].filter(Boolean).join('');
  return `<article class="run-card"><div class="run-head"><div><span class="eyebrow">${esc(run.date ?? run.id)}</span><h3>${esc(run.topic ?? 'Carrusel')}</h3></div><span class="status ok">Aprobado</span></div><div class="slides">${slides}</div><div class="links">${links}</div></article>`;
});

$('#gallery').innerHTML = cards.join('') || '<p class="empty">Todavía no hay piezas publicadas.</p>';
$('#log').textContent = 'Panel público sincronizado con la última compilación del repositorio.';
