import fs from "node:fs";
import path from "node:path";

export const W = 1080;
export const H = 1350;
export const COLORS = {
  coal: "#070707",
  ink: "#F7F4EC",
  paper: "#EDE8DA",
  muted: "#B8B0A3",
  electric: "#8DFF24",
  lime: "#B7FF37",
  violet: "#6129FF",
  blue: "#00A7FF",
  shadow: "#141414",
  line: "#343434"
};

export function esc(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
}

export function readSpec(folder) {
  return JSON.parse(fs.readFileSync(path.join(folder, "slides.yaml"), "utf8"));
}

function defs() {
  return `<defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="${COLORS.electric}" stop-opacity=".55"/>
      <stop offset="42%" stop-color="${COLORS.violet}" stop-opacity=".24"/>
      <stop offset="100%" stop-color="${COLORS.coal}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="blueDrench" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#008CEB"/>
      <stop offset="58%" stop-color="#00A7FF"/>
      <stop offset="100%" stop-color="#0053B8"/>
    </linearGradient>
    <linearGradient id="paperFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F8F6EF"/>
      <stop offset="100%" stop-color="#D9D1C4"/>
    </linearGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="34" stdDeviation="34" flood-color="#000" flood-opacity=".55"/>
    </filter>
    <filter id="hardShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="18" dy="24" stdDeviation="0" flood-color="#000" flood-opacity=".25"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="12"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .12"/></feComponentTransfer>
    </filter>
    <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
      <path d="M72 0H0V72" fill="none" stroke="#FFFFFF" stroke-opacity=".12" stroke-width="1"/>
    </pattern>
  </defs>`;
}

function styles() {
  return `<style>
    .display{font-family:"Arial Black","Impact","Aptos Display",Arial,sans-serif;font-weight:900;letter-spacing:-.055em}
    .condensed{font-family:"Arial Narrow","Roboto Condensed","Aptos",Arial,sans-serif;font-weight:900;letter-spacing:-.04em}
    .body{font-family:Aptos,Arial,sans-serif;font-weight:600}
    .small{font-family:Aptos,Arial,sans-serif;font-weight:700}
    .accent{fill:${COLORS.electric}}
    .dark{fill:${COLORS.coal}}
    .paper{fill:${COLORS.paper}}
    .stroke{stroke:${COLORS.electric};stroke-width:10;fill:none;stroke-linecap:round;stroke-linejoin:round}
  </style>`;
}

function bg(mode = "dark") {
  if (mode === "blue") {
    return `<rect width="${W}" height="${H}" fill="url(#blueDrench)"/><rect width="${W}" height="${H}" fill="url(#grid)" opacity=".42"/><rect width="${W}" height="${H}" filter="url(#grain)" opacity=".45"/>`;
  }
  if (mode === "paper") {
    return `<rect width="${W}" height="${H}" fill="url(#paperFade)"/><rect width="${W}" height="${H}" fill="url(#grid)" opacity=".26"/><rect width="${W}" height="${H}" filter="url(#grain)" opacity=".55"/>`;
  }
  return `<rect width="${W}" height="${H}" fill="${COLORS.coal}"/><circle cx="740" cy="470" r="520" fill="url(#glow)" opacity=".72"/><rect width="${W}" height="${H}" filter="url(#grain)" opacity=".62"/>`;
}

function brand(slide, light = false) {
  const fill = light ? COLORS.coal : COLORS.ink;
  const sub = light ? "#2A2A2A" : COLORS.muted;
  return `<g>
    <text x="64" y="74" class="body" font-size="25" fill="${fill}">Mario Ruiz</text>
    <text x="64" y="105" class="small" font-size="18" fill="${sub}">Globalizame · automatización que contesta</text>
    <text x="1014" y="88" text-anchor="end" class="display" font-size="35" fill="${fill}">${String(slide.number).padStart(2, "0")}</text>
    <rect x="916" y="107" width="98" height="8" rx="4" fill="${COLORS.electric}"/>
  </g>`;
}

function headline(lines, x, y, size, opts = {}) {
  const gap = opts.gap || size * .88;
  const cls = opts.cls || "display";
  return lines.map((item, i) => {
    const t = typeof item === "string" ? { text: item } : item;
    const fill = t.accent ? COLORS.electric : (opts.fill || COLORS.ink);
    return `<text x="${x}" y="${y + i * gap}" class="${cls}" font-size="${size}" fill="${fill}">${esc(t.text || "")}${t.accent ? esc(t.accent) : ""}</text>`;
  }).join("\n");
}

