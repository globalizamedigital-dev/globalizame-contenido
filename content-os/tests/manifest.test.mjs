import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildManifest } from "../lib/manifest.mjs";

function setupPendingPiece(root, { pieceId, stage = "TOFU", slideCount = 2, status = "BLOCKED" }) {
  const runDir = path.join(root, "outputs", pieceId);
  fs.mkdirSync(runDir, { recursive: true });
  const spec = {
    id: pieceId,
    stage,
    slides: Array.from({ length: slideCount }, (_, i) => ({ number: i + 1, headline: `SLIDE ${i + 1}` })),
  };
  fs.writeFileSync(path.join(runDir, "spec.json"), JSON.stringify(spec));
  fs.writeFileSync(path.join(runDir, "copy-instagram.md"), "Copy de Instagram para esta pieza.\n");
  fs.writeFileSync(path.join(runDir, "copy-linkedin.md"), "Copy de LinkedIn para esta pieza.\n");
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
  return fs.mkdtempSync(path.join(os.tmpdir(), "content-os-manifest-"));
}

test("el manifest lista la pieza pendiente más antigua con slide_count y captions", () => {
  const root = tmpRoot();
  setupPendingPiece(root, { pieceId: "2026-07-20_pieza-b", slideCount: 2 });
  setupPendingPiece(root, { pieceId: "2026-07-15_pieza-a", slideCount: 3, stage: "MOFU" });

  const manifest = buildManifest(root);

  assert.equal(manifest.pending.id, "2026-07-15_pieza-a");
  assert.equal(manifest.pending.stage, "MOFU");
  assert.equal(manifest.pending.slide_count, 3);
  assert.equal(manifest.pending.slide_headlines.length, 3);
  assert.match(manifest.pending.caption_instagram, /Copy de Instagram/);
  assert.match(manifest.pending.caption_linkedin, /Copy de LinkedIn/);

  const manifestFile = path.join(root, "content-os/state/publish-manifest.json");
  assert.ok(fs.existsSync(manifestFile));
  const onDisk = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  assert.equal(onDisk.pending.id, "2026-07-15_pieza-a");
});

test("pending es null si no hay ninguna pieza esperando imagen", () => {
  const root = tmpRoot();
  setupPendingPiece(root, { pieceId: "2026-07-13_ya-aprobada", status: "APPROVED" });

  const manifest = buildManifest(root);

  assert.equal(manifest.pending, null);
});

test("pending es null si no existe ninguna ejecución previa", () => {
  const root = tmpRoot();

  const manifest = buildManifest(root);

  assert.equal(manifest.pending, null);
});
