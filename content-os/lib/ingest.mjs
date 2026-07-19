import fs from "node:fs";
import path from "node:path";
import { readPngSize } from "./qa.mjs";

// Toma los PNG que Mario suelta en inbox/ tras generarlos con GPT Images 2.0 y
// los asigna a la pieza pendiente más antigua (WAITING_ON_IMAGE_GENERATION),
// renombrados a outputs/<id>/final/slide-NN.png. Es la única acción manual que
// debe quedar en el pipeline: soltar archivos en una carpeta.

export function findOldestPendingPiece(root) {
  const stateFile = path.join(root, "content-os/state/state.json");
  if (!fs.existsSync(stateFile)) return null;
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  const pending = state.runs
    .filter(run => run.status !== "APPROVED")
    .map(run => {
      const qaFile = path.join(root, "outputs", run.id, "qa.json");
      if (!fs.existsSync(qaFile)) return null;
      const qa = JSON.parse(fs.readFileSync(qaFile, "utf8"));
      const waitingOnImage = qa.failures?.some(f => ["GPT_IMAGE_2_ASSETS", "GPT_IMAGE_2_MANIFEST"].includes(f.code));
      if (!waitingOnImage) return null;
      return { id: run.id, date: run.date };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
  return pending[0] || null;
}

export function ingestInbox(root, inboxDir = path.join(root, "inbox")) {
  if (!fs.existsSync(inboxDir)) {
    return { status: "EMPTY", message: `No existe ${path.relative(root, inboxDir)}/. Crea la carpeta y suelta los PNG generados ahí.` };
  }
  const files = fs.readdirSync(inboxDir).filter(f => /\.png$/i.test(f)).sort();
  if (files.length === 0) {
    return { status: "EMPTY", message: `${path.relative(root, inboxDir)}/ no tiene PNG que ingerir.` };
  }

  const piece = findOldestPendingPiece(root);
  if (!piece) {
    return { status: "NO_PENDING_PIECE", message: "No hay ninguna pieza esperando imágenes (WAITING_ON_IMAGE_GENERATION). Genera una pieza con content:run primero." };
  }

  const runDir = path.join(root, "outputs", piece.id);
  const spec = JSON.parse(fs.readFileSync(path.join(runDir, "spec.json"), "utf8"));
  const expected = spec.slides.length;

  if (files.length !== expected) {
    return {
      status: "COUNT_MISMATCH",
      piece: piece.id,
      message: `${piece.id} necesita ${expected} slides pero inbox/ tiene ${files.length} PNG. No se mueve nada hasta que coincidan.`,
      expected,
      found: files.length,
    };
  }

  const dimensionErrors = [];
  for (const file of files) {
    const size = readPngSize(path.join(inboxDir, file));
    if (!size || size.width !== 1080 || size.height !== 1350) {
      dimensionErrors.push({ file, size: size ? `${size.width}x${size.height}` : "no es un PNG válido" });
    }
  }
  if (dimensionErrors.length) {
    return {
      status: "DIMENSION_MISMATCH",
      piece: piece.id,
      message: `Algunos PNG de inbox/ no miden 1080x1350. No se mueve nada hasta que se regeneren.`,
      errors: dimensionErrors,
    };
  }

  const finalDir = path.join(runDir, "final");
  fs.mkdirSync(finalDir, { recursive: true });
  files.forEach((file, index) => {
    const destName = `slide-${String(index + 1).padStart(2, "0")}.png`;
    fs.renameSync(path.join(inboxDir, file), path.join(finalDir, destName));
  });

  return {
    status: "INGESTED",
    piece: piece.id,
    count: files.length,
    message: `${files.length} PNG asignados a ${piece.id}/final/. Siguiente paso: reseña visual + content:validate.`,
  };
}
