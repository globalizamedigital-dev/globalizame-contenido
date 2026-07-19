import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { ingestInbox, findOldestPendingPiece } from "../lib/ingest.mjs";

// Construye un PNG mínimo válido (IHDR/IDAT/IEND reales) para que readPngSize
// lo acepte sin depender de archivos de outputs/ reales.
function makePng(width, height) {
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(typeData) >>> 0);
    return Buffer.concat([len, typeData, crc]);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((width * 3 + 1) * height);
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function setupProject(root, { pieceId, slideCount, status = "BLOCKED" }) {
  const runDir = path.join(root, "outputs", pieceId);
  fs.mkdirSync(runDir, { recursive: true });
  const spec = { id: pieceId, slides: Array.from({ length: slideCount }, (_, i) => ({ number: i + 1, role: i === 0 ? "hook" : "mechanism" })) };
  fs.writeFileSync(path.join(runDir, "spec.json"), JSON.stringify(spec));
  const qa = { status, failures: status === "APPROVED" ? [] : [{ code: "GPT_IMAGE_2_ASSETS", detail: `0/${slideCount}` }, { code: "GPT_IMAGE_2_MANIFEST" }] };
  fs.writeFileSync(path.join(runDir, "qa.json"), JSON.stringify(qa));
  const stateFile = path.join(root, "content-os/state/state.json");
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  let state = { version: 1, runs: [] };
  if (fs.existsSync(stateFile)) state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  state.runs.push({ id: pieceId, date: pieceId.slice(0, 10), status });
  fs.writeFileSync(stateFile, JSON.stringify(state));
  return runDir;
}

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "content-os-ingest-"));
}

test("ingiere los PNG a la pieza pendiente más antigua y los renombra", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-20_pieza-b", slideCount: 2 });
  setupProject(root, { pieceId: "2026-07-15_pieza-a", slideCount: 2 });
  const inbox = path.join(root, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, "a.png"), makePng(1080, 1350));
  fs.writeFileSync(path.join(inbox, "b.png"), makePng(1080, 1350));

  const result = ingestInbox(root, inbox);

  assert.equal(result.status, "INGESTED");
  assert.equal(result.piece, "2026-07-15_pieza-a");
  assert.equal(result.count, 2);
  const finalDir = path.join(root, "outputs/2026-07-15_pieza-a/final");
  assert.deepEqual(fs.readdirSync(finalDir).sort(), ["slide-01.png", "slide-02.png"]);
  assert.equal(fs.readdirSync(inbox).length, 0);
  assert.ok(!fs.existsSync(path.join(root, "outputs/2026-07-20_pieza-b/final")));
});

test("no mueve nada si el número de PNG no coincide con las slides", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-15_pieza-a", slideCount: 3 });
  const inbox = path.join(root, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, "a.png"), makePng(1080, 1350));
  fs.writeFileSync(path.join(inbox, "b.png"), makePng(1080, 1350));

  const result = ingestInbox(root, inbox);

  assert.equal(result.status, "COUNT_MISMATCH");
  assert.equal(result.expected, 3);
  assert.equal(result.found, 2);
  assert.equal(fs.readdirSync(inbox).length, 2);
  assert.ok(!fs.existsSync(path.join(root, "outputs/2026-07-15_pieza-a/final")));
});

test("no mueve nada si algún PNG no mide 1080x1350", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-15_pieza-a", slideCount: 2 });
  const inbox = path.join(root, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, "a.png"), makePng(1080, 1350));
  fs.writeFileSync(path.join(inbox, "b.png"), makePng(1080, 1080));

  const result = ingestInbox(root, inbox);

  assert.equal(result.status, "DIMENSION_MISMATCH");
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].size, /1080x1080/);
  assert.equal(fs.readdirSync(inbox).length, 2);
});

test("ignora piezas ya aprobadas al buscar la pendiente más antigua", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-13_ya-aprobada", slideCount: 2, status: "APPROVED" });
  setupProject(root, { pieceId: "2026-07-15_pendiente", slideCount: 2 });

  const piece = findOldestPendingPiece(root);
  assert.equal(piece.id, "2026-07-15_pendiente");
});

test("informa EMPTY si inbox/ no existe o está vacía", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-15_pieza-a", slideCount: 2 });
  const result = ingestInbox(root, path.join(root, "inbox"));
  assert.equal(result.status, "EMPTY");
});

test("informa NO_PENDING_PIECE si no hay ninguna pieza esperando imagen", () => {
  const root = tmpRoot();
  setupProject(root, { pieceId: "2026-07-13_ya-aprobada", slideCount: 2, status: "APPROVED" });
  const inbox = path.join(root, "inbox");
  fs.mkdirSync(inbox, { recursive: true });
  fs.writeFileSync(path.join(inbox, "a.png"), makePng(1080, 1350));

  const result = ingestInbox(root, inbox);
  assert.equal(result.status, "NO_PENDING_PIECE");
});