function support(text, x, y, fill = COLORS.muted, max = 34) {
  if (!text) return "";
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return `<text x="${x}" y="${y}" class="body" font-size="31" fill="${fill}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 42 : 0}">${esc(l)}</tspan>`).join("")}</text>`;
}

function phoneObject(x, y, s = 1, color = COLORS.ink) {
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#softShadow)">
    <path d="M82 4C43 12 14 44 21 83c27 158 126 285 279 349 38 16 82-4 99-42l36-82c10-23 1-50-21-62l-88-48c-20-11-45-6-59 12l-35 43c-46-31-84-70-112-119l47-31c20-13 28-38 18-60L148 26C137 7 109-2 82 4Z" fill="${color}"/>
    <path d="M304 435C448 548 592 572 755 507" class="stroke" opacity=".85"/>
  </g>`;
}

function laptop(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#softShadow)">
    <path d="M56 0h418c31 0 56 25 56 56v282H0V56C0 25 25 0 56 0Z" fill="#111" stroke="#ECECEC" stroke-width="14"/>
    <rect x="42" y="42" width="446" height="254" rx="12" fill="#1D1D1D"/>
    <rect x="-40" y="338" width="610" height="44" rx="12" fill="#EEE"/>
    <path d="M98 96h242M98 148h172M98 202h290" stroke="${COLORS.electric}" stroke-width="18" stroke-linecap="round"/>
  </g>`;
}

function coinStack(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#softShadow)">
    ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${i * 18}" cy="${i * -42}" rx="116" ry="34" fill="${i % 2 ? COLORS.lime : COLORS.electric}" stroke="#101010" stroke-width="8"/>`).join("")}
    <text x="60" y="-150" text-anchor="middle" class="display dark" font-size="72">€</text>
  </g>`;
}

function cover(slide) {
  return `${bg("dark")}${brand(slide)}
    <text x="65" y="292" class="condensed" font-size="78" fill="${COLORS.ink}">PIERDES HASTA</text>
    <text x="59" y="474" class="display accent" font-size="178">15.000€</text>
    <text x="67" y="578" class="condensed" font-size="92" fill="${COLORS.ink}">AL MES</text>
    ${support("y ni te enteras", 70, 660, COLORS.ink, 22)}
    <g transform="translate(805 300) rotate(10)" filter="url(#softShadow)">
      <path d="M0 0h235v630l-26-22-26 22-26-22-26 22-26-22-26 22-26-22-26 22-27-22Z" fill="${COLORS.paper}"/>
      <circle cx="118" cy="275" r="82" fill="${COLORS.coal}"/>
      <path d="M48 84h130M48 124h88M48 508h143" stroke="${COLORS.electric}" stroke-width="22" stroke-linecap="round"/>
    </g>
    <path d="M494 832C618 730 742 720 918 790" class="stroke"/>
    <text x="65" y="1225" class="small" font-size="24">La llamada perdida no suena como pérdida. Suena como “luego llamo”.</text>`;
}

function busy(slide) {
  return `${bg("blue")}${brand(slide)}
    ${headline(slide.exact_copy.headline, 65, 260, 95, { cls: "condensed" })}
    ${support(slide.exact_copy.support, 68, 385, COLORS.ink, 44)}
    <g opacity=".22"><text x="-30" y="1000" class="display" font-size="260" fill="#fff">TEMPORADA</text></g>
    ${phoneObject(95, 575, .72)}
    <g transform="translate(560 515) rotate(-7)" filter="url(#softShadow)">
      <rect x="0" y="0" width="430" height="290" rx="40" fill="${COLORS.paper}"/>
      <path d="M80 83h280M80 148h210M80 212h250" stroke="#111" stroke-width="20" stroke-linecap="round"/>
      <circle cx="348" cy="224" r="50" fill="${COLORS.electric}"/>
    </g>
    <path d="M212 530C360 382 480 388 606 520" class="stroke"/>`;
}

function price(slide) {
  return `${bg("paper")}${brand(slide, true)}
    ${headline(slide.exact_copy.headline, 63, 235, 78, { cls: "condensed", fill: COLORS.coal })}
    ${support(slide.exact_copy.support, 66, 420, "#252525", 32)}
    <g transform="translate(220 575)">
      ${phoneObject(0, 0, .64, COLORS.coal)}
    </g>
    <path d="M480 680C590 610 710 660 796 780" stroke="${COLORS.coal}" stroke-width="6" fill="none" stroke-dasharray="14 18"/>
    <g transform="translate(610 705) rotate(-9)" filter="url(#hardShadow)">
      <path d="M0 0h350v220H0l-78-110Z" fill="${COLORS.electric}"/>
      <circle cx="24" cy="110" r="18" fill="${COLORS.coal}"/>
      <text x="180" y="142" text-anchor="middle" class="display dark" font-size="96">150€</text>
    </g>
    <text x="64" y="1238" class="small" font-size="22" fill="#333">${esc(slide.exact_copy.source || "")}</text>`;
}

function matrix(slide) {
  return `${bg("dark")}${brand(slide)}
    <text x="65" y="262" class="condensed" font-size="88">43 DE CADA 100</text>
    <text x="65" y="352" class="condensed" font-size="88">SIN CONTESTAR</text>
    ${support(slide.exact_copy.support, 70, 430, COLORS.muted, 30)}
    <g transform="translate(92 545)" filter="url(#softShadow)">
      <rect x="0" y="0" width="895" height="565" rx="44" fill="#111" stroke="#252525" stroke-width="3"/>
      ${Array.from({ length: 100 }, (_, i) => {
        const x = 56 + (i % 10) * 78;
        const y = 60 + Math.floor(i / 10) * 46;
        const on = i < 43;
        return `<rect x="${x}" y="${y}" width="48" height="28" rx="7" fill="${on ? COLORS.electric : "#3D3D3D"}"/>`;
      }).join("")}
      <text x="700" y="496" class="display accent" font-size="104">43%</text>
    </g>
    <text x="64" y="1238" class="small" font-size="22">${esc(slide.exact_copy.source || "")}</text>`;
}

function flow(slide) {
  return `${bg("paper")}${brand(slide, true)}
    <text x="62" y="260" class="condensed" font-size="94" fill="${COLORS.coal}">85 DE CADA 100</text>
    <text x="62" y="352" class="condensed" font-size="94" fill="${COLORS.coal}">NO VUELVEN</text>
    ${support(slide.exact_copy.support, 67, 430, "#222", 30)}
    <g transform="translate(78 610)">
      <rect x="0" y="0" width="340" height="350" rx="28" fill="#151515"/>
      <rect x="34" y="74" width="272" height="230" fill="#333"/>
      <text x="170" y="54" text-anchor="middle" class="body" font-size="28">TU NEGOCIO</text>
      <rect x="590" y="-35" width="340" height="420" rx="28" fill="${COLORS.electric}" filter="url(#softShadow)"/>
      <rect x="625" y="58" width="270" height="260" fill="#111"/>
      <text x="760" y="31" text-anchor="middle" class="body dark" font-size="28">COMPETENCIA</text>
      <path d="M285 155C420 10 548 7 676 148" stroke="${COLORS.coal}" stroke-width="12" fill="none"/>
      <path d="M638 116l38 32-50 14" stroke="${COLORS.coal}" stroke-width="12" fill="none"/>
      ${Array.from({ length: 7 }, (_, i) => `<circle cx="${345 + i * 45}" cy="${120 - Math.sin(i / 6 * Math.PI) * 70}" r="${16 + i}" fill="${COLORS.coal}"/>`).join("")}
    </g>
    <text x="64" y="1238" class="small" font-size="22" fill="#333">${esc(slide.exact_copy.source || "")}</text>`;
}

function leak(slide) {
  return `${bg("blue")}${brand(slide)}
    <text x="62" y="258" class="condensed" font-size="78">ENTRE</text>
    <text x="62" y="382" class="display accent" font-size="134">2.500€</text>
    <text x="62" y="490" class="condensed" font-size="78">Y</text>
    <text x="62" y="630" class="display accent" font-size="154">15.000€</text>
    ${support(slide.exact_copy.support, 68, 710, COLORS.ink, 28)}
    <g transform="translate(600 445)" filter="url(#softShadow)">
      <path d="M0 80h240V0h140v190H238v-54H0Z" fill="${COLORS.ink}"/>
      <path d="M70 154C70 310 70 410 70 520" class="stroke" stroke-width="34"/>
      ${Array.from({ length: 6 }, (_, i) => `<circle cx="${70 + (i % 2 ? 36 : -18)}" cy="${575 + i * 72}" r="${34 + i * 2}" fill="${COLORS.electric}"/>`).join("")}
      <ellipse cx="88" cy="1040" rx="210" ry="62" fill="#050505" opacity=".72"/>
    </g>
    <text x="64" y="1238" class="small" font-size="22">${esc(slide.exact_copy.source || "")}</text>`;
}

function clock(slide) {
  return `${bg("dark")}${brand(slide)}
    <text x="65" y="255" class="condensed" font-size="82">EL <tspan fill="${COLORS.electric}">40%</tspan></text>
    <text x="65" y="344" class="condensed" font-size="82">ENTRA FUERA</text>
    <text x="65" y="433" class="condensed" font-size="82">DE HORARIO</text>
    ${support(slide.exact_copy.support, 70, 512, COLORS.muted, 36)}
    <g transform="translate(540 870)" filter="url(#softShadow)">
      <circle r="278" fill="#111" stroke="#303030" stroke-width="58"/>
      <circle r="278" fill="none" stroke="${COLORS.electric}" stroke-width="58" stroke-dasharray="699 1048" transform="rotate(-90)"/>
      ${Array.from({ length: 24 }, (_, i) => `<line x1="0" y1="-350" x2="0" y2="-316" stroke="${i < 10 ? COLORS.electric : COLORS.muted}" stroke-width="6" transform="rotate(${i * 15})"/>`).join("")}
      <text y="36" text-anchor="middle" class="display accent" font-size="138">24/7</text>
    </g>
    <text x="64" y="1238" class="small" font-size="22">${esc(slide.exact_copy.source || "")}</text>`;
}

function closing(slide) {
  return `${bg("dark")}${brand(slide)}
    <text x="62" y="300" class="condensed" font-size="92">NO LLAMAS MAL.</text>
    <text x="62" y="420" class="display accent" font-size="120">NO HAY NADIE</text>
    <text x="62" y="535" class="condensed" font-size="92">AL OTRO LADO.</text>
    ${support(slide.exact_copy.support, 68, 622, COLORS.ink, 28)}
    <g transform="translate(450 720) rotate(-7)">
      ${phoneObject(0, 0, .72)}
    </g>
    <path d="M95 1095C250 1006 438 1020 602 1080C755 1136 894 1113 1015 1035" class="stroke"/>
    <g transform="translate(64 1170)">
      <rect width="472" height="82" rx="41" fill="${COLORS.electric}"/>
      <text x="236" y="54" text-anchor="middle" class="body dark" font-size="31">Comenta “LLAMADAS”</text>
    </g>`;
}

export function renderSlide(slide) {
  const renderers = {
    cover: cover,
    context: busy,
    proof: price,
    scale: matrix,
    consequence: flow,
    synthesis: leak,
    turn: clock,
    closing: closing
  };
  const body = (renderers[slide.role] || cover)(slide);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="${COLORS.ink}">
    ${defs()}${styles()}${body}
  </svg>`;
}

