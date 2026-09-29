// Motor de tutoriales: compone grabaciones reales, capturas y tarjetas en un canvas 9:16 o 16:9.
// Todo es función pura del tiempo (renderAt(t)) para poder renderizar fotograma a fotograma.
import CFG from './tutorial.js';

const FMT = CFG.format === '16:9' ? { W: 1920, H: 1080 } : { W: 1080, H: 1920 };
const { W, H } = FMT, V = H > W;                       // V = vertical
const B = Object.assign({ bg: '#0B0B0C', bg2: '#1A1A1D', ink: '#F7F7F5', accent: '#FF4B0B', dim: '#9A9AA0',
  display: 'Inter Tight', body: 'Inter', handle: '' }, CFG.brand || {});
const FPS = CFG.fps || 30;
const cv = document.getElementById('c'); cv.width = W; cv.height = H;
const X = cv.getContext('2d');
const SFX = [];
const sfx = (name, t, o = {}) => SFX.push({ name, t: +t.toFixed(3), gain: o.gain ?? 1, dur: o.dur ?? null, n: o.n });

/* ---------------- utilidades ---------------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = p => (p = clamp(p), p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const out3 = p => 1 - Math.pow(1 - clamp(p), 3);
const back = p => { p = clamp(p); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const lerp = (a, b, p) => a + (b - a) * p;
const font = (w, s, fam = B.display) => `${w} ${s}px "${fam}", Inter, system-ui, sans-serif`;
function rr(x, y, w, h, r) { X.beginPath(); X.roundRect(x, y, w, h, r); }
function wrap(text, maxW, f) {
  X.font = f; const out = []; let line = '';
  for (const w of String(text).split(/\s+/)) { const tst = line ? line + ' ' + w : w; if (X.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; }
  if (line) out.push(line); return out;
}
// texto con *énfasis* en color de acento
function rich(text, x, y, size, { w = 800, align = 'center', color = B.ink, acc = B.accent, fam = B.display, maxW = W - 120, lh = 1.12 } = {}) {
  const f = font(w, size, fam); const lines = wrap(text, maxW, f); X.font = f; X.textBaseline = 'alphabetic'; X.textAlign = 'left';
  lines.forEach((ln, i) => {
    const parts = ln.split(/(\*[^*]+\*)/).filter(Boolean).map(p => ({ t: p.replace(/\*/g, ''), a: p.startsWith('*') }));
    const tw = parts.reduce((s, p) => s + X.measureText(p.t).width, 0);
    let cx = align === 'center' ? x - tw / 2 : x;
    for (const p of parts) { X.fillStyle = p.a ? acc : color; X.fillText(p.t, cx, y + i * size * lh); cx += X.measureText(p.t).width; }
  });
  return lines.length * size * lh;
}
const imgCache = new Map();
function img(src) {
  if (!imgCache.has(src)) imgCache.set(src, new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('no carga ' + src)); i.src = src; }));
  if (imgCache.size > 90) imgCache.delete(imgCache.keys().next().value);
  return imgCache.get(src);
}
const json = async u => { try { const r = await fetch(u); return r.ok ? r.json() : null; } catch { return null; } };

