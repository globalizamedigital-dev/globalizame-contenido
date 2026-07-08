import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readSpec } from "./carousel-lib.mjs";

const folder = path.resolve(process.argv[2] || "");
const spec = readSpec(folder);
const exportsDir = path.join(folder, "exports");
fs.mkdirSync(exportsDir, { recursive: true });

const candidates = process.platform === "win32"
  ? [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
    ]
  : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
const browser = candidates.find(fs.existsSync);
if (!browser) {
  console.error("No se encontró Chrome/Chromium para exportar PNG. Los SVG siguen siendo válidos.");
  process.exit(1);
}

for (const slide of spec.slides) {
  const stem = `slide-${String(slide.number).padStart(2, "0")}`;
  const input = path.join(folder, "renders", `${stem}.svg`);
  const output = path.join(exportsDir, `${stem}.png`);
  const profile = path.join(os.tmpdir(), `globalizame-render-${process.pid}-${slide.number}`);
  const url = `file:///${input.replaceAll("\\", "/")}`;
  const result = spawnSync(browser, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--window-size=1080,1350", `--user-data-dir=${profile}`, `--screenshot=${output}`, url
  ], { stdio: "ignore" });
  if (result.status !== 0 || !fs.existsSync(output)) {
    console.error(`Falló la exportación PNG de ${stem}`);
    process.exit(1);
  }
}
console.log(`Exportados ${spec.slides.length} PNG listos para publicar`);
