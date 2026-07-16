import fs from "node:fs";
import path from "node:path";

// Este módulo NO llama a ninguna API de imagen. Globalizame no paga tokens de API
// para generación de imagen (regla dura del ecosistema: 0€ en API, suscripción o free
// tier). Escribe los prompts que un agente con capacidad de imagen (Codex + GPT Image
// 2.0, vía suscripción) usará para generar los PNG reales fuera de este pipeline.

const PALETTE = "fondo blanco o gris casi blanco (#F7F7F5 / #FFFFFF), tinta negra (#090909), acento naranja #FF4B0B. Sin otros colores dominantes.";
const FORMAT = "1080x1350 px, relación 4:5, formato retrato para carrusel de Instagram.";

// Sistema de render: la calidad profesional sale de fijar material, luz y cámara,
// no de dejar que el generador improvise en cada slide.
const RENDER_STYLE = [
  "ESTILO DE RENDER:",
  "- Objetos y personajes en 3D tipo producto premium: plástico blanco brillante con reflejos suaves, detalles en naranja #FF4B0B, juntas oscuras visibles en el robot.",
  "- Iluminación de estudio suave y envolvente (softbox), sombras de contacto difusas bajo cada objeto, sin sombras duras ni luz dramática.",
  "- Cámara a la altura del objeto con ligera perspectiva; profundidad de campo sutil que mantiene el texto perfectamente nítido.",
  "- Los objetos 3D proyectan sombra sobre el fondo claro para asentarse en la escena; nada flota sin sombra.",
].join("\n");

// Mobiliario de marca: los elementos fijos que hacen reconocible cada slide.
// Se especifican explícitamente porque, si no, el generador los pone a veces sí
// y a veces no, y el carrusel pierde consistencia.
const BRAND_FURNITURE = [
  "MOBILIARIO DE MARCA:",
  "- Arriba a la izquierda: tres guiones naranjas cortos en diagonal y, debajo, el chip de etiqueta (borde fino naranja, esquinas redondeadas, texto naranja en mayúsculas con tracking amplio).",
  "- Arriba, hacia el centro-derecha: una línea técnica naranja fina con un punto al final (motivo de circuito).",
  "- Arriba a la derecha: el asterisco/spark de marca en naranja.",
  "- Retícula de puntos grises muy sutil en una o dos esquinas.",
  "- Abajo a la derecha: botón pill con borde naranja y flecha naranja a la derecha (indica que hay más slides). En la ÚLTIMA slide (CTA) este botón NO aparece.",
  "- NO incluir ningún contador de slide (nada de \"1/6\", \"2/6\", números de página ni círculo con número) en ninguna esquina.",
].join("\n");

const TYPOGRAPHY = [
  "TIPOGRAFÍA:",
  "- Titular: sans display muy pesada, condensada, en MAYÚSCULAS, negro #090909, interlineado apretado, alineada a la izquierda, ocupando 2-4 líneas arriba.",
  "- Apoyo: sans humanista regular, negro, tamaño claramente menor, máximo 2 líneas, debajo del titular.",
  "- El texto siempre por encima de la escena 3D, nunca superpuesto a objetos que lo tapen.",
].join("\n");

// El flujo real de Mario siempre adjunta el carrusel de recursos/carrusel/ al pegar
// el prompt en GPT Images 2.0, y GPT Images 2.0 puede devolver varias slides en una
// sola imagen si no se le prohíbe explícitamente -- así que ambas cosas van fijas
// en el prompt, no como nota opcional.
const REFERENCE_NOTE = [
  "REFERENCIA ADJUNTA: se adjuntan imágenes del carrusel de ejemplo de recursos/carrusel/ junto a este prompt. Sigue su estilo exacto (tipografía, materiales 3D, iluminación, mobiliario de marca) para esta slide.",
  "GENERACIÓN: esta es UNA slide independiente. Genera una única imagen para ESTA slide, no un collage ni una cuadrícula con varias slides juntas, aunque el carrusel de referencia muestre varias a la vez.",
].join("\n");

function slideKindLabel(slide) {
  if (slide.role === "hook") return "PORTADA";
  if (slide.role === "cta") return "CIERRE";
  return "SLIDE INTERIOR";
}