/* ---------------- línea de tiempo ---------------- */
const VO = (await json('audio/vo.json')) || [];
const voBySeg = new Map(VO.map((v, i) => [v.seg, { ...v, n: i + 1 }]));
const SEGS = [];
let T = 0;
for (const [i, s0] of CFG.segments.entries()) {
  const s = { ...s0, i }; const vo = voBySeg.get(i);
  if (s.say && vo && vo.text !== s.say) console.warn('vo.json desactualizado para el segmento', i);
  s.vo = vo; s.voAt = s.voAt ?? 0.08;
  if (s.type === 'screen') {
    s.meta = (await json(s.src.replace(/\.(webm|mp4|mov)$/i, '.json'))) || { actions: [] };
    s.info = await json(`capturas/.frames/${s.src.split('/').pop().replace(/\.[^.]+$/, '')}/info.json`);
    if (!s.info) throw new Error(`Faltan los fotogramas de ${s.src}: corre node build.mjs --prep`);
    s.from = s.from ?? 0; s.to = Math.min(s.to ?? s.info.duration, s.info.duration); s.speed = s.speed ?? 1;
    s.clipDur = (s.to - s.from) / s.speed;
    s.SW = s.info.w; s.SH = s.info.h;
    const k = s.info.scale || 1;                                   // grabación reescalada en el prep → ajusta cajas
    if (k !== 1) { const sc = r => r && ({ x: r.x * k, y: r.y * k, w: r.w * k, h: r.h * k });
      s.meta.actions = s.meta.actions.map(a => ({ ...a, rect: sc(a.rect) }));
      if (Array.isArray(s.zoom)) s.zoom = s.zoom.map(z => ({ ...z, rect: z.rect.map(v => v * k) })); }
  }
  if (s.type === 'shot') { const im = await img(s.src); s.SW = im.width; s.SH = im.height; }
  const need = vo ? s.voAt + vo.dur + (s.pad ?? 0.3) : 0;
  s.dur = s.dur ?? Math.max(need, s.clipDur ?? 0, s.type === 'cta' ? 3.5 : 1.6);
  s.t0 = T; T += s.dur; SEGS.push(s);
}
const DURATION = +T.toFixed(3);

/* ---------------- layout ---------------- */
const L = V ? { head: 150, win: { x: 40, y: 400, w: 1000, h: 1080 }, cap: 1590, pad: 60 }
            : { head: 70, win: { x: 160, y: 150, w: 1600, h: 800 }, cap: 1010, pad: 80 };
const BAR = V ? 54 : 44;

/* ---------------- cámara (zoom automático) ---------------- */
function viewFit(s, a) { return s.SW / s.SH > a ? { w: s.SW, h: s.SW / a, x: 0, y: (s.SH - s.SW / a) / 2 } : { h: s.SH, w: s.SH * a, y: 0, x: (s.SW - s.SH * a) / 2 }; }
function cover([x, y, w, h], a) {                     // encuadre fijo: el rectángulo [x,y,w,h] llena la ventana
  const cx = x + w / 2, cy = y + h / 2; if (w / h > a) h = w / a; else w = h * a; return { x: cx - w / 2, y: cy - h / 2, w, h };
}
function viewFocus(s, r, a, zmax) {
  let w = Math.max(r.w + Math.max(160, r.w * 0.3), s.SW / zmax), h = Math.max(r.h + Math.max(160, r.h * 0.45), (s.SW / zmax) / a);
  if (s.focusMaxW && w > s.focusMaxW) { w = s.focusMaxW; }   // líneas largas (terminal): encuadra el inicio
  if (w / h > a) h = w / a; else w = h * a;
  if (w > s.SW) { w = s.SW; h = w / a; }
  let x = s.focusMaxW && r.w > w ? r.x - 30 : r.x + r.w / 2 - w / 2, y = r.y + r.h / 2 - h / 2;
  x = w <= s.SW ? clamp(x, 0, s.SW - w) : (s.SW - w) / 2; y = h <= s.SH ? clamp(y, 0, s.SH - h) : (s.SH - h) / 2;
  return { x, y, w, h };
}
function buildCamera(s, a) {
  const fit = s.crop ? cover(s.crop, a) : viewFit(s, a), zmax = s.zoomMax ?? 2.6, TR = 0.55, bz = s.baseZoom ?? (s.type === 'screen' ? 1.6 : 1);
  let foc = [];
  if (Array.isArray(s.zoom)) foc = s.zoom.map(z => ({ t: z.at, hold: z.hold ?? 2, rect: { x: z.rect[0], y: z.rect[1], w: z.rect[2], h: z.rect[3] } }));
  else if (s.zoom !== false) foc = (s.type === 'shot' ? (s.boxes || []).map(b => ({ t: b.at, zoom: b.zoom ?? true, rect: { x: b.rect[0], y: b.rect[1], w: b.rect[2], h: b.rect[3] }, hold: b.hold }))
                                                        : s.meta.actions).filter(a => a.rect && a.zoom)
                                    .map(a => ({ t: a.t, rect: a.rect, hold: a.hold ?? (a.type === 'type' ? 0.05 * (a.text || '').length + 1.2 : 1.7) }));
  foc = foc.sort((p, q) => p.t - q.t).map(f => ({ a: f.t - 0.2, b: f.t + f.hold, rect: f.rect, view: viewFocus(s, f.rect, a, zmax) }));
  // plano abierto: se aleja a baseZoom sin perder de vista la última acción (o arriba al centro al empezar)
  const wide = r => (bz <= 1 || s.crop) ? fit : viewFocus(s, r || { x: s.SW / 2 - 1, y: 0, w: 2, h: 2 }, a, bz);
  const holds = [{ a: -1e9, b: foc.length ? foc[0].a - TR : 1e9, view: wide(foc[0]?.rect) }];
  foc.forEach((f, k) => {
    const nx = foc[k + 1]; holds.push(f);
    if (nx) { if (nx.a - f.b < 1.3) f.b = Math.min(f.b, nx.a - 0.4); else holds.push({ a: f.b + TR, b: nx.a - TR, view: wide(f.rect) }); }
    else holds.push({ a: f.b + TR, b: 1e9, view: wide(f.rect) });
  });
  const base = holds[0].view;
  return tc => {
    for (let k = 0; k < holds.length; k++) {
      const h = holds[k]; if (tc >= h.a && tc <= h.b) return h.view;
      const nx = holds[k + 1]; if (nx && tc > h.b && tc < nx.a) {
        const p = ease((tc - h.b) / (nx.a - h.b)), A = h.view, Bv = nx.view;
        const w = Math.exp(lerp(Math.log(A.w), Math.log(Bv.w), p)), cx = lerp(A.x + A.w / 2, Bv.x + Bv.w / 2, p), cy = lerp(A.y + A.h / 2, Bv.y + Bv.h / 2, p);
        return { x: cx - w / 2, y: cy - w / a / 2, w, h: w / a };
      }
    }
    return base;
  };
}