export function promptFor(slide, bible) {
  const headline = slide.exact_copy.headline.map(x => typeof x === "string" ? x : `${x.text}${x.accent || ""}`).join(" / ");
  return `### Prompt slide ${slide.number}

[DIRECCIÓN DE ARTE]
Construye una escena publicitaria premium, no un icono. Referencia de energía: carruseles con titulares gigantes, collage 3D/foto, textura editorial, luz dramática, profundidad y un objeto protagonista. La marca Globalizame debe sentirse negra, eléctrica y directa: carbón, verde lima, azul saturado o papel sucio según la escena.

[IDEA MADRE]
${bible.mother_idea}. El motivo recurrente es ${bible.recurring_motif}, pero puede mutar: cable, fuga, arco, trayectoria, subrayado, halo o señal.

[FUNCIÓN DEL SLIDE]
${slide.narrative_job}

[ESCENA]
${slide.visual.concept}. Composición: ${slide.layout.focal_point}. Orden de lectura: ${slide.layout.reading_order}. Que el visual ocupe al menos el 45% del slide y tenga presencia de campaña, con sombras, escala y textura.

[TEXTO EXACTO A COMPONER]
${headline}${slide.exact_copy.support ? ` / ${slide.exact_copy.support}` : ""}

[CRITERIO INTELIGENTE]
Si el texto compite con la escena, prioriza legibilidad móvil y mueve la escena. Si la escena parece clipart, rehacerla como póster/collage. Si parece plantilla corporativa, aumentar escala, contraste y riesgo visual.

[BARANDILLA MÍNIMA]
No inventar texto. No usar iconos de banco de recursos como pieza principal. No cambiar la promesa ni la cifra. No generar un slide plano: debe tener profundidad, textura y un foco visual obvio.`;
}
