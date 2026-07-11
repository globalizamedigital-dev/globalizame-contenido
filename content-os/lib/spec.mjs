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
    resource: { type, keyword, action: `Comenta ${keyword}`, headline: `COMENTA ${keyword}`, support: "Te envío la hoja." },
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
    visual_system: { style: "globalizame-clean-tech", variant, flexible_composition: false, reference_fidelity: "strict", reference_composition: "carousel-cover-grammar" },
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

  const hook = buildHook(post, title, metric, variant);
  const slides = [hook, ...middle];
  if (stage === "BOFU" || (stage === "MOFU" && variant !== 2)) slides.push(slide("synthesis", "gauge", "LA HERRAMIENTA VIENE DESPUÉS", "La decisión empieza con tus propios números.", { metric: "ORDEN" }));
  const usedConcepts = slides.map(item => item.visualConcept);
  slides.push(slide("cta", "cta-minimal", cta.headline, cta.support, { ctaType: cta.type, keyword: cta.keyword, action: cta.action, visualConcept:"comment-bubble", primaryVisualCount:1, avoidConcepts:usedConcepts, maxTextBlocks:2 }));
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

function slide(role, layout, headline, support, extra = {}) { return { role, layout, headline, support, eyebrow:extra.eyebrow||eyebrowForRole(role), visualConcept:extra.visualConcept||conceptFor(role,layout), ...extra }; }
function eyebrowForRole(role){return ({mechanism:"QUÉ PASA",evidence:"DATO CLAVE",consequence:"EL COSTE",recognition:"DETECTA",method:"MÉTODO",decision:"DECISIÓN",objection:"OBJECIÓN",synthesis:"RESUMEN",cta:"TU TURNO"})[role]||"IDEA CLAVE"}
function buildHook(post,title,metric,variant){
  const eyebrow=adaptiveEyebrow(post),visual=disruptiveVisual(post,variant);
  return slide("hook","cover",title,hookSupport(post,metric),{eyebrow,eyebrowStrategy:"adaptive",visualMode:"single-scene",protagonist:"brand-robot",visualConcept:visual.concept,visualDirection:visual.direction,primaryVisualCount:1,referenceFidelity:"strict",compositionGrammar:"reference-cover",sceneStructure:{headline:"upper-left",robot:"expressive-right",explanatoryProp:"lower-left",consequence:"integrated-bottom",unified:true},forbiddenElements:["isolated object","giant centered concept","cinematic poster","multiple unrelated cards","infographic cover","decorative robot","different robot identity","different visual language"],hookAssessment:{disruptive:true,relevant:true,twoSecondClarity:true,rationale:visual.rationale}});
}
function adaptiveEyebrow(post){const format=String(post.format||"").toLowerCase(),title=String(post.title||"");if(/estadística|dato/.test(format))return "DATO CLAVE";if(/error/.test(format))return "ERROR COMÚN";if(/pregunta|provocación/.test(format)||/[¿?]/.test(title))return "PREGUNTA INCÓMODA";if(/cómo|funciona|método/.test(format))return "CÓMO FUNCIONA";if(/honestidad/.test(format))return "SIN HUMO";if(/invitación/.test(format))return "SIGUIENTE PASO";return String(post.stage).toUpperCase()==="BOFU"?"DECISIÓN":"MIRA ESTO"}
function disruptiveVisual(post,variant){const value=`${post.title} ${post.brief}`.toLowerCase();if(/papeleo|factura|administrativ/.test(value))return {concept:"robot-watching-paperwork-fall-into-time-drain",direction:"Replica la composición de la portada de referencia: robot de marca angustiado a la derecha; bandeja 3D blanca de papeleo acumulado abajo a la izquierda; hojas y fichas de tiempo caen desde la bandeja hacia un sumidero naranja. Todo forma una sola escena narrativa, no un objeto gigante aislado.",rationale:"El robot protagoniza el conflicto y la pérdida de tiempo se entiende al instante, conservando la composición de marca."};if(/llamad|teléfono/.test(value))return {concept:"robot-watching-missed-calls-fall-into-revenue-drain",direction:"Replica la composición de referencia: robot expresivo a la derecha, teléfono 3D inclinado abajo a la izquierda y oportunidades cayendo hacia una fuga integrada.",rationale:"La acción muestra la oportunidad que se pierde y mantiene la gramática visual de marca."};if(/vacaciones|agosto|te vas/.test(value))return {concept:"robot-pulled-back-from-holiday",direction:"Mantén la composición de referencia: robot expresivo a la derecha y una única escena inferior donde una llamada lo arrastra lejos del descanso.",rationale:"El conflicto entre descanso y dependencia se entiende sin cambiar el lenguaje visual."};if(/precio|caro|€|euros?/.test(value))return {concept:"robot-reducing-price-pressure",direction:"Mantén la composición de referencia: robot expresivo a la derecha y una única escena 3D inferior que convierte un precio sobredimensionado en una cifra manejable.",rationale:"La acción hace visible el cambio sin convertir la portada en una infografía."};if(/\bia\b|agente|robot/.test(value))return {concept:"robot-answering-while-owner-is-away",direction:"Mantén la composición de referencia: robot protagonista a la derecha y una única escena 3D inferior que muestra una llamada atendida mientras el dueño no está.",rationale:"Muestra continuidad de atención con una escena clara y coherente con la marca."};return {concept:`robot-confronting-business-problem-${variant}`,direction:"Conserva exactamente la gramática de la portada de referencia: titular arriba a la izquierda, robot expresivo a la derecha y una escena 3D explicativa integrada en la parte inferior.",rationale:"La sorpresa está en la situación del robot, no en cambiar el estilo del carrusel."}}
function conceptFor(role,layout){if(role==="method")return "measurement-fields";if(role==="evidence")return "metric-gauge";if(role==="synthesis")return "summary-metric";return `${role}-${layout}`}
function pick(values, index) { return values[Math.abs(index) % values.length]; }
function inferKeyword(post) { return /llamad|coste|calcul|papeleo|tiempo|fuga/i.test(`${post.title} ${post.brief}`) ? "CÁLCULO" : "RECURSO"; }
function hookSupport(post, metric) { return String(post.stage).toUpperCase() === "TOFU" ? `La cifra que conviene mirar: ${metric}.` : "Antes de automatizar, descubre qué está consumiendo tu tiempo."; }
function metricFrom(value) { const match = String(value).match(/(?:\d+[\d.,]*\s*(?:%|€|euros?|h(?:oras?)?|días?))/iu); return match?.[0] || "MÍDELO"; }
function slugify(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function shortHeadline(value) { const first = String(value).split(/[.!?]/)[0].trim(); return (first.length <= 62 ? first : first.split(/\s+/).slice(0, 9).join(" ")).toUpperCase(); }
function shortEvidence(value) { const words = String(value).split(/\s+/); return (words.length > 11 ? words.slice(0, 11).join(" ") : value).toUpperCase(); }