// Decide de forma determinista qué fragmento del texto se pinta en naranja de marca.
// Sin esta instrucción explícita, el generador de imagen improvisa el resaltado
// (a veces la cifra, a veces una palabra suelta, a veces nada), y el resultado es
// inconsistente entre slides de la misma pieza.
function highlightFragment(slide) {
  const text = `${slide.headline || ""} ${slide.support || ""}`;
  const ratio = text.match(/\d+\s+de\s+cada\s+\d+/iu);
  if (ratio) return ratio[0];
  // La métrica de la slide manda sobre el primer número suelto ("200 horas" > "200"),
  // extraída con la grafía exacta con la que aparece en el texto.
  if (slide.metric && slide.metric !== "ORDEN") {
    const escaped = String(slide.metric).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const inText = text.match(new RegExp(escaped, "iu"));
    if (inText) return inText[0];
  }
  const numeric = text.match(/\d+([.,]\d+)?\s*(%|€)?/);
  if (numeric && numeric[0].trim() && /\d/.test(numeric[0])) return numeric[0].trim();
  if (slide.metric && slide.metric !== "ORDEN") return slide.metric;
  if (slide.role === "cta" && slide.action) return slide.action;
  if (slide.keyword) return slide.keyword;
  return null;
}

// Escenas detalladas por layout interior. Cada tarjeta lleva un objeto 3D real
// (no un icono plano) y una palabra de etiqueta, para que la slide explique la
// idea sola en menos de dos segundos.
const LAYOUT_SCENES = {
  flow: [
    "- Tres tarjetas blancas redondeadas en fila horizontal, cada una con un objeto 3D físico dentro (no iconos planos: un reloj de mesa, una pila de papeles, un calendario de sobremesa, un teléfono... el que mejor cuente cada paso) y una palabra corta de etiqueta debajo del objeto, en negro.",
    "- Flechas naranjas 3D con volumen conectando las tarjetas de izquierda a derecha.",
    "- La secuencia debe leerse como causa -> acumulación -> consecuencia sin leer el titular.",
  ],
  gauge: [
    "- Un medidor semicircular 3D grande y protagonista: carcasa blanca con volumen, tramo final del arco en naranja, aguja naranja gruesa apuntando a la zona alta.",
    "- Encajada en la base del medidor, una tarjeta blanca con la cifra clave en tipografía enorme y negra, y una unidad o comparación pequeña debajo.",
    "- El medidor descansa sobre el suelo con sombra suave; puede asomar el robot de marca por un lateral mirando la cifra con expresión preocupada, pequeño, sin robar protagonismo.",
  ],
  split: [
    "- Dos columnas 3D claramente separadas: la izquierda con marca × naranja y una mini-escena del problema (objetos desordenados, papeles cayendo); la derecha con marca ✓ naranja y la misma escena en orden.",
    "- Ambas columnas sobre tarjetas blancas con sombra; misma escala, mismo ángulo de cámara, para que el contraste sea inmediato.",
  ],
  checklist: [
    "- Tres tarjetas-fila blancas apiladas en vertical con sombra suave, cada una con un check circular naranja 3D con volumen a la izquierda y el texto del ítem en negro.",
    "- Las tarjetas tienen profundidad real (grosor visible) y una ligera separación entre sí; ninguna decoración extra dentro.",
  ],
};

