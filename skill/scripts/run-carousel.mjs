import { spawnSync } from "node:child_process";
import path from "node:path";

const folder = path.resolve(process.argv[2] || "");
const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const steps = ["build-carousel.mjs", "export-png.mjs", "make-contact-sheet.mjs", "validate-carousel.mjs"];

for (const step of steps) {
  const result = spawnSync(process.execPath, [path.join(root, step), folder], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status);
}
console.log("Carrusel completo: especificaciones, renders, prompts, hoja de contacto y QA.");