/* ---------------- piezas de dibujo ---------------- */
function background(t) {
  const g = X.createRadialGradient(W * 0.5, H * 0.35, 50, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
  g.addColorStop(0, B.bg2); g.addColorStop(1, B.bg); X.fillStyle = g; X.fillRect(0, 0, W, H);
  X.globalAlpha = 0.06; X.fillStyle = B.accent;                     // halo de marca que respira
  X.beginPath(); X.arc(W * (0.8 + 0.05 * Math.sin(t * 0.6)), H * 0.12, V ? 420 : 380, 0, 7); X.fill(); X.globalAlpha = 1;
}
function header(s, lt) {
  const p = out3(lt / 0.35), x = L.pad, y = L.head;
  X.save(); X.globalAlpha = p; X.translate(0, (1 - p) * -30);
  if (s.step != null) {
    const lbl = `PASO ${s.step}${CFG.totalSteps ? ' / ' + CFG.totalSteps : ''}`; X.font = font(800, V ? 34 : 26, B.body);
    const tw = X.measureText(lbl).width; rr(x, y - (V ? 44 : 34), tw + 44, V ? 60 : 46, 30); X.fillStyle = B.accent; X.fill();
    X.fillStyle = '#fff'; X.textAlign = 'left'; X.fillText(lbl, x + 22, y - (V ? 3 : 2));
  }
  if (s.title) rich(s.title, x, y + (s.step != null ? (V ? 90 : 62) : 20), V ? 66 : 50, { align: 'left', maxW: W - 2 * x });
  X.restore();
}
function windowFrame(r, host) {
  X.save(); X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 60; X.shadowOffsetY = 24;
  rr(r.x, r.y, r.w, r.h, 26); X.fillStyle = '#1c1c1f'; X.fill(); X.restore();
  rr(r.x, r.y, r.w, BAR, [26, 26, 0, 0]); X.fillStyle = '#2a2a2e'; X.fill();
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, k) => { X.fillStyle = c; X.beginPath(); X.arc(r.x + 34 + k * 30, r.y + BAR / 2, 9, 0, 7); X.fill(); });
  if (host) { const bw = Math.min(r.w * 0.55, 520); rr(r.x + r.w / 2 - bw / 2, r.y + 11, bw, BAR - 22, 12); X.fillStyle = '#1c1c1f'; X.fill();
    X.fillStyle = '#b8b8bd'; X.font = font(500, V ? 24 : 20, B.body); X.textAlign = 'center'; X.fillText('🔒 ' + host, r.x + r.w / 2, r.y + BAR / 2 + 8); X.textAlign = 'left'; }
  return { x: r.x, y: r.y + BAR, w: r.w, h: r.h - BAR };
}
function drawSource(im, s, view, C) {
  X.save(); rr(C.x, C.y, C.w, C.h, [0, 0, 24, 24]); X.clip();
  X.fillStyle = '#111'; X.fillRect(C.x, C.y, C.w, C.h);
  const k = C.w / view.w;
  X.drawImage(im, C.x - view.x * k, C.y - view.y * k, s.SW * k, s.SH * k);
  X.restore();
  return r => ({ x: C.x + (r.x - view.x) * k, y: C.y + (r.y - view.y) * k, w: r.w * k, h: r.h * k });
}
function highlight(m, C, p, label, n) {   // foco: oscurece alrededor, marco de acento y etiqueta
  if (p <= 0) return;
  X.save(); rr(C.x, C.y, C.w, C.h, [0, 0, 24, 24]); X.clip();
  const pad = 10, r = { x: m.x - pad, y: m.y - pad, w: m.w + 2 * pad, h: m.h + 2 * pad };
  X.fillStyle = `rgba(0,0,0,${0.38 * p})`; X.beginPath(); X.rect(C.x, C.y, C.w, C.h); X.roundRect(r.x, r.y, r.w, r.h, 14); X.fill('evenodd');
  X.globalAlpha = p; X.lineWidth = 6; X.strokeStyle = B.accent; rr(r.x, r.y, r.w, r.h, 14); X.stroke();
  X.restore();
  if (n != null) { X.save(); X.globalAlpha = p; X.fillStyle = B.accent; X.beginPath(); X.arc(r.x, r.y, 30 * back(p), 0, 7); X.fill();
    X.fillStyle = '#fff'; X.font = font(900, 34, B.body); X.textAlign = 'center'; X.fillText(n, r.x, r.y + 12); X.restore(); }
  if (label) {
    X.save(); X.globalAlpha = p; X.font = font(800, V ? 36 : 30, B.body); const tw = X.measureText(label).width + 40, th = V ? 62 : 52;
    let lx = clamp(r.x + r.w / 2 - tw / 2, C.x + 12, C.x + C.w - tw - 12), ly = r.y + r.h + 18;
    if (ly + th > C.y + C.h - 10) ly = r.y - th - 18;
    ly = clamp(ly, C.y + 10, C.y + C.h - th - 10);
    rr(lx, ly, tw, th, 16); X.fillStyle = B.accent; X.fill(); X.fillStyle = '#fff'; X.textAlign = 'left';
    X.fillText(label, lx + 20, ly + th / 2 + 12); X.restore();
  }
}
function captions(t) {
  const s = SEGS.find(q => t >= q.t0 && t < q.t0 + q.dur); if (!s || !s.vo || s.captions === false || CFG.captions === false) return;
  const words = s.say.split(/\s+/).filter(Boolean), tot = words.reduce((a, w) => a + w.length + 2, 0);
  const lt = t - s.t0 - s.voAt; if (lt < 0 || lt > s.vo.dur + 0.25) return;
  let acc = 0, idx = words.length - 1;
  for (let k = 0; k < words.length; k++) { acc += (words[k].length + 2) / tot * s.vo.dur; if (lt < acc) { idx = k; break; } }
  const chunks = []; let cur = [];                                   // grupos de ≤3 palabras / ≤22 caracteres
  words.forEach((w, k) => { if (cur.length && (cur.length >= 3 || cur.map(i => words[i]).join(' ').length + w.length > 22 || /[.:!?]$/.test(words[k - 1]))) { chunks.push(cur); cur = []; } cur.push(k); });
  if (cur.length) chunks.push(cur);
  const ch = chunks.find(c => c.includes(idx)); if (!ch) return;
  const size = V ? 70 : 54, f = font(900, size); X.font = f;
  const txt = ch.map(i => words[i].replace(/[*]/g, '').toUpperCase());
  const sp = X.measureText(' ').width, widths = txt.map(w => X.measureText(w).width), tw = widths.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
  const chStart = ch[0] === 0 ? 0 : words.slice(0, ch[0]).reduce((a, w) => a + (w.length + 2) / tot * s.vo.dur, 0);
  const pop = back((lt - chStart) / 0.16), cx = W / 2, cy = L.cap;
  X.save(); X.translate(cx, cy); X.scale(0.85 + 0.15 * pop, 0.85 + 0.15 * pop);
  rr(-tw / 2 - 28, -size + 2, tw + 56, size * 1.35, 18); X.fillStyle = 'rgba(0,0,0,.72)'; X.fill();
  let x = -tw / 2; X.textAlign = 'left';
  txt.forEach((w, k) => { X.fillStyle = ch[k] === idx ? B.accent : '#fff'; X.fillText(w, x, 0 + size * 0.1); x += widths[k] + sp; });
  X.restore();
}
function progress(t) {
  X.fillStyle = 'rgba(255,255,255,.14)'; X.fillRect(0, 0, W, 10);
  X.fillStyle = B.accent; X.fillRect(0, 0, W * t / DURATION, 10);
  if (B.handle) { X.font = font(700, V ? 30 : 24, B.body); X.fillStyle = 'rgba(255,255,255,.6)'; X.textAlign = V ? 'left' : 'right'; X.fillText(B.handle, V ? L.pad : W - L.pad, V ? 70 : 50); X.textAlign = 'left'; }
}

