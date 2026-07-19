import fs from "node:fs";
import path from "node:path";

// Contrato determinista entre el motor de contenido y el paso de publicación.
// No toca la red: solo lee outputs/ APPROVED y arma la cola. La skill
// `publicador` es quien consume publish-queue.json y llama al MCP de Metricool.

const QUEUE_FILE = "content-os/state/publish-queue.json";

export function buildQueue(root) {
  const stateFile = path.join(root, "content-os/state/state.json");
  if (!fs.existsSync(stateFile)) return { items: [] };
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const queueFile = path.join(root, QUEUE_FILE);
  const existing = fs.existsSync(queueFile) ? JSON.parse(fs.readFileSync(queueFile, "utf8")) : { items: [] };
  const byId = new Map(existing.items.map(item => [item.id, item]));

  for (const run of state.runs) {
    if (run.status !== "APPROVED") continue;
    const runDir = path.join(root, "outputs", run.id);
    const finalDir = path.join(runDir, "final");
    const pngs = fs.existsSync(finalDir) ? fs.readdirSync(finalDir).filter(f => /^slide-\d{2}\.png$/.test(f)).sort() : [];
    const previous = byId.get(run.id);
    byId.set(run.id, {
      id: run.id,
      date: run.date,
      stage: run.stage,
      status: previous?.status === "scheduled" ? "scheduled" : "pending",
      caption_instagram: fs.readFileSync(path.join(runDir, "copy-instagram.md"), "utf8").trim(),
      caption_linkedin: fs.readFileSync(path.join(runDir, "copy-linkedin.md"), "utf8").trim(),
      images: pngs.map(f => path.join(finalDir, f)),
      metricool_ids: previous?.metricool_ids || null,
      scheduled_at: previous?.scheduled_at || null,
    });
  }

  const items = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
  const payload = { generated_at: new Date().toISOString(), items };
  fs.mkdirSync(path.dirname(queueFile), { recursive: true });
  fs.writeFileSync(queueFile, JSON.stringify(payload, null, 2));
  return payload;
}

export function markScheduled(root, id, metricoolIds) {
  const queueFile = path.join(root, QUEUE_FILE);
  const queue = JSON.parse(fs.readFileSync(queueFile, "utf8"));
  const item = queue.items.find(i => i.id === id);
  if (!item) throw new Error(`${id} no está en la cola de publicación`);
  item.status = "scheduled";
  item.metricool_ids = metricoolIds;
  item.scheduled_at = new Date().toISOString();
  fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2));
  return item;
}
