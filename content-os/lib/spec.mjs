import crypto from "node:crypto";

const CTA_MATRIX = {
  TOFU: new Set(["authority", "conversation", "save"]),
  MOFU: new Set(["authority", "conversation", "resource", "save"]),
  BOFU: new Set(["conversation", "booking", "authority"]),
};

// Escena visual del cierre por tipo de CTA. Sin esto, el generador de imagen
// rellena el cierre con un icono gigante y la slide queda muerta: el robot de
// marca debe protagonizar también el cierre, ejecutando la acción que se pide.
const CTA_SCENES = {
  save: {
    concept: "robot-bookmarking-the-post",
    direction: "El robot de marca guarda esta pieza: sostiene una tarjeta 3D blanca (miniatura abstracta de este carrusel, sin texto legible) y la desliza dentro de un archivador blanco con pestaña-marcador naranja. Gesto satisfecho, guiño al lector. Debajo, un botón pill naranja con la acción exacta.",
  },
  authority: {
    concept: "robot-bookmarking-the-post",
    direction: "El robot de marca guarda esta pieza: sostiene una tarjeta 3D blanca (miniatura abstracta de este carrusel, sin texto legible) y la desliza dentro de un archivador blanco con pestaña-marcador naranja. Gesto satisfecho, guiño al lector. Debajo, un botón pill naranja con la acción exacta.",
  },
  conversation: {
    concept: "robot-opening-conversation",
    direction: "El robot de marca se dirige al lector con postura abierta y ofrece un bocadillo de diálogo 3D blanco con tres puntos naranjas de 'escribiendo…'. Invita a responder, no decora. Debajo, un botón pill naranja con la acción exacta.",
  },
  booking: {
    concept: "robot-holding-calendar-slot",
    direction: "El robot de marca señala un hueco resaltado en naranja dentro de un calendario 3D blanco; junto al hueco, un reloj pequeño marcando 30 minutos. Debajo, un botón pill naranja con la acción exacta.",
  },
  resource: {
    concept: "robot-handing-resource-sheet",
    direction: "El robot de marca entrega al lector una hoja/plantilla 3D blanca con cabecera naranja, inclinada hacia la cámara. Debajo, un botón pill naranja con la palabra clave exacta en mayúsculas.",
  },
};

export function resolveCta(post) {
  const stage = String(post.stage || "TOFU").toUpperCase();
  const raw = String(post.cta || "").toLowerCase();
  let type = raw.includes("recurso") ? "resource"
    : /bofu|calendly|reserva|consulta|diagn[oó]stico/.test(raw) ? "booking"
    : /conversa|comentario|dm/.test(raw) ? "conversation"
    : /guardar|guardado/.test(raw) ? "save"
    : "authority";
  if (!CTA_MATRIX[stage]?.has(type)) type = stage === "BOFU" ? "booking" : stage === "MOFU" ? "authority" : "conversation";

  const keyword = type === "resource" ? inferKeyword(post) : null;
  const variants = {
    resource: { type, keyword, action: `Comenta ${keyword}`, headline: `COMENTA ${keyword}`, support: "Te envío la hoja." },
    booking: { type, action: "Reserva una conversación", headline: "¿LO MIRAMOS CON TUS NÚMEROS?", support: "30 minutos. Sin compromiso." },
    conversation: { type, action: "Responde en comentarios", headline: "¿DÓNDE SE TE VA EL TIEMPO?", support: "Cuéntamelo en comentarios." },
    save: { type, action: "Guardar", headline: "GUÁRDALO PARA MEDIRLO", support: "Vuelve con una semana de datos reales." },
    authority: { type, action: "Guardar", headline: "PRIMERO MIDE. LUEGO DECIDE.", support: "Guárdalo y revísalo con calma." },
  };
  return { ...variants[type], requested: raw, stage };
}