/* ---------------- tipos de segmento ---------------- */
const R = {};
R.title = async (s, lt) => {
  const words = s.title.split(' '); const size = s.size || (V ? 118 : 104);
  if (s.kicker) { const p = out3(lt / 0.3); X.globalAlpha = p; X.font = font(800, V ? 36 : 30, B.body); const tw = X.measureText(s.kicker).width + 50;
    rr(W / 2 - tw / 2, (V ? 620 : 250) - 48, tw, 66, 33); X.fillStyle = B.accent; X.fill(); X.fillStyle = '#fff'; X.textAlign = 'center'; X.fillText(s.kicker, W / 2, V ? 620 : 250); X.globalAlpha = 1; }
  const shown = words.filter((_, k) => lt > 0.12 + k * 0.09).join(' ');
  X.textAlign = 'left'; const p = back((lt - 0.1) / 0.3); X.save(); X.translate(W / 2, V ? 800 : 420); X.scale(p, p);
  rich(shown, 0, 0, size, { w: 900, maxW: W - 140 }); X.restore();
  const th = wrap(s.title.replace(/\*/g, ''), W - 140, font(900, size)).length * size * 1.12;
  if (s.sub) { const q = out3((lt - 0.12 - words.length * 0.09) / 0.35); X.globalAlpha = q; rich(s.sub, W / 2, (V ? 800 : 420) + th + 20, V ? 50 : 42, { w: 500, color: B.dim, fam: B.body }); X.globalAlpha = 1; }
};
R.text = async (s, lt) => {
  if (s.step != null) header({ step: s.step }, lt);
  const size = s.size || (V ? 104 : 90), y = s.y ?? H * 0.4, p = back(lt / 0.3);
  const th = wrap(s.text.replace(/\*/g, ''), W - 140, font(900, size)).length * size * 1.12;
  X.save(); X.translate(W / 2, y); X.scale(p, p); rich(s.text, 0, 0, size, { w: 900, maxW: W - 140 }); X.restore();
  if (s.sub) { X.globalAlpha = out3((lt - 0.4) / 0.4); rich(s.sub, W / 2, y + th + 30, V ? 50 : 42, { w: 500, color: B.dim, fam: B.body }); X.globalAlpha = 1; }
};
R.list = async (s, lt) => {
  header({ title: s.title, step: s.step }, lt);
  const n = s.items.length, y0 = V ? 560 : 330, gap = V ? 190 : 120;
  s.items.forEach((it, k) => {
    const at = s.at?.[k] ?? 0.4 + k * ((s.dur - 1) / n), p = out3((lt - at) / 0.3); if (p <= 0) return;
    const y = y0 + k * gap; X.save(); X.globalAlpha = p; X.translate((1 - p) * 60, 0);
    rr(L.pad, y - (V ? 70 : 55), W - 2 * L.pad, V ? 150 : 100, 22); X.fillStyle = 'rgba(255,255,255,.06)'; X.fill();
    X.fillStyle = s.bad ? '#E5484D' : B.accent; X.beginPath(); X.arc(L.pad + 58, y + 3, V ? 30 : 24, 0, 7); X.fill();
    X.strokeStyle = '#fff'; X.lineWidth = 7; X.beginPath();
    if (s.bad) { X.moveTo(L.pad + 46, y - 9); X.lineTo(L.pad + 70, y + 15); X.moveTo(L.pad + 70, y - 9); X.lineTo(L.pad + 46, y + 15); }
    else { X.moveTo(L.pad + 44, y + 4); X.lineTo(L.pad + 55, y + 15); X.lineTo(L.pad + 74, y - 10); } X.stroke();
    rich(it, L.pad + 110, y + 18, V ? 50 : 42, { align: 'left', w: 700, fam: B.body, maxW: W - 2 * L.pad - 140 }); X.restore();
  });
};
R.cta = async (s, lt) => {
  const cy = V ? 700 : 330;
  X.globalAlpha = out3(lt / 0.25); rich(s.pre ?? 'Comenta', W / 2, cy, V ? 96 : 80, { w: 800 }); X.globalAlpha = 1;
  const p = back((lt - 0.3) / 0.3); X.save(); X.translate(W / 2, cy + (V ? 200 : 160)); X.rotate(-0.05); X.scale(p * 1.0, p * 1.0);
  X.font = font(900, V ? 150 : 130); const tw = X.measureText(s.word).width + 80; rr(-tw / 2, -(V ? 135 : 118), tw, V ? 175 : 150, 24);
  X.fillStyle = B.accent; X.fill(); X.fillStyle = '#fff'; X.textAlign = 'center'; X.fillText(s.word, 0, V ? 10 : 8); X.restore(); X.textAlign = 'left';
  X.globalAlpha = out3((lt - 0.8) / 0.35); rich(s.sub, W / 2, cy + (V ? 400 : 300), V ? 64 : 52, { w: 700, fam: B.body }); X.globalAlpha = 1;
  if (lt > 1.2) { const b = Math.sin((lt - 1.2) * 7) * 18; X.strokeStyle = B.accent; X.lineWidth = 14; X.lineCap = 'round'; const ax = W / 2, ay = (V ? 1450 : 900) + b;
    X.beginPath(); X.moveTo(ax, ay - 110); X.lineTo(ax, ay); X.moveTo(ax - 55, ay - 55); X.lineTo(ax, ay); X.lineTo(ax + 55, ay - 55); X.stroke(); }
};
async function sourceSeg(s, lt, im, tc, acts) {
  header(s, lt);
  const r = L.win, host = s.host ?? (s.meta?.url ? new URL(s.meta.url).host : s.host);
  const enter = back(lt / 0.4), sc = 0.9 + 0.1 * enter;
  X.save(); X.translate(r.x + r.w / 2, r.y + r.h / 2); X.scale(sc, sc); X.translate(-(r.x + r.w / 2), -(r.y + r.h / 2)); X.globalAlpha = clamp(lt / 0.2);
  const C = windowFrame(r, host); s.cam ??= buildCamera(s, C.w / C.h);
  const view = s.cam(tc), map = drawSource(im, s, view, C);
  for (const a of acts) {                                         // foco en la acción actual
    if (!a.rect || a.hl === false) continue;
    const d = tc - a.t, span = a.hl ?? (a.type === 'type' ? 0.05 * (a.text || '').length + 1.2 : 1.4);
    const p = Math.min(out3((d + 0.25) / 0.3), 1 - clamp((d - span) / 0.3)); if (p > 0) highlight(map(a.rect), C, p, a.callout, a.n);
  }
  X.restore();
}
R.screen = async (s, lt) => {
  const tc = Math.min(s.from + lt * s.speed, s.to - 1 / FPS);
  const f = clamp(Math.round(tc * s.info.fps) + 1, 1, s.info.count);
  const im = await img(`capturas/.frames/${s.info.name}/f_${String(f).padStart(5, '0')}.jpg`);
  const acts = (s.meta.actions || []).map(a => ({ ...a, callout: s.callouts?.[a.label] ?? null }));
  await sourceSeg(s, lt, im, tc, acts);
};
R.shot = async (s, lt) => {
  const im = await img(s.src);
  const acts = (s.boxes || []).map((b, k) => ({ t: b.at, type: 'mark', rect: { x: b.rect[0], y: b.rect[1], w: b.rect[2], h: b.rect[3] }, callout: b.label, n: s.numbered ? k + 1 : null, hl: b.hold ?? 1.8 }));
  await sourceSeg(s, lt, im, lt, acts);
};

