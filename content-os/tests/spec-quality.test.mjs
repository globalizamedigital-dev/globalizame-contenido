import test from "node:test";
import assert from "node:assert/strict";
import { buildSpec } from "../lib/spec.mjs";

const EVIDENCE = [
  { id: "E1", claim: "Casi 8 de cada 10 empresas que no usan IA dicen que el motivo principal es la falta de conocimiento dentro de la propia empresa: no saben cómo, no es que no puedan pagarla.", source: "Banco de España", business: "Empresas que no adoptan IA" },
  { id: "E2", claim: "Esas 200 horas equivalen a unos 3.000€ al año por autónomo en tiempo dedicado solo a papeleo.", source: "ATA", business: "Autónomos" },
];
const RESOURCES = { references: ["a.png", "b.png", "c.png"] };
const post = (over = {}) => ({ date: "2026-07-15", format: "DATO IMPACTANTE", title: "Un título de prueba", sub: null, brief: "Un brief de prueba. Con contexto.", stage: "TOFU", cta: "guardar", ...over });

test("ninguna slide lleva puntos suspensivos ni texto colgante", () => {
  for (const stage of ["TOFU", "MOFU", "BOFU"]) {
    for (let day = 1; day <= 9; day++) {
      const spec = buildSpec(post({ stage, date: `2026-07-0${day}` }), EVIDENCE, RESOURCES);
      for (const slide of spec.slides) {
        assert.ok(!/…|\.\.\./.test(`${slide.headline} ${slide.support}`), `ellipsis en ${stage} slide ${slide.number}: ${slide.headline} / ${slide.support}`);
      }
    }
  }
});

test("el subtítulo autorado de la estrategia manda sobre el derivado", () => {
  const spec = buildSpec(post({ sub: "Subtítulo escrito a mano para la portada." }), EVIDENCE, RESOURCES);
  assert.equal(spec.slides[0].support, "Subtítulo escrito a mano para la portada.");
});

test("el cierre tiene escena de robot propia, no un icono suelto", () => {
  for (const cta of ["guardar", "conversar", "recurso", "diagnóstico"]) {
    const stage = cta === "diagnóstico" ? "BOFU" : cta === "recurso" ? "MOFU" : "TOFU";
    const spec = buildSpec(post({ cta, stage }), EVIDENCE, RESOURCES);
    const closing = spec.slides.at(-1);
    assert.equal(closing.role, "cta");
    assert.ok(closing.visualDirection?.includes("robot de marca"), `CTA ${cta} sin escena de robot`);
    assert.notEqual(closing.visualConcept, "comment-bubble");
  }
});

test("la narrativa interior varía entre piezas de la misma etapa", () => {
  const headlines = new Set();
  for (let day = 1; day <= 9; day++) {
    const spec = buildSpec(post({ date: `2026-07-0${day}`, title: `Título distinto ${day}` }), EVIDENCE, RESOURCES);
    headlines.add(spec.slides.find(s => s.role === "mechanism").headline);
  }
  assert.ok(headlines.size >= 2, `todas las piezas TOFU sacan el mismo titular interior: ${[...headlines]}`);
});
