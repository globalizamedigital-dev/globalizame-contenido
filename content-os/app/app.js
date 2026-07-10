const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

qsa(".nav").forEach((button) => button.addEventListener("click", () => {
  qsa(".nav,.view").forEach((element) => element.classList.remove("active"));
  button.classList.add("active");
  qs(`#${button.dataset.view}`).classList.add("active");
}));

qs("#run").addEventListener("click", async () => {
  const button = qs("#run");
  button.disabled = true;
  toast("Generando y validando la pieza…");
  try {
    const response = await fetch("/api/run", { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "La ejecución quedó bloqueada");
    toast("Pieza aprobada.");
    await load();
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
  }
});

async function load() {
  const response = await fetch("/api/state", { cache: "no-store" });
  const state = await response.json();
  const runs = [...state.runs].reverse();
  qs("#empty").hidden = runs.length > 0;
  qs("#counts").innerHTML = `<span class="count">${runs.filter((run) => run.status === "APPROVED").length} aprobadas</span><span class="count">${runs.filter((run) => run.status !== "APPROVED").length} bloqueadas</span>`;
  qs("#run-list").innerHTML = runs.map(renderRun).join("");
}

function renderRun(run) {
  const base = `/outputs/${encodeURIComponent(run.id)}`;
  const previews = [1, 2, 3, 4, 5].map((number) => `<img loading="lazy" src="${base}/final/slide-${String(number).padStart(2, "0")}.png" alt="Slide ${number}">`).join("");
  return `<article class="run-row"><div class="run-meta"><span class="badge ${run.status === "APPROVED" ? "" : "blocked"}">${run.status === "APPROVED" ? "Aprobada" : "Bloqueada"}</span><h3>${escapeHtml(run.title)}</h3><span class="date">${run.date} · ${escapeHtml(run.stage)} · CTA ${escapeHtml(run.cta)}</span></div><div class="preview">${previews}</div><div class="actions"><a href="${base}/contact-sheet-final.png" target="_blank">Abrir carrusel final</a><a href="${base}/qa.md" target="_blank">Ver QA</a><a href="${base}/copy-instagram.md" target="_blank">Ver copy</a></div></article>`;
}

function toast(text) {
  const element = qs("#toast");
  element.textContent = text;
  element.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => element.classList.remove("show"), 4200);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

load().catch((error) => toast(`No se pudo leer el estado: ${error.message}`));
