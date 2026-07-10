import crypto from "node:crypto";

const CTA_MATRIX = {
  TOFU: new Set(["authority", "conversation", "save"]),
  MOFU: new Set(["authority", "conversation", "resource", "save"]),
  BOFU: new Set(["conversation", "booking", "authority"]),
};

export function resolveCta(post) {
  const stage = String(post.stage || "TOFU").toUpperCase();
  const raw = String(post.cta || "").toLowerCase();
  let type = raw.includes("recurso") ? "resource"
    : /bofu|calendly|reserva|consulta/.test(raw) ? "booking"
    : /conversaci|comentario|dm/.test(raw) ? "conversation"
    : /guardar|guardado/.test(raw) ? "save"
    : "authority";
  if (!CTA_MATRIX[stage]?.has(type)) type = stage === "BOFU" ? "booking" : stage === "MOFU" ? "authority" : "conversation";

  const keyword = type === "resource" ? inferKeyword(post) : null;
  const variants = {
    resource: { type, keyword, action: `Comenta ${keyword}`, headline: `COMENTA ${keyword}`, support: "Y te envío la hoja para calcularlo con tus números." },
    booking: { type, action: "Reserva una conversación", headline: "¿LO MIRAMOS CON TUS NÚMEROS?", support: "30 minutos para detectar qué se te está escapando." },
    conversation: { type, action: "Responde en comentarios", headline: "¿DÓNDE SE TE VA EL TIEMPO?", support: "Cuéntamelo en comentarios. Quiero leer casos concretos." },
    save: { type, action: "Guardar", headline: "GUÁRDALO PARA MEDIRLO", support: "Vuelve cuando tengas una semana de datos reales." },
    authority: { type, action: "Guardar", headline: "PRIMERO MIDE. LUEGO DECIDE.", support: "Guárdalo para revisar el proceso con calma." },
  };
  return { ...variants[type], requested: raw, stage };
}