/* ---------------- efectos de sonido derivados de la línea de tiempo ---------------- */
for (const s of SEGS) {
  if (s.i > 0) sfx('whoosh', s.t0 - 0.12, { gain: 0.5 });
  if (s.vo) sfx('vo_' + s.vo.n, s.t0 + s.voAt);
  if (s.type === 'title') sfx('pop', s.t0 + 0.15, { gain: 0.7 });
  if (s.type === 'cta') { sfx('stamp', s.t0 + 0.45); sfx('ding', s.t0 + 0.9, { gain: 0.6 }); }
  if (s.type === 'list') s.items.forEach((_, k) => sfx('tick', s.t0 + (s.at?.[k] ?? 0.4 + k * ((s.dur - 1) / s.items.length)), { gain: 0.8 }));
  if (s.type === 'screen') for (const a of s.meta.actions || []) {
    const t = s.t0 + (a.t - s.from) / s.speed; if (t < s.t0 || t > s.t0 + s.dur) continue;
    if (a.type === 'click') sfx('blip', t, { gain: 0.45 });
    if (a.type === 'type') { const d = 0.045 * (a.text || '').length / s.speed; sfx('type', t + 0.15, { dur: d, n: Math.max(3, Math.round(d * 12)), gain: 0.5 }); }
  }
  if (s.type === 'shot') (s.boxes || []).forEach(b => sfx('blip', s.t0 + b.at, { gain: 0.4 }));
}

