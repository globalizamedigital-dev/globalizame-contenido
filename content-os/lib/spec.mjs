import crypto from "node:crypto";

export function buildSpec(post, evidence, resources) {
  const title = post.title.replace(/[“”"]/g, "");
  const evidenceLine = evidence[0]?.claim || post.brief.split(".")[0];
  const source = evidence[0]?.source || "recursos/base del mes";
  const slides = [
    { number:1, role:"hook", layout:"cover", headline:shortHeadline(title), support:"Ponle una cifra antes de normalizarlo." },
    { number:2, role:"mechanism", layout:"flow", headline:"EL COSTE NO AVISA. SE ACUMULA.", support:"Cada tarea manual compite con el trabajo que sí mueve el negocio." },
    { number:3, role:"evidence", layout:"gauge", headline:shortEvidence(evidenceLine), support:`Referencia externa: ${source}`, metric:metricFrom(evidenceLine) },
    { number:4, role:"contrast", layout:"split", headline:"NO ES TRABAJAR MÁS. ES QUITAR FRICCIÓN.", support:"Separa lo repetible de lo que necesita tu criterio." },
    { number:5, role:"method", layout:"checklist", headline:"EMPIEZA POR LO QUE PUEDES MEDIR.", support:"Tres comprobaciones antes de automatizar.", items:["Horas repetidas cada semana","Coste o ingreso que se escapa","Regla clara para decidir"] },
    { number:6, role:"synthesis", layout:"gauge", headline:"LA IA NO ES EL RESULTADO.", support:"El resultado es recuperar tiempo sin perder control.", metric:"TIEMPO" },
    { number:7, role:"close", layout:"closing", headline:"PRIMERO MIDE. DESPUÉS DECIDE.", support:"Sin cifras, solo estás cambiando una intuición por otra." }
  ];
  const slug = slugify(title).slice(0,64);
  return {
    schema_version:1,
    id:`${post.date}_${slug}`,
    date:post.date,
    title,
    stage:post.stage,
    cta:post.cta,
    visual_reference:resources.references,
    evidence,
    slides,
    content_hash:crypto.createHash("sha256").update(JSON.stringify({post,evidence})).digest("hex")
  };
}

export function buildCopies(spec, { resourceReady = false } = {}) {
  const evidence = spec.evidence[0];
  const attribution = evidence ? `Según ${evidence.source}, ${lowerFirst(evidence.claim)}.` : "La base de investigación del mes identifica un coste operativo medible.";
  const cta = spec.cta.includes("recurso") && resourceReady
    ? `El recurso práctico ya está validado. Puedes usarlo para calcularlo con tus propios datos en outputs/${spec.id}/lead-magnet.html.`
    : spec.cta.includes("recurso")
      ? "Esta pieza queda sin CTA de recurso hasta que el entregable exista y supere QA."
    : spec.cta.includes("bofu") || spec.cta.includes("calendly")
      ? "Si quieres revisar tu caso con números, puedes reservar una conversación de 30 minutos."
      : "¿Qué tarea te roba más tiempo cada semana?";
  return {
    instagram:`Diez días al mes.\n\nEso es lo que una pyme española puede dedicar a tareas administrativas, según el informe de Qonto citado por esdiario.com e Infobae.\n\nDiez días para copiar datos, buscar papeles y hacer cosas que vuelven a empezar la semana siguiente.\n\nYo empezaría por apuntar tres números: horas, coste por hora y errores o ventas que se escapan. Con eso ya puedes decidir si merece la pena tocar algo.\n\nGlobalizame sigue en fase inicial. Aquí separo los datos publicados de mi criterio.\n\n${cta}`,
    linkedin:`Hay pymes españolas que dedican hasta diez días al mes a tareas administrativas. El dato aparece en el informe de Qonto citado por esdiario.com e Infobae.\n\nDiez días es mucho tiempo para copiar datos, perseguir documentos y repetir tareas que nadie ha parado a medir.\n\nAntes de comprar una herramienta, apunta las horas semanales, el coste real de una hora y los errores o ventas que se escapan. Si no puedes poner una cifra, todavía no sabes qué arreglar.\n\nGlobalizame sigue en fase inicial. Los resultados externos llevan su fuente y no los presento como experiencia mía.\n\n${cta}`
  };
}

function metricFrom(value){const m=String(value).match(/(?:\d+[\d.,]*\s*(?:%|€|euros?|h(?:oras?)?|días?))/iu);return m?.[0]||"MÍDELO"}
function slugify(value){return value.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function lowerFirst(value=""){return value.charAt(0).toLowerCase()+value.slice(1)}
function shortHeadline(value){const first=String(value).split(/[.!?]/)[0].trim();if(first.length<=58)return first.toUpperCase();return first.split(/\s+/).slice(0,8).join(" ").toUpperCase()}
function shortEvidence(value){const words=String(value).split(/\s+/);return (words.length>11?words.slice(0,11).join(" "):value).toUpperCase()}