export function buildSpec(post, evidence, resources) {
  const title = post.title.replace(/[“”"]/g, "");
  const cta = resolveCta(post);
  // Rotación determinista por día del año: floor(día/2) % 3 garantiza que dos
  // fechas de publicación consecutivas (separadas 2-3 días, L/X/V) nunca caen en
  // la misma variante narrativa. Un hash por título podía colisionar justo en
  // piezas seguidas, que es donde la repetición canta.
  const variant = Math.floor(dayOfYear(post.date) / 2) % 3;
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

// Pools de narrativa por etapa y variante. La variante (seed determinista por
// fecha+título) elige un juego distinto de titulares/apoyos para que dos piezas
// consecutivas de la misma etapa no salgan clónicas.
const TOFU_POOL = [
  {
    mechanism: ["PARECE PEQUEÑO HASTA QUE LO SUMAS", "Los minutos sueltos terminan ocupando días."],
    evidenceSupport: "Una señal para medir el problema con tus propios datos.",
    consequence: ["EL COSTE NO LLEGA EN UNA FACTURA", "Aparece como retrasos, errores y trabajo importante que nunca empieza."],
    recognition: ["MIRA DÓNDE SE REPITE", "Una semana basta para dejar de decidir por intuición.", ["Tareas que vuelven", "Interrupciones constantes", "Oportunidades sin respuesta"]],
  },
  {
    mechanism: ["NO ES UN DÍA MALO. ES CADA DÍA", "Lo que se repite ya no es casualidad: es un patrón."],
    evidenceSupport: "El dato existe. Falta compararlo con tu semana.",
    consequence: ["LO QUE NO SE VE TAMBIÉN SE PAGA", "Horas, clientes y foco que se van sin dejar recibo."],
    recognition: ["BUSCA EL PATRÓN EN TU SEMANA", "Sin apps. Una nota en el móvil vale.", ["Lo que solo haces tú", "Lo que espera tu visto bueno", "Lo que nadie apunta"]],
  },
  {
    mechanism: ["EL PROBLEMA NO GRITA. GOTEA", "Cada goteo pequeño acaba vaciando la semana."],
    evidenceSupport: "Pon esta cifra al lado de tu agenda real.",
    consequence: ["NADIE TE COBRA POR PERDER TIEMPO", "Por eso no lo apuntas. Y por eso sigue pasando."],
    recognition: ["SEÑALES DE QUE YA TE PASA", "Si marcas dos de tres, hay algo que ordenar.", ["Respondes lo mismo cada día", "Todo pasa por tu móvil", "El papeleo espera al finde"]],
  },
];

const MOFU_POOL = [
  {
    mechanism: ["NO EMPIECES POR LA HERRAMIENTA", "Primero localiza la tarea que vuelve cada semana."],
    evidenceSupport: "Una señal para medir el problema con tus propios datos.",
    method: ["MÍDELO DURANTE SIETE DÍAS", "No necesitas montar un sistema complicado.", ["Qué tarea se repite", "Cuánto tarda de verdad", "Qué error o retraso provoca"]],
    decision: ["NO TODO SE DEBE AUTOMATIZAR", "Ordena primero. Automatiza solo lo repetible y medible."],
  },
  {
    mechanism: ["EL ORDEN VA ANTES QUE EL ROBOT", "Automatizar el caos solo lo hace más rápido."],
    evidenceSupport: "El dato existe. Falta compararlo con tu semana.",
    method: ["EL MÉTODO CABE EN UNA NOTA", "Siete días apuntando. Nada más.", ["Apunta cada tarea repetida", "Suma el tiempo real", "Marca lo que puede funcionar solo"]],
    decision: ["AUTOMATIZA LO REPETIBLE", "Lo que necesita criterio se queda contigo."],
  },
  {
    mechanism: ["PRIMERO ENTIENDE. LUEGO AUTOMATIZA", "Sin proceso claro, la herramienta estorba."],
    evidenceSupport: "Pon esta cifra al lado de tu agenda real.",
    method: ["TRES PREGUNTAS ANTES DE AUTOMATIZAR", "Respóndelas con datos, no de memoria.", ["¿Se repite igual cada vez?", "¿Necesita juicio humano?", "¿Qué pasa si se retrasa?"]],
    decision: ["LA HERRAMIENTA ES LO ÚLTIMO", "Si el proceso no está claro, ningún robot lo arregla."],
  },
];

const BOFU_POOL = [
  {
    objection: ["SEGUIR IGUAL TAMBIÉN TIENE UN PRECIO", "Pon una cifra al problema antes de descartarlo."],
    evidenceSupport: "Una señal para medir el problema con tus propios datos.",
    decision: ["TRES COSAS QUE MIRARÍA PRIMERO", "Sin una auditoría interminable.", ["Volumen real", "Coste mensual", "Casos que requieren persona"]],
  },
  {
    objection: ["NO DECIDIR YA ES UNA DECISIÓN", "Y también se paga, aunque no llegue factura."],
    evidenceSupport: "El dato existe. Falta compararlo con tu semana.",
    decision: ["QUÉ MIRARÍA EN TU CASO", "Media hora da para esto.", ["Dónde pierdes tiempo", "Qué se puede ordenar ya", "Qué no toca automatizar"]],
  },
  {
    objection: ["EL RIESGO NO ES PROBAR. ES SEGUIR ASÍ", "Compara los dos costes antes de elegir."],
    evidenceSupport: "Pon esta cifra al lado de tu agenda real.",
    decision: ["ASÍ EMPIEZA UN DIAGNÓSTICO SERIO", "Datos concretos, sin humo.", ["Tu volumen real", "Tu coste al mes", "Lo que sigue en manos humanas"]],
  },
];

const SYNTHESIS_POOL = [
  ["LA HERRAMIENTA VIENE DESPUÉS", "La decisión empieza con tus propios números."],
  ["PRIMERO NÚMEROS. LUEGO DECISIÓN", "Con los datos delante, elegir es fácil."],
  ["EL ORDEN ES LA MITAD DEL TRABAJO", "La otra mitad ya se puede delegar."],
];

function buildNarrative({ post, evidence, cta, variant }) {
  const title = shortHeadline(post.title);
  const primary = evidence[0]?.claim || post.brief.split(".")[0];
  const metric = metricFrom(primary);
  const stage = String(post.stage).toUpperCase();

  let middle;
  if (stage === "TOFU") {
    const pool = TOFU_POOL[variant];
    middle = [
      slide("mechanism", pick(["flow", "split"], variant), pool.mechanism[0], pool.mechanism[1]),
      slide("evidence", "gauge", evidenceHeadline(primary), pool.evidenceSupport, { metric }),
      slide("consequence", pick(["split", "flow"], variant + 1), pool.consequence[0], pool.consequence[1]),
      slide("recognition", "checklist", pool.recognition[0], pool.recognition[1], { items: pool.recognition[2] }),
    ];
  } else if (stage === "MOFU") {
    const pool = MOFU_POOL[variant];
    middle = [
      slide("mechanism", pick(["flow", "split"], variant), pool.mechanism[0], pool.mechanism[1]),
      slide("evidence", "gauge", evidenceHeadline(primary), pool.evidenceSupport, { metric }),
      slide("method", "checklist", pool.method[0], pool.method[1], { items: pool.method[2] }),
      slide("decision", pick(["split", "flow"], variant + 1), pool.decision[0], pool.decision[1]),
    ];
  } else {
    const pool = BOFU_POOL[variant];
    middle = [
      slide("objection", pick(["split", "flow"], variant), pool.objection[0], pool.objection[1]),
      slide("evidence", "gauge", evidenceHeadline(primary), pool.evidenceSupport, { metric }),
      slide("decision", "checklist", pool.decision[0], pool.decision[1], { items: pool.decision[2] }),
    ];
  }

  const hook = buildHook(post, title, primary, variant);
  const slides = [hook, ...middle];
  if (stage === "BOFU" || (stage === "MOFU" && variant !== 2)) {
    const synth = SYNTHESIS_POOL[variant];
    slides.push(slide("synthesis", "gauge", synth[0], synth[1], { metric: "ORDEN" }));
  }
  const usedConcepts = slides.map(item => item.visualConcept);
  const scene = CTA_SCENES[cta.type] || CTA_SCENES.conversation;
  slides.push(slide("cta", "cta-minimal", cta.headline, cta.support, {
    ctaType: cta.type, keyword: cta.keyword, action: cta.action,
    visualConcept: scene.concept, visualDirection: scene.direction,
    primaryVisualCount: 1, avoidConcepts: usedConcepts, maxTextBlocks: 2,
  }));
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
function buildHook(post,title,primary,variant){
  const eyebrow=adaptiveEyebrow(post),visual=disruptiveVisual(post,variant);
  return slide("hook","cover",title,hookSupport(post,primary),{eyebrow,eyebrowStrategy:"adaptive",visualMode:"single-scene",protagonist:"brand-robot",visualConcept:visual.concept,visualDirection:visual.direction,primaryVisualCount:1,referenceFidelity:"strict",compositionGrammar:"reference-cover",sceneStructure:{headline:"upper-left",robot:"expressive-right",explanatoryProp:"lower-left",consequence:"integrated-bottom",unified:true},forbiddenElements:["isolated object","giant centered concept","cinematic poster","multiple unrelated cards","infographic cover","decorative robot","different robot identity","different visual language"],hookAssessment:{disruptive:true,relevant:true,twoSecondClarity:true,rationale:visual.rationale}});
}
function adaptiveEyebrow(post){const format=String(post.format||"").toLowerCase(),title=String(post.title||"");if(/estadística|dato/.test(format))return "DATO CLAVE";if(/error/.test(format))return "ERROR COMÚN";if(/pregunta|provocación/.test(format)||/[¿?]/.test(title))return "PREGUNTA INCÓMODA";if(/cómo|funciona|método/.test(format))return "CÓMO FUNCIONA";if(/honestidad/.test(format))return "SIN HUMO";if(/invitación/.test(format))return "SIGUIENTE PASO";return String(post.stage).toUpperCase()==="BOFU"?"DECISIÓN":"MIRA ESTO"}
function disruptiveVisual(post,variant){const value=`${post.title} ${post.brief}`.toLowerCase();if(/papeleo|factura|administrativ/.test(value))return {concept:"robot-watching-paperwork-fall-into-time-drain",direction:"Replica la composición de la portada de referencia: robot de marca angustiado a la derecha; bandeja 3D blanca de papeleo acumulado abajo a la izquierda; hojas y fichas de tiempo caen desde la bandeja hacia un sumidero naranja. Todo forma una sola escena narrativa, no un objeto gigante aislado.",rationale:"El robot protagoniza el conflicto y la pérdida de tiempo se entiende al instante, conservando la composición de marca."};if(/llamad|teléfono/.test(value))return {concept:"robot-watching-missed-calls-fall-into-revenue-drain",direction:"Replica la composición de referencia: robot expresivo a la derecha, teléfono 3D inclinado abajo a la izquierda y oportunidades cayendo hacia una fuga integrada.",rationale:"La acción muestra la oportunidad que se pierde y mantiene la gramática visual de marca."};if(/vacaciones|agosto|te vas/.test(value))return {concept:"robot-pulled-back-from-holiday",direction:"Mantén la composición de referencia: robot expresivo a la derecha y una única escena inferior donde una llamada lo arrastra lejos del descanso.",rationale:"El conflicto entre descanso y dependencia se entiende sin cambiar el lenguaje visual."};if(/precio|caro|€|euros?/.test(value))return {concept:"robot-reducing-price-pressure",direction:"Mantén la composición de referencia: robot expresivo a la derecha y una única escena 3D inferior que convierte un precio sobredimensionado en una cifra manejable.",rationale:"La acción hace visible el cambio sin convertir la portada en una infografía."};if(/\bia\b|agente|robot/.test(value))return {concept:"robot-answering-while-owner-is-away",direction:"Mantén la composición de referencia: robot protagonista a la derecha y una única escena 3D inferior que muestra una llamada atendida mientras el dueño no está.",rationale:"Muestra continuidad de atención con una escena clara y coherente con la marca."};return {concept:`robot-confronting-business-problem-${variant}`,direction:"Conserva exactamente la gramática de la portada de referencia: titular arriba a la izquierda, robot expresivo a la derecha y una escena 3D explicativa integrada en la parte inferior.",rationale:"La sorpresa está en la situación del robot, no en cambiar el estilo del carrusel."}}
function conceptFor(role,layout){if(role==="method")return "measurement-fields";if(role==="evidence")return "metric-gauge";if(role==="synthesis")return "summary-metric";return `${role}-${layout}`}
function pick(values, index) { return values[Math.abs(index) % values.length]; }
function inferKeyword(post) { return /llamad|coste|calcul|papeleo|tiempo|fuga/i.test(`${post.title} ${post.brief}`) ? "CÁLCULO" : "RECURSO"; }

// El subtítulo de portada: si la estrategia trae uno escrito a mano (campo .s),
// se usa tal cual. Solo si falta se deriva de la evidencia, recortando en un
// conector natural -- nunca con puntos suspensivos, que acaban impresos en el PNG.
function hookSupport(post, primary) {
  if (post.sub) return post.sub;
  if (String(post.stage).toUpperCase() === "TOFU") return cleanSentence(primary);
  return "Antes de automatizar, descubre qué está consumiendo tu tiempo.";
}

const CONNECTORS = new Set(["en", "pero", "aunque", "porque", "para", "y", "e", "o", "u", "mientras", "cuando", "si"]);
const TRAILING_STOPWORDS = new Set(["de", "del", "la", "las", "el", "los", "un", "una", "unos", "unas", "que", "y", "o", "u", "a", "al", "en", "con", "por", "para", "su", "sus", "se", "es", "son", "dice", "dicen", "como"]);

function trimAtConnector(words, max) {
  if (words.length <= max) return words;
  for (let i = Math.min(words.length, max + 1) - 1; i >= 5; i--) {
    if (CONNECTORS.has(words[i].toLowerCase())) return words.slice(0, i);
  }
  return words.slice(0, max);
}
function stripTrailingStopwords(words) {
  const out = [...words];
  while (out.length > 4 && TRAILING_STOPWORDS.has(out.at(-1).toLowerCase().replace(/[.,;:]+$/, ""))) out.pop();
  return out;
}
function cleanSentence(value) {
  const first = String(value).split(/(?<=[.!?:])\s+/)[0].trim().replace(/[:;,]+$/, "");
  let words = trimAtConnector(first.split(/\s+/), 14);
  words = stripTrailingStopwords(words);
  const text = words.join(" ").replace(/[:;,]+$/, "");
  return /[.!?]$/.test(text) ? text : `${text}.`;
}
// Titular de la slide de evidencia: intenta cortar justo después de la métrica
// (queda una frase completa con el dato al final); si el prefijo no da una frase
// razonable, recorta en conector. Nunca deja puntos suspensivos ni palabra colgante.
function evidenceHeadline(value) {
  // Los paréntesis aclaratorios alargan el titular sin aportar en una slide de dato.
  const str = String(value).replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();
  const metricMatch = str.match(/\d+\s+de\s+cada\s+\d+|\d+[\d.,]*\s*(?:%|€|euros?|h(?:oras?)?|días?)/iu);
  if (metricMatch) {
    let end = metricMatch.index + metricMatch[0].length;
    // Arrastra el cualificador temporal pegado a la métrica: "200 horas" sin su
    // "al año" cambia el significado del dato en la slide.
    for (;;) {
      const tail = str.slice(end).match(/^\s+(?:al\s+(?:año|mes|día)|a\s+la\s+semana|cada\s+(?:semana|año|día|mes)|por\s+(?:autónomo|empresa|persona|pyme))/iu);
      if (!tail) break;
      end += tail[0].length;
    }
    const prefix = str.slice(0, end).trim();
    const count = prefix.split(/\s+/).length;
    if (count >= 7 && count <= 14 && prefix.length <= 72) return prefix.toUpperCase();
  }
  let words = trimAtConnector(str.split(/\s+/), 11);
  words = stripTrailingStopwords(words);
  return words.join(" ").replace(/[:;,]+$/, "").toUpperCase().slice(0, 72).trim();
}
function metricFrom(value) {
  const str = String(value);
  const ratio = str.match(/\d+\s+de\s+cada\s+\d+/iu);
  if (ratio) return ratio[0].replace(/\s+de\s+cada\s+/iu, "/");
  const unit = str.match(/(?:\d+[\d.,]*\s*(?:%|€|euros?|h(?:oras?)?|días?))/iu);
  return unit?.[0] || "MÍDELO";
}
function dayOfYear(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}
function slugify(value) { return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
// El título completo cabe casi siempre; solo si excede el límite se recorta a la
// primera frase. Cortar siempre en el primer punto amputaba títulos de dos golpes
// ("Primero sistema. Luego herramienta" -> "PRIMERO SISTEMA").
function shortHeadline(value) {
  const full = String(value).trim();
  if (full.length <= 62) return full.toUpperCase();
  const first = full.split(/[.!?]/)[0].trim();
  return (first.length <= 62 ? first : first.split(/\s+/).slice(0, 9).join(" ")).toUpperCase();
}
