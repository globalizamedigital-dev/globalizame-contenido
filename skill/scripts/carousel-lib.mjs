import fs from "node:fs";
import path from "node:path";

export const W = 1080;
export const H = 1350;
export const COLORS = {
  bg: "#232323", ink: "#F5F5F2", muted: "#A7A7A2",
  line: "#444444", green: "#86CA28", purple: "#700962", deep: "#191919"
};

export function esc(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
}

export function readSpec(folder) {
  return JSON.parse(fs.readFileSync(path.join(folder, "slides.yaml"), "utf8"));
}

function shell(number) {
  return `<rect width="${W}" height="${H}" fill="${COLORS.bg}"/>
  <rect x="40" y="40" width="1000" height="1270" fill="none" stroke="${COLORS.line}"/>
  <text x="88" y="91" class="meta strong">Mario Ruiz</text>
  <text x="88" y="120" class="meta muted">Founder · Globalizame</text>
  <text x="992" y="96" text-anchor="end" class="count">${String(number).padStart(2, "0")}</text>
  <rect x="924" y="116" width="68" height="4" fill="${COLORS.green}"/>`;
}

function styles() {
  return `<style>
  .display{font-family:"Aptos Display",Arial,sans-serif;font-weight:800;letter-spacing:-3px;fill:${COLORS.ink}}
  .headline{font-family:"Aptos Display",Arial,sans-serif;font-weight:750;letter-spacing:-2px;fill:${COLORS.ink}}
  .body{font-family:Aptos,Arial,sans-serif;font-weight:500;fill:${COLORS.ink}}
  .meta{font-family:Aptos,Arial,sans-serif;font-size:22px;font-weight:500;fill:${COLORS.ink}}
  .strong{font-weight:700}.muted{fill:${COLORS.muted}}.green{fill:${COLORS.green}}
  .count{font-family:"Aptos Display",Arial,sans-serif;font-size:34px;font-weight:800;fill:${COLORS.ink}}
  .source{font-family:Aptos,Arial,sans-serif;font-size:19px;fill:${COLORS.muted}}
  .line{stroke:${COLORS.green};stroke-width:5;fill:none}.dim{stroke:${COLORS.line};stroke-width:4;fill:none}
  </style>`;
}

function lines(items, x, y, size = 84, gap = 88, anchor = "start") {
  return items.map((item, i) => `<text x="${x}" y="${y + i * gap}" text-anchor="${anchor}" class="headline" font-size="${size}">${esc(item.text)}${item.accent ? `<tspan class="green">${esc(item.accent)}</tspan>` : ""}</text>`).join("\n");
}

function wrapWords(text, max = 42) {
  const words = String(text).split(/\s+/);
  const out = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > max && line) {
      out.push(line);
      line = word;
    } else line = candidate;
  }
  if (line) out.push(line);
  return out;
}

