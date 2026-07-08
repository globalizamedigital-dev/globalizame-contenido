import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const out = path.join(here, "exports");
fs.mkdirSync(out, { recursive: true });

const slides = [
  {
    id: "01",
    asset: "assets/cover-ai-loss.png",
    title: ["Pierdes hasta", "15.000€", "al mes"],
    support: "y ni te enteras",
    accentLine: 1,
    className: "cover",
    cta: false
  },
  {
    id: "07",
    asset: "assets/ai-agent-night.png",
    title: ["El 40%", "entra fuera", "de horario"],
    support: "Un agente de voz puede cogerlo 24/7",
    accentLine: 0,
    className: "agent",
    cta: false
  },
  {
    id: "03",
    asset: "assets/price-tag-collage.png",
    title: ["Cada llamada", "lleva una", "etiqueta"],
    support: "150€ de media que se van",
    accentLine: 2,
    className: "white",
    cta: false
  },
  {
    id: "06",
    asset: "assets/money-leak-ai.png",
    title: ["Entre", "2.500€", "y 15.000€"],
    support: "que ni ves salir al mes",
    accentLine: 1,
    className: "blue",
    cta: false
  }
];

function html(slide) {
  const title = slide.title.map((line, index) =>
    `<div class="line ${index === slide.accentLine ? "accent" : ""}">${line}</div>`
  ).join("");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face{font-family:ImpactLocal;src:local("Impact");}
  :root{--lime:#8dff24;--blue:#009bff;--black:#050505;--paper:#f5f1e8;}
  *{box-sizing:border-box}
  body{margin:0;background:#111}
  .slide{
    width:1080px;height:1350px;position:relative;overflow:hidden;background:#050505;
    font-family:ImpactLocal,"Arial Black","Arial Narrow",Arial,sans-serif;color:white;
  }
  .slide img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:contrast(1.08) saturate(1.08)}
  .shade{position:absolute;inset:0;background:
    radial-gradient(circle at 80% 35%, rgba(141,255,36,.18), transparent 34%),
    linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.48) 42%, rgba(0,0,0,.10) 100%),
    linear-gradient(0deg, rgba(0,0,0,.55), transparent 40%);
  }
  .agent .shade{background:
    radial-gradient(circle at 60% 42%, rgba(141,255,36,.24), transparent 30%),
    linear-gradient(90deg, rgba(0,0,0,.90) 0%, rgba(0,0,0,.50) 46%, rgba(0,0,0,.18) 100%),
    linear-gradient(0deg, rgba(0,0,0,.62), transparent 46%);
  }
  .white .shade{background:
    linear-gradient(90deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.55) 45%, rgba(255,255,255,.08) 100%),
    linear-gradient(0deg, rgba(255,255,255,.46), transparent 55%);
  }
  .blue .shade{background:
    radial-gradient(circle at 75% 35%, rgba(141,255,36,.24), transparent 28%),
    linear-gradient(90deg, rgba(0,35,70,.72) 0%, rgba(0,80,150,.34) 45%, rgba(0,0,0,.05) 100%),
    linear-gradient(0deg, rgba(0,0,0,.50), transparent 45%);
  }
  .brand{position:absolute;left:58px;top:48px;font-family:Arial,sans-serif;font-weight:800;font-size:28px;letter-spacing:-.02em}
  .brand small{display:block;margin-top:5px;font-size:16px;color:rgba(255,255,255,.76);font-weight:700}
  .num{position:absolute;right:58px;top:52px;font-size:44px;color:#fff}
  .bar{position:absolute;right:58px;top:108px;width:120px;height:9px;border-radius:99px;background:var(--lime)}
  .copy{position:absolute;left:58px;top:210px;width:690px;text-transform:uppercase;letter-spacing:-.055em;line-height:.84}
  .line{font-size:104px;text-shadow:0 12px 44px rgba(0,0,0,.58)}
  .cover .line:nth-child(2){font-size:178px}
  .agent .line{font-size:104px}
  .white{color:#050505}
  .white .brand small{color:rgba(0,0,0,.68)}
  .white .line{text-shadow:none}
  .white .support{text-shadow:none;color:#050505}
  .white .num{color:#050505}
  .white .copy{top:190px}
  .white .support{top:535px}
  .blue .copy{top:180px}
  .blue .line:nth-child(2), .blue .line:nth-child(3){font-size:132px}
  .accent{color:var(--lime)}
  .support{position:absolute;left:64px;top:650px;max-width:560px;font-family:Arial,sans-serif;font-size:34px;font-weight:800;line-height:1.05;letter-spacing:-.03em;text-shadow:0 8px 28px #000}
  .agent .support{top:540px}
  .cta{position:absolute;left:64px;bottom:72px;border-radius:999px;background:var(--lime);color:#050505;font-family:Arial,sans-serif;font-weight:900;font-size:28px;padding:22px 34px}
  .cover .cta{display:none}
  .grain{position:absolute;inset:0;opacity:.13;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.75' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E")}
</style>
</head>
<body>
<div class="slide ${slide.className}">
  <img src="${slide.asset}">
  <div class="shade"></div>
  <div class="grain"></div>
  <div class="brand">Mario Ruiz<small>Globalizame · IA que contesta</small></div>
  <div class="num">${slide.id}</div><div class="bar"></div>
  <div class="copy">${title}</div>
  <div class="support">${slide.support}</div>
  ${slide.cta ? `<div class="cta">Comenta “LLAMADAS”</div>` : ""}
</div>
</body>
</html>`;
}

const browsers = process.platform === "win32"
  ? ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"]
  : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];
const browser = browsers.find(fs.existsSync);
if (!browser) throw new Error("Chrome/Edge no encontrado");

for (const slide of slides) {
  const file = path.join(here, `slide-${slide.id}.html`);
  fs.writeFileSync(file, html(slide), "utf8");
  const png = path.join(out, `slide-${slide.id}.png`);
  const profile = path.join(os.tmpdir(), `globalizame-campaign-${process.pid}-${slide.id}`);
  spawnSync(browser, [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
    "--window-size=1080,1350", `--user-data-dir=${profile}`,
    `--screenshot=${png}`, `file:///${file.replaceAll("\\", "/")}`
  ], { stdio: "inherit" });
}

const sheet = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#111;padding:28px;font-family:Arial;color:white"><h1 style="font-size:34px">Campaign test · Globalizame AI</h1><div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:24px"><img src="exports/slide-01.png" style="width:260px"><img src="exports/slide-03.png" style="width:260px"><img src="exports/slide-06.png" style="width:260px"><img src="exports/slide-07.png" style="width:260px"></div></body>`;
fs.writeFileSync(path.join(here, "contact-sheet.html"), sheet, "utf8");
spawnSync(browser, [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
  "--window-size=1180,520", `--user-data-dir=${path.join(os.tmpdir(), `globalizame-campaign-sheet-${process.pid}`)}`,
  `--screenshot=${path.join(here, "contact-sheet.png")}`, `file:///${path.join(here, "contact-sheet.html").replaceAll("\\", "/")}`
], { stdio: "inherit" });

console.log("Campaign test exported");