export function buildSpec(post, evidence, resources) {
  const title = post.title.replace(/[“”"]/g, "");
  const cta = resolveCta(post);
  const seed = parseInt(crypto.createHash("sha256").update(`${post.date}:${title}`).digest("hex").slice(0, 8), 16);
  const variant = seed % 3;
  const slides = buildNarrative({ post, evidence, cta, variant });
  return {
    schema_version: 2,
    id: `${post.date}_${slugify(title).slice(0, 64)}`,
    date: post.date,
    title,
    stage: String(post.stage).toUpperCase(),
    cta,
    visual_system: { style: "globalizame-clean-tech", variant, flexible_composition: true },
    visual_reference: resources.references,
    evidence,
    slides,
    content_hash: crypto.createHash("sha256").update(JSON.stringify({ post, evidence, cta, variant })).digest("hex"),
  };
}

function buildNarrative({ post, evidence, cta, variant }) {
  const title = shortHeadline(post.title);
  const primary = evidence[0]?.claim || post.brief.split(".")[0];
  const source = evidence[0]?.source || "fuente verificada en sources.json";
  const metric = metricFrom(primary);
  const stage = String(post.stage).toUpperCase();
  const middle = stage === "TOFU"
    ? [
        slide("mechanism", pick(["flow", "split"], variant), "PARECE PEQUEÑO HASTA QUE LO SUMAS", "Los minutos sueltos terminan ocupando días."),
        slide("evidence", "gauge", shortEvidence(primary), "Una señal para medir el problema con tus propios datos.", { metric }),
        slide("consequence", pick(["split", "flow"], variant + 1), "EL COSTE NO LLEGA EN UNA FACTURA", "Aparece como retrasos, errores y trabajo importante que nunca empieza."),
        slide("recognition", "checklist", "MIRA DÓNDE SE REPITE", "Una semana basta para dejar de decidir por intuición.", { items: ["Tareas que vuelven", "Interrupciones constantes", "Oportunidades sin respuesta"] }),
      ]
    : stage === "MOFU"
      ? [
          slide("mechanism", pick(["flow", "split"], variant), "NO EMPIECES POR LA HERRAMIENTA", "Primero localiza la tarea que vuelve cada semana."),
          slide("evidence", "gauge", shortEvidence(primary), "Una señal para medir el problema con tus propios datos.", { metric }),
          slide("method", "checklist", "MÍDELO DURANTE SIETE DÍAS", "No necesitas montar un sistema complicado.", { items: ["Qué tarea se repite", "Cuánto tarda de verdad", "Qué error o retraso provoca"] }),
          slide("decision", pick(["split", "flow"], variant + 1), "NO TODO SE DEBE AUTOMATIZAR", "Ordena primero. Automatiza solo lo repetible y medible."),
        ]
      : [
          slide("objection", pick(["split", "flow"], variant), "SEGUIR IGUAL TAMBIÉN TIENE UN PRECIO", "Pon una cifra al problema antes de descartarlo."),
          slide("evidence", "gauge", shortEvidence(primary), "Una señal para medir el problema con tus propios datos.", { metric }),
          slide("decision", "checklist", "TRES COSAS QUE MIRARÍA PRIMERO", "Sin una auditoría interminable.", { items: ["Volumen real", "Coste mensual", "Casos que requieren persona"] }),
        ];

  const slides = [slide("hook", "cover", title, hookSupport(post, metric)), ...middle];
  if (stage === "BOFU" || (stage === "MOFU" && variant !== 2)) slides.push(slide("synthesis", "gauge", "LA HERRAMIENTA VIENE DESPUÉS", "La decisión empieza con tus propios números.", { metric: "ORDEN" }));
  slides.push(slide("cta", "closing", cta.headline, cta.support, { ctaType: cta.type, keyword: cta.keyword, action: cta.action }));
  return slides.map((item, index) => ({ ...item, number: index + 1, visualVariant: variant }));
}

export function buildCopies(spec, { resourceReady = false } = {}) {
  const cta = spec.cta.type === "resource"
    ? resourceReady ? `${spec.cta.action} y te envío el recurso.` : "El recurso todavía no está listo, así que esta pieza no puede publicarse."
    : spec.cta.type === "booking" ? "Si quieres revisarlo con tus números, reserva una conversación de 30 minutos."
    : spec.cta.type === "conversation" ? "¿Dónde se te va más tiempo? Cuéntamelo en comentarios."
    : "Guárdalo y vuelve cuando tengas una semana de datos.";
  return {
    instagram: `Hay tareas que parecen pequeñas porque llegan separadas.\n\nCuando las apuntas durante una semana, dejan de parecer pequeñas.\n\nEmpieza por medir qué se repite, cuánto tarda y qué ocurre cuando se retrasa. Después decide si necesitas ordenar el proceso, repartirlo mejor o automatizar una parte.\n\n${cta}`,
    linkedin: `El trabajo administrativo no suele llegar como un problema grande. Se reparte entre facturas, correos, datos copiados y comprobaciones.\n\nAntes de comprar una herramienta, mediría durante una semana qué tareas vuelven, cuánto tardan y qué errores provocan. Algunas necesitarán criterio humano. Otras solo necesitan un proceso más claro. Las repetitivas y predecibles son las candidatas a automatizar.\n\n${cta}`,
  };
}

function slide(role, layout, headline, support, extra = {}) { return { role, layout, headline, support, ...extra }; }
function pick(values, index) { return values[Math.abs(index) % values.length]; }
function inferKeyword(post) { return /llamad|coste|calcul|papeleo|tiempo|fuga/i.test(`${post.title} ${post.brief}`) ? "CÁLCULO" : "RECURSO"; }
function hookSupport(post, metric) { return String(post.stage).toUpperCase() === "TOFU" ? `La cifra que conviene mirar: ${metric}.` : "Antes de automatizar, descubre qué está consumiendo tu tiempo."; }
function metricFrom(value) { const match = String(value).match(/(?:\d+[\d.,]*\s*(?:%|€|euros?|h(?:oras?)?|días?))/iu); return match?.[0] || "MÍDELO"; }
function slugify(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function shortHeadline(value) { const first = String(value).split(/[.!?]/)[0].trim(); return (first.length <= 62 ? first : first.split(/\s+/).slice(0, 9).join(" ")).toUpperCase(); }
function shortEvidence(value) { const words = String(value).split(/\s+/); return (words.length > 11 ? words.slice(0, 11).join(" ") : value).toUpperCase(); }
