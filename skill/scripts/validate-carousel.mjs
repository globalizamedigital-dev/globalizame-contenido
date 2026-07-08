import fs from "node:fs";
import path from "node:path";
import { readSpec } from "./carousel-lib.mjs";

const folder = path.resolve(process.argv[2] || "");
const repair = process.argv.includes("--repair");
const spec = readSpec(folder);
const allowed = new Set(["cover-split","scene-left","metric-stage","matrix-100","causal-flow","range-leak","clock-ring","closing-loop"]);
const failures = [];
const rows = [];

for (let i = 0; i < spec.slides.length; i++) {
  const s = spec.slides[i];
  const words = [
    ...s.exact_copy.headline.map(x => typeof x === "string" ? x : `${x.text}${x.accent || ""}`),
    s.exact_copy.support || ""
  ].join(" ").trim().split(/\s+/).filter(Boolean).length;
  const checks = {
    number: s.number === i + 1,
    layout: allowed.has(s.layout.template_id),
    no_consecutive_layout: i === 0 || s.layout.template_id !== spec.slides[i - 1].layout.template_id,
    words: words <= (s.role === "cover" ? 10 : 22),
    source: !s.data_visualization?.values?.length || Boolean(s.exact_copy.source),
    continuity: Boolean(s.continuity),
    render: fs.existsSync(path.join(folder, "renders", `slide-${String(s.number).padStart(2, "0")}.svg`))
  };
  const failed = Object.entries(checks).filter(([,ok]) => !ok).map(([k]) => k);
  if (failed.length) failures.push({ slide: s.number, failed });
  rows.push(`| ${s.number} | ${words} | ${s.layout.template_id} | ${failed.length ? `FALLA: ${failed.join(", ")}` : "PASS"} |`);
}

const binaryPass = failures.length === 0;
const scores = spec.qa_scores;
const scoreValues = Object.values(scores);
const average = scoreValues.reduce((a,b)=>a+b,0) / scoreValues.length;
const scorePass = average >= 4.3 && scores.cover_impact >= 4.5 && scores.closing_power >= 4.5;
const status = binaryPass && scorePass ? "APROBADO" : "REVISIÓN";

const report = `# QA · ${spec.title}

## Resultado

**${status}** · media visual ${average.toFixed(2)}/5

## Validación por slide

| Slide | Palabras | Layout | Estado |
|---:|---:|---|---|
${rows.join("\n")}

## Evaluación del conjunto

${Object.entries(scores).map(([k,v]) => `- ${k}: ${v}/5`).join("\n")}

## Fallos medibles

${failures.length ? failures.map(f => `- Slide ${f.slide}: ${f.failed.join(", ")}`).join("\n") : "- Ninguno."}

## Regeneración selectiva

${failures.length ? `Ejecutar con \`--repair\`. Solo se vuelven a renderizar las slides ${failures.map(f=>f.slide).join(", ")}.` : "No necesaria. El pipeline conserva todos los renders aprobados."}
`;
fs.writeFileSync(path.join(folder, "qa-report.md"), report);

if (repair && failures.length) {
  const { renderSlide } = await import("./carousel-lib.mjs");
  for (const f of failures) {
    const slide = spec.slides.find(s => s.number === f.slide);
    fs.writeFileSync(path.join(folder, "renders", `slide-${String(slide.number).padStart(2, "0")}.svg`), renderSlide(slide));
  }
  console.log(`Regeneradas solo las slides: ${failures.map(f=>f.slide).join(", ")}`);
}

console.log(`${status}: ${failures.length} fallos medibles; media ${average.toFixed(2)}/5`);
process.exit(binaryPass && scorePass ? 0 : 2);
