import fs from "node:fs";
import path from "node:path";
import { readSpec, renderSlide, promptFor } from "./carousel-lib.mjs";

const folder = path.resolve(process.argv[2] || "");
if (!fs.existsSync(path.join(folder, "slides.yaml"))) {
  console.error("Uso: node skill/scripts/build-carousel.mjs posts/post_fecha_slug");
  process.exit(1);
}

const spec = readSpec(folder);
const renders = path.join(folder, "renders");
fs.mkdirSync(renders, { recursive: true });

for (const slide of spec.slides) {
  fs.writeFileSync(path.join(renders, `slide-${String(slide.number).padStart(2, "0")}.svg`), renderSlide(slide));
}

const prompts = `# Prompts coordinados · ${spec.title}\n\n> Fuente de verdad: slides.yaml. No editar el texto visible en el generador.\n\n` +
  spec.slides.map(s => promptFor(s, spec.visual_bible)).join("\n\n---\n\n");
fs.writeFileSync(path.join(folder, "prompts-system.md"), prompts);

console.log(`Renderizadas ${spec.slides.length} slides en ${renders}`);
