import test from "node:test";
import assert from "node:assert/strict";
import { buildSpec, resolveCta } from "../lib/spec.mjs";

const resources = { references: ["a.png", "b.png", "c.png"] };
const evidence = [{ claim: "Las tareas consumen hasta 10 días al mes", source: "Fuente interna", business: "Tiempo perdido" }];

test("TOFU evita CTA de venta y termina con conversación", () => {
  const post = { date:"2026-07-01", title:"Un coste que no ves", brief:"Dolor", stage:"TOFU", cta:"Calendly" };
  const spec = buildSpec(post, evidence, resources);
  assert.equal(spec.cta.type, "conversation");
  assert.equal(spec.slides.at(-1).role, "cta");
  assert.equal(spec.slides.at(-1).ctaType, "conversation");
  assert.ok(spec.slides.length >= 6);
});

test("MOFU con recurso lleva la palabra clave a la última slide", () => {
  const post = { date:"2026-07-10", title:"Calcula cuánto tiempo pierdes", brief:"Hoja de cálculo", stage:"MOFU", cta:"recurso" };
  const spec = buildSpec(post, evidence, resources);
  assert.equal(spec.cta.type, "resource");
  assert.equal(spec.cta.keyword, "CÁLCULO");
  assert.match(spec.slides.at(-1).headline, /COMENTA CÁLCULO/);
  assert.match(spec.slides.at(-1).support, /te envío/i);
  assert.equal(spec.slides.at(-1).layout, "cta-minimal");
  assert.equal(spec.slides.at(-1).visualConcept, "comment-bubble");
  assert.equal(spec.slides.at(-1).metric, undefined);
  assert.equal(spec.slides.at(-1).items, undefined);
  assert.ok(`${spec.slides.at(-1).headline} ${spec.slides.at(-1).support}`.split(/\s+/).length<=10);
});

test("BOFU convierte una petición incompatible en reserva", () => {
  const cta = resolveCta({ stage:"BOFU", cta:"recurso", title:"Decide", brief:"" });
  assert.equal(cta.type, "booking");
  assert.match(cta.headline, /MIRAMOS/);
});

test("la composición varía de forma determinista entre piezas", () => {
  const a = buildSpec({ date:"2026-07-08", title:"Primera pieza", brief:"", stage:"MOFU", cta:"autoridad" }, evidence, resources);
  const b = buildSpec({ date:"2026-07-13", title:"Segunda pieza", brief:"", stage:"MOFU", cta:"autoridad" }, evidence, resources);
  assert.ok(a.visual_system.flexible_composition);
  assert.notDeepEqual(a.slides.map(s=>s.layout), b.slides.map(s=>s.layout));
});

test("el CTA no reutiliza el concepto visual de una slide anterior", () => {
  const spec = buildSpec({ date:"2026-07-10", title:"Calcula cuánto tiempo pierdes", brief:"Hoja de cálculo", stage:"MOFU", cta:"recurso" }, evidence, resources);
  const closing = spec.slides.at(-1);
  assert.ok(!spec.slides.slice(0,-1).some(slide=>slide.visualConcept===closing.visualConcept));
  assert.ok(closing.avoidConcepts.includes("measurement-fields"));
});