/* ---------------- render ---------------- */
async function renderAt(t) {
  t = clamp(t, 0, DURATION - 1e-3);
  const s = SEGS.find(q => t >= q.t0 && t < q.t0 + q.dur) || SEGS[SEGS.length - 1], lt = t - s.t0;
  background(t);
  const pin = clamp(lt / 0.18);                                    // entrada: punch-in rápido
  X.save(); X.globalAlpha = pin; const k = 1.04 - 0.04 * out3(pin); X.translate(W / 2, H / 2); X.scale(k, k); X.translate(-W / 2, -H / 2);
  await R[s.type](s, lt);
  X.restore();
  if (lt < 0.1 && s.i > 0) { X.fillStyle = `rgba(255,255,255,${0.35 * (1 - lt / 0.1)})`; X.fillRect(0, 0, W, H); }
  captions(t); progress(t);
}
window.renderAt = renderAt; window.DURATION = DURATION; window.SFX = SFX; window.VW = W; window.VH = H;
window.SEGMENTS = SEGS.map(s => ({ i: s.i, type: s.type, t0: +s.t0.toFixed(2), dur: +s.dur.toFixed(2), say: s.say || '' }));
await document.fonts.ready;
await renderAt(0);
window.READY = true;
if (!new URLSearchParams(location.search).has('render')) {           // vista previa en vivo
  const t0 = performance.now(); let busy = false;
  const loop = async () => { if (!busy) { busy = true; await renderAt(((performance.now() - t0) / 1000) % DURATION); busy = false; } requestAnimationFrame(loop); };
  loop();
}
