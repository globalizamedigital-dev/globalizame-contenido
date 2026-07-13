import fs from "node:fs";
import path from "node:path";

// Este módulo NO llama a ninguna API de imagen. Globalizame no paga tokens de API
// para generación de imagen (regla dura del ecosistema: 0€ en API, suscripción o free
// tier). Escribe los prompts que un agente con capacidad de imagen (Codex + GPT Image
// 2.0, vía suscripción) usará para generar los PNG reales fuera de este pipeline.

const PALETTE = "fondo blanco o gris casi blanco (#F7F7F5 / #FFFFFF), tinta negra (#090909), acento naranja #FF4B0B. Sin otros colores dominantes.";
const FORMAT = "1080x1350 px, relación 4:5, formato retrato para carrusel de Instagram.";
const REFERENCE_NOTE = "Referencia de estilo obligatoria: las imágenes en recursos/carrusel/ (adjuntar hasta 5 al generar). El contenido decide el visual; la referencia decide el estilo -- no copiar literalmente la escena de la referencia, sí su gramática visual (tipografía gruesa tipo display, tarjetas blancas con sombra suave, motivo técnico naranja, espacio negativo amplio).";

function slideKindLabel(slide) {
  if (slide.role === "hook") return "PORTADA (hook)";
  if (slide.role === "cta") return "CIERRE (CTA)";
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
  const numeric = text.match(/\d+([.,]\d+)?\s*(%|€)?/);
  if (numeric && numeric[0].trim() && /\d/.test(numeric[0])) return numeric[0].trim();
  if (slide.metric && slide.metric !== "ORDEN") return slide.metric;
  if (slide.role === "cta" && slide.action) return slide.action;
  if (slide.keyword) return slide.keyword;
  return null;
}

function composePrompt(slide, spec, index, total) {
  const lines = [];
  lines.push(`${slideKindLabel(slide)} -- slide ${index + 1}/${total} de "${spec.title}"`);
  lines.push("");
  lines.push(`FORMATO: ${FORMAT}`);
  lines.push(`PALETA: ${PALETTE}`);
  lines.push("");
  lines.push(`TITULAR (texto exacto a renderizar en la imagen): "${slide.headline}"`);
  if (slide.support) lines.push(`APOYO (texto exacto, más pequeño): "${slide.support}"`);
  if (slide.eyebrow) lines.push(`ETIQUETA SUPERIOR (chip pequeño, adaptativa -- nunca "DATO 01" fijo): "${slide.eyebrow}"`);
  lines.push("NO incluir ningún contador de slide (nada de \"1/6\", \"2/6\", números de página ni círculo con número) en ninguna esquina de la imagen.");
  const highlight = highlightFragment(slide);
  if (highlight) {
    lines.push(`RESALTADO DE MARCA (obligatorio, sin excepción): pinta en naranja #FF4B0B únicamente el fragmento "${highlight}" dentro del titular o del apoyo, tal y como aparece en el texto. El resto del texto va en tinta negra #090909. No resaltes ninguna otra palabra ni cifra, y no dejes el titular completo en un solo color.`);
  } else {
    lines.push("RESALTADO DE MARCA (obligatorio, sin excepción): esta slide no tiene una cifra o palabra clave que resaltar -- todo el titular y el apoyo van en tinta negra #090909, sin ningún fragmento en naranja.");
  }
  lines.push("");

  if (slide.role === "hook") {
    lines.push("COMPOSICIÓN (portada -- máxima fidelidad a la referencia):");
    lines.push("- Titular arriba a la izquierda, robot de marca expresivo a la derecha, objeto explicativo 3D abajo a la izquierda, consecuencia visual integrada. Una sola escena, no elementos sueltos.");
    if (slide.visualDirection) lines.push(`- Dirección de escena concreta: ${slide.visualDirection}`);
    lines.push("- El robot vive el conflicto del post (persigue, sufre, sostiene, transforma) -- nunca decoración pasiva al lado de otro visual.");
    lines.push("- Un solo visual principal. No acumular tarjetas + cifras + robot + monedas + explicaciones a la vez.");
    lines.push("- Debe cumplirse: disruptiva, relevante, comprensible en menos de 2 segundos.");
    const forbidden = slide.forbiddenElements || [];
    if (forbidden.length) lines.push(`- PROHIBIDO: ${forbidden.join(", ")}.`);
  } else if (slide.role === "cta") {
    lines.push("COMPOSICIÓN (cierre -- máximo 2 bloques de texto + 1 apoyo visual simple):");
    lines.push("- Es un cierre, no otra slide educativa. No repetir calculadoras, gráficos, listas ni objetos explicativos ya usados en slides anteriores de esta misma pieza.");
    if (slide.action) lines.push(`- Acción exacta a mostrar: "${slide.action}".`);
    if (slide.keyword) lines.push(`- Si el CTA es de palabra clave, mostrar literalmente "${slide.keyword}" en mayúsculas y qué recibe la persona.`);
  } else {
    lines.push(`COMPOSICIÓN (layout de referencia interna: ${slide.layout}):`);
    const layoutHints = {
      flow: "Diagrama de 3 pasos en línea horizontal con flechas naranjas conectando círculos/iconos simples.",
      gauge: "Velocímetro/medidor semicircular con aguja, valor destacado debajo en tipografía grande.",
      split: "Comparación de dos columnas (antes/después, sin sistema/con criterio) con marcas × y ✓.",
      checklist: "Lista de 3 tarjetas horizontales con círculo de check a la izquierda de cada una.",
    };
    if (layoutHints[slide.layout]) lines.push(`- ${layoutHints[slide.layout]}`);
    lines.push("- Un solo concepto visual claro que explique la idea en menos de 2 segundos. Tarjetas blancas con sombra suave sobre fondo claro.");
  }

  lines.push("");
  lines.push(REFERENCE_NOTE);
  lines.push("");
  lines.push("Arte final en PNG, sin marcas de agua, sin texto adicional no listado arriba, sin logotipos de terceros.");
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
  return payload;
}