function composePrompt(slide, spec, index, total) {
  const lines = [];
  lines.push(`${slideKindLabel(slide)} del carrusel "${spec.title}".`);
  lines.push("");
  lines.push(`FORMATO: ${FORMAT}`);
  lines.push(`PALETA: ${PALETTE}`);
  lines.push("");
  lines.push(RENDER_STYLE);
  lines.push("");
  lines.push(BRAND_FURNITURE);
  lines.push("");
  lines.push(TYPOGRAPHY);
  lines.push("");
  lines.push(`TITULAR: "${slide.headline}"`);
  if (slide.support) lines.push(`APOYO (texto más pequeño, debajo del titular): "${slide.support}"`);
  if (slide.eyebrow) lines.push(`ETIQUETA SUPERIOR del chip: "${slide.eyebrow}"`);
  const highlight = highlightFragment(slide);
  const highlightInText = highlight && `${slide.headline || ""} ${slide.support || ""}`.toLowerCase().includes(String(highlight).toLowerCase());
  if (highlightInText) {
    lines.push(`RESALTADO DE MARCA: pinta en naranja #FF4B0B únicamente el fragmento "${highlight}" dentro del titular o del apoyo, tal y como aparece en el texto. El resto del texto va en tinta negra #090909. No resaltes ninguna otra palabra ni cifra, y no dejes el titular completo en un solo color.`);
  } else {
    lines.push("RESALTADO DE MARCA: el titular y el apoyo van completos en tinta negra #090909, sin ningún fragmento en naranja. El naranja de esta slide vive en la escena 3D y el mobiliario de marca, no en el texto.");
  }
  lines.push("");

  if (slide.role === "hook") {
    lines.push("COMPOSICIÓN DE PORTADA:");
    lines.push("- Titular arriba a la izquierda, robot de marca expresivo a la derecha, objeto explicativo 3D abajo a la izquierda, consecuencia visual integrada. Una sola escena, no elementos sueltos.");
    if (slide.visualDirection) lines.push(`- ${slide.visualDirection}`);
    lines.push("- El robot vive el conflicto del post (persigue, sufre, sostiene, transforma) -- nunca decoración pasiva al lado de otro visual.");
    lines.push("- Un solo visual principal. No acumular tarjetas + cifras + robot + monedas + explicaciones a la vez.");
    lines.push("- La portada debe ser disruptiva, relevante y comprensible en menos de 2 segundos.");
    const forbidden = slide.forbiddenElements || [];
    if (forbidden.length) lines.push(`- No incluir: ${forbidden.join(", ")}.`);
  } else if (slide.role === "cta") {
    lines.push("COMPOSICIÓN DE CIERRE:");
    if (slide.visualDirection) lines.push(`- ${slide.visualDirection}`);
    lines.push("- El robot de marca aparece ENTERO, expresivo, ejecutando o invitando a la acción del CTA. No uses un icono gigante sin robot: queda plano y muerto.");
    lines.push("- Máximo 2 bloques de texto (titular + apoyo). La acción va dentro de la escena como botón pill naranja 3D, no como tercer bloque de texto suelto.");
    lines.push("- No repitas calculadoras, medidores, listas ni objetos explicativos ya usados en slides anteriores de esta misma pieza.");
    if (slide.action) lines.push(`- Texto exacto del botón pill: "${slide.action}".`);
    if (slide.keyword) lines.push(`- Muestra literalmente "${slide.keyword}" en mayúsculas y qué recibe la persona.`);
    lines.push("- En esta slide NO aparece el botón de flecha de abajo a la derecha.");
  } else {
    lines.push("COMPOSICIÓN:");
    for (const line of LAYOUT_SCENES[slide.layout] || []) lines.push(line);
    if (slide.items?.length) lines.push(`- Textos exactos de los ítems, uno por tarjeta y en este orden: ${slide.items.map(i => `"${i}"`).join(", ")}.`);
    if (slide.metric && slide.layout === "gauge") lines.push(`- Cifra exacta a mostrar en grande dentro de la tarjeta del medidor: "${slide.metric}".`);
    lines.push("- Un solo concepto visual que explique la idea en menos de 2 segundos. Espacio negativo generoso alrededor de la escena.");
  }

  lines.push("");
  lines.push(REFERENCE_NOTE);
  lines.push("");
  lines.push("Arte final en PNG, sin marcas de agua, sin texto adicional no listado arriba, sin logotipos de terceros, sin puntos suspensivos añadidos al texto.");
  return lines.join("\n");
}

export function buildImagegenPrompts(runDir, spec) {
  const total = spec.slides.length;
  const prompts = spec.slides.map((slide, index) => ({
    slide: slide.number,
    role: slide.role,
    layout: slide.layout,
    filename: `slide-${String(slide.number).padStart(2, "0")}.png`,
    prompt: composePrompt(slide, spec, index, total),
  }));
  const payload = {
    piece_id: spec.id,
    title: spec.title,
    format: "1080x1350",
    generator: "GPT Image 2.0 (via suscripción del usuario -- Codex u otro agente con capacidad de imagen, nunca API de pago)",
    reference_dir: "recursos/carrusel/",
    output_dir: "final/",
    note: "Este archivo NO fue generado por una llamada a API de imagen. Contiene prompts de texto para que un agente con capacidad de generación (ej. Codex + GPT Image 2.0) produzca los PNG reales y los coloque en outputs/<id>/final/. Después de generar, ese agente debe escribir imagegen.json con las reseñas visuales (hook_visual_review, labels_visual_review, cta_visual_review) que exige content-os/lib/qa.mjs.",
    prompts,
  };
  fs.writeFileSync(path.join(runDir, "imagegen-prompts.json"), JSON.stringify(payload, null, 2));
  fs.writeFileSync(path.join(runDir, "imagegen-prompts.md"), toMarkdown(payload));
  return payload;
}

// Versión copy-paste para el flujo manual: Mario pega cada bloque tal cual en
// GPT Images 2.0. El JSON queda como contrato máquina; este .md es el de uso.
function toMarkdown(payload) {
  const parts = [
    `# Prompts de imagen · ${payload.title}`,
    "",
    "Uno por slide. Copia el bloque completo (entre las líneas ```) y pégalo en GPT Images 2.0 junto con el carrusel de ejemplo de `recursos/carrusel/` como adjunto.",
    `Los PNG van a \`outputs/${payload.piece_id}/final/\` con el nombre indicado.`,
    "",
  ];
  for (const item of payload.prompts) {
    parts.push(`## Slide ${item.slide} · ${item.role} → \`final/${item.filename}\``, "", "```", item.prompt, "```", "");
  }
  return parts.join("\n");
}