function phone(x, y, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M35 8 C15 8 6 24 12 44 L42 139 C48 159 65 169 84 160 L113 146 C128 139 133 122 124 109 L105 82 C98 72 86 68 75 74 L61 81 C55 68 50 55 47 42 L62 35 C74 29 78 17 70 7 Z" fill="${COLORS.ink}"/>
    <path d="M113 146 C158 205 220 235 286 222" class="line"/>
  </g>`;
}

function renderVisual(slide) {
  const v = slide.visual;
  switch (v.type) {
    case "ticket-hole":
      return `<g transform="translate(676 282) rotate(7)">
        <path d="M0 0 H260 V650 L230 630 200 650 170 630 140 650 110 630 80 650 50 630 20 650 0 630Z" fill="${COLORS.ink}"/>
        <circle cx="130" cy="255" r="82" fill="${COLORS.bg}"/>
        <path d="M78 218 C98 190 120 188 137 207 L151 223 C158 231 157 242 148 249 L134 260 C149 279 165 293 186 305 L198 291 C205 282 217 282 225 290 L241 307 C258 326 251 349 224 366 C176 334 124 284 78 218Z" fill="${COLORS.bg}"/>
        <rect x="52" y="80" width="154" height="12" fill="${COLORS.green}"/>
        <rect x="52" y="112" width="112" height="7" fill="${COLORS.line}"/>
        <rect x="52" y="520" width="154" height="54" fill="${COLORS.green}"/>
      </g>`;
    case "busy-scene":
      return `${phone(112, 470, 1.45)}
        <g opacity=".36" transform="translate(600 500)">
          <rect x="0" y="0" width="310" height="22" fill="${COLORS.muted}"/>
          <circle cx="52" cy="154" r="48" fill="none" stroke="${COLORS.muted}" stroke-width="18"/>
          <circle cx="245" cy="154" r="48" fill="none" stroke="${COLORS.muted}" stroke-width="18"/>
          <path d="M50 105 L112 30 M245 105 L182 30" stroke="${COLORS.muted}" stroke-width="24"/>
        </g>
        <path d="M312 486 Q380 430 445 486 M330 530 Q380 490 430 530" class="line"/>`;
    case "price-tag":
      return `${phone(120, 485, 1.15)}
        <path d="M500 620 Q610 680 660 750" class="dim"/>
        <g transform="translate(620 720) rotate(-7)">
          <path d="M0 0 H310 V188 H0 L-58 94Z" fill="${COLORS.green}"/>
          <circle cx="18" cy="94" r="13" fill="${COLORS.bg}"/>
          <text x="155" y="124" text-anchor="middle" class="display" font-size="82" fill="${COLORS.bg}">150 €</text>
        </g>`;
    case "matrix":
      return Array.from({ length: 100 }, (_, i) => {
        const x = 124 + (i % 10) * 66;
        const y = 520 + Math.floor(i / 10) * 66;
        const missed = i >= 57;
        return `<rect x="${x}" y="${y}" width="40" height="40" rx="4" fill="${missed ? COLORS.line : COLORS.green}"/>`;
      }).join("") + `<path d="M815 510 H875 V1140 H815" class="line"/><text x="902" y="850" class="display green" font-size="58">43</text>`;
    case "flow":
      return `<g transform="translate(110 555)">
        <rect x="0" y="0" width="270" height="330" fill="${COLORS.deep}" stroke="${COLORS.line}" stroke-width="4"/>
        <rect x="62" y="126" width="145" height="204" fill="${COLORS.line}"/>
        <text x="135" y="72" text-anchor="middle" class="body muted" font-size="30">TU NEGOCIO</text>
        <rect x="585" y="0" width="270" height="330" fill="${COLORS.deep}" stroke="${COLORS.green}" stroke-width="4"/>
        <rect x="647" y="126" width="145" height="204" fill="${COLORS.green}"/>
        <text x="720" y="72" text-anchor="middle" class="body" font-size="30">COMPETENCIA</text>
        <path d="M245 190 C390 70 480 70 625 190" class="line"/>
        <path d="M590 150 L625 190 575 198" class="line"/>
        ${Array.from({length: 7}, (_, i) => `<circle cx="${300 + i*48}" cy="${160 - Math.sin(i/6*Math.PI)*78}" r="15" fill="${COLORS.ink}"/>`).join("")}
      </g>`;
    case "leak":
      return `<g transform="translate(570 380)">
        <path d="M0 55 H240 V0 H345 V150 H225 V110 H0Z" fill="${COLORS.ink}"/>
        <path d="M55 112 C55 222 55 265 55 335" stroke="${COLORS.green}" stroke-width="34" stroke-linecap="round"/>
        ${Array.from({length:5},(_,i)=>`<circle cx="${55 + (i%2)*32}" cy="${360+i*78}" r="${28+i*3}" fill="${COLORS.green}"/>`).join("")}
        <ellipse cx="75" cy="790" rx="180" ry="54" fill="${COLORS.deep}"/>
        <ellipse cx="75" cy="790" rx="110" ry="28" fill="#0F0F0F"/>
      </g>`;
    case "clock":
      return `<g transform="translate(540 760)">
        <circle r="260" fill="none" stroke="${COLORS.line}" stroke-width="48"/>
        <circle r="260" fill="none" stroke="${COLORS.green}" stroke-width="48" stroke-dasharray="653 981" transform="rotate(-90)"/>
        ${Array.from({length:24},(_,i)=>`<line x1="0" y1="-302" x2="0" y2="-280" stroke="${i<10?COLORS.green:COLORS.muted}" stroke-width="4" transform="rotate(${i*15})"/>`).join("")}
        <text y="22" text-anchor="middle" class="display green" font-size="105">24/7</text>
      </g>`;
    case "closing-phone":
      return `${phone(660, 760, 1.35)}<path d="M116 1110 C340 1040 550 1188 870 1108" class="line"/>`;
    default:
      return "";
  }
}

export function renderSlide(slide) {
  const copy = slide.exact_copy;
  const headlineLines = copy.headline.map(t => typeof t === "string" ? { text: t } : t);
  const isCover = slide.role === "cover";
  const tx = isCover ? 94 : 96;
  const ty = isCover ? 276 : 256;
  const size = isCover ? 105 : 78;
  const supportY = ty + headlineLines.length * (size * .96) + 35;
  const supporting = copy.support ? `<text x="${tx}" y="${supportY}" class="body muted" font-size="38">${
    wrapWords(copy.support).map((line, i) => `<tspan x="${tx}" dy="${i ? 48 : 0}">${esc(line)}</tspan>`).join("")
  }</text>` : "";
  const source = copy.source ? `<text x="96" y="1237" class="source">${esc(copy.source)}</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${styles()}${shell(slide.number)}
  ${lines(headlineLines, tx, ty, size, size * .96)}
  ${supporting}${renderVisual(slide)}${source}
  </svg>`;
}

export function promptFor(slide, bible) {
  return `### Prompt slide ${slide.number}

[CONTRATO VISUAL] ${bible.mother_idea}. Motivo recurrente: ${bible.recurring_motif}. Perspectiva ${bible.perspective}; material ${bible.material}; iluminación ${bible.lighting}. Heredar sin reinterpretar el BRAND_DNA de Globalizame.

[FUNCIÓN] ${slide.narrative_job}

[COMPOSICIÓN] Layout ${slide.layout.template_id}. Punto focal: ${slide.layout.focal_point}. Orden de lectura: ${slide.layout.reading_order}. Vacío aproximado: ${slide.layout.whitespace_ratio}%.

[VISUAL] ${slide.visual.concept}

[TEXTO EXACTO] ${slide.exact_copy.headline.map(x => `"${typeof x === "string" ? x : `${x.text}${x.accent || ""}`}"`).join(" / ")}${slide.exact_copy.support ? ` / "${slide.exact_copy.support}"` : ""}

[CONTINUIDAD] ${slide.continuity}

[NEGATIVE] no texto inventado, no stock corporativo, no robot, no cerebro digital, no bombilla, no cohete, no engranajes, no iconos 3D, no neón, no degradados, no glassmorphism, no clipart, no emojis, no cambio de paleta, tipografía, marco, perspectiva o material.

[NOTA DE PRODUCCIÓN] Generar solo el elemento visual si el modelo no garantiza texto exacto. La tipografía, el marco, la firma, el contador y los datos se componen con el renderer SVG.`;
}
