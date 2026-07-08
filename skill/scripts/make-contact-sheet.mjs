import fs from "node:fs";
import path from "node:path";
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
console.log("Hoja de contacto creada");
