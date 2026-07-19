import fs from "node:fs";
import path from "node:path";
import { findOldestPendingPiece } from "./ingest.mjs";

// Contrato de lectura para n8n: expone en el repo, sin tocar red, qué pieza
// espera imagen ahora mismo y cuántas/qué copys necesita, para que un
// workflow remoto (que no ve el filesystem local) sepa qué validar contra
// los PNG que Mario suba a Drive. Se regenera en cada `content:run`.

const MANIFEST_FILE = "content-os/state/publish-manifest.json";

export function buildManifest(root) {
  const stateFile = path.join(root, "content-os/state/state.json");
  const manifestFile = path.join(root, MANIFEST_FILE);
  if (!fs.existsSync(stateFile)) {
    const empty = { generated_at: new Date().toISOString(), pending: null };
    fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
    fs.writeFileSync(manifestFile, JSON.stringify(empty, null, 2));
    return empty;
  }

  const piece = findOldestPendingPiece(root);
  let pending = null;
  if (piece) {
    const runDir = path.join(root, "outputs", piece.id);
    const spec = JSON.parse(fs.readFileSync(path.join(runDir, "spec.json"), "utf8"));
    pending = {
      id: piece.id,
      date: piece.date,
      stage: spec.stage,
      slide_count: spec.slides.length,
      caption_instagram: fs.readFileSync(path.join(runDir, "copy-instagram.md"), "utf8").trim(),
      caption_linkedin: fs.readFileSync(path.join(runDir, "copy-linkedin.md"), "utf8").trim(),
      slide_headlines: spec.slides.map(s => s.headline),
    };
  }

  const payload = { generated_at: new Date().toISOString(), pending };
  fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
  fs.writeFileSync(manifestFile, JSON.stringify(payload, null, 2));
  return payload;
}
