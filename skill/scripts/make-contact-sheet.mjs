import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readSpec } from "./carousel-lib.mjs";

const folder = path.resolve(process.argv[2] || "");
const spec = readSpec(folder);
const thumbW = 270, thumbH = 337.5, gap = 26, cols = 4;
const rows = Math.ceil(spec.slides.length / cols);
const width = cols * thumbW + (cols + 1) * gap;
const height = rows * thumbH + (rows + 1) * gap + 90;
const images = spec.slides.map((s, i) => {
  const x = gap + (i % cols) * (thumbW + gap);
  const y = 90 + gap + Math.floor(i / cols) * (thumbH + gap);
  return `<image href="renders/slide-${String(s.number).padStart(2, "0")}.svg" x="${x}" y="${y}" width="${thumbW}" height="${thumbH}"/>`;
}).join("\n");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#111"/>
<text x="${gap}" y="55" fill="#F5F5F2" font-family="Arial" font-size="30" font-weight="700">${spec.title}</text>
${images}</svg>`;
fs.writeFileSync(path.join(folder, "contact-sheet.svg"), svg);

const candidates = process.platform === "win32"
  ? [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
    ]
  : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
const browser = candidates.find(fs.existsSync);
if (browser) {
  const input = path.join(folder, "contact-sheet.svg");
  const output = path.join(folder, "contact-sheet.png");
  const profile = path.join(os.tmpdir(), `globalizame-contact-sheet-${process.pid}`);
  const url = `file:///${input.replaceAll("\\", "/")}`;
  const result = spawnSync(browser, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    `--window-size=${width},${height}`, `--user-data-dir=${profile}`, `--screenshot=${output}`, url
  ], { stdio: "ignore" });
  if (result.status !== 0 || !fs.existsSync(output)) {
    console.warn("Hoja SVG creada, pero no se pudo exportar contact-sheet.png");
  }
}

console.log("Hoja de contacto SVG/PNG creada");
