import fs from "node:fs";
import path from "node:path";

const MONTHS = { ene:1, feb:2, mar:3, abr:4, may:5, jun:6, jul:7, ago:8, sep:9, oct:10, nov:11, dic:12 };

export function readResources(root, date = new Date()) {
  const dir = path.join(root, "recursos");
  const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const required = {
    voice: "voz_mario.md",
    funnel: "embudo_carruseles.md",
    strategy: "estrategia_mes.html",
    research: `base_${ym}.md`
  };
  const data = {};
  for (const [key, file] of Object.entries(required)) {
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) throw new Error(`Falta recurso obligatorio: recursos/${file}`);
    data[key] = fs.readFileSync(full, "utf8");
  }
  const references = fs.readdirSync(path.join(dir, "carrusel"), { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name))
    .map(entry => path.join("recursos", "carrusel", entry.name));
  if (references.length < 3) throw new Error("Se requieren al menos 3 imágenes de referencia visual");
  return { ...data, references, ym };
}

export function extractPosts(strategy, year) {
  const rows = [];
  // El bloque `<div class="s">` es opcional: subtítulo de portada escrito a mano.
  // Si existe, la portada lo usa tal cual en vez de derivar uno de la evidencia.
  const re = /<div class="date">\s*(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)\s+(\d{1,2})\s+([a-záéíóú]{3})<span>(.*?)<\/span><\/div>[\s\S]*?<div class="t">([\s\S]*?)<\/div>\s*(?:<div class="s">([\s\S]*?)<\/div>\s*)?<div class="d">([\s\S]*?)<\/div>[\s\S]*?<span class="tag (tofu|mofu|bofu)">.*?<\/span><span class="tag cta">CTA:\s*([^<]+)<\/span>/giu;
  let m;
  while ((m = re.exec(strategy))) {
    const month = MONTHS[m[3].toLowerCase().slice(0,3)];
    if (!month) continue;
    rows.push({
      date: `${year}-${String(month).padStart(2,"0")}-${String(Number(m[2])).padStart(2,"0")}`,
      format: strip(m[4]), title: strip(m[5]), sub: m[6] ? strip(m[6]) : null, brief: strip(m[7]), stage: m[8].toUpperCase(), cta: strip(m[9]).toLowerCase()
    });
  }
  return rows;
}

export function selectPost(posts, targetDate) {
  const iso = targetDate.toISOString().slice(0,10);
  return posts.find(p => p.date === iso) || posts.find(p => p.date >= iso) || posts.at(-1);
}

export function extractEvidence(research, limit = 6) {
  const lines = research.split(/\r?\n/).filter(line => /^\|/.test(line) && !/^\|[- :]+\|/.test(line));
  return lines.slice(1).map(line => line.split("|").slice(1,-1).map(strip)).filter(cols => cols.length >= 3)
    .slice(0, limit).map((cols, index) => ({ id: `E${index+1}`, claim: cols[0], source: cols.at(-2) || cols.at(-1), business: cols.at(-1) }));
}

function strip(value="") { return value.replace(/<[^>]+>/g, " ").replace(/&gt;/g, ">").replace(/&lt;/g,"<").replace(/&amp;/g,"&").replace(/\s+/g," ").trim(); }
