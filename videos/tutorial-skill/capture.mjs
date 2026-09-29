// Graba la pantalla REAL de una web/app con Playwright, siguiendo un guion de pasos.
//   node capture.mjs capturas/nombre.capture.js        → capturas/nombre.webm + nombre.json (+ PNG de los pasos 'shot')
//   node capture.mjs --login https://claude.ai claude  → abre un navegador visible, inicias sesión a mano,
//                                                        cierras la ventana y guarda la sesión en ~/.config/video-pizarra/auth/claude.json
// El .json guarda el instante y la caja (x, y, w, h en px del video) de cada acción: es lo que usa el zoom automático.
// Cursor visible, pulso en cada clic y desenfoque de datos sensibles quedan "quemados" en la grabación.
import { chromium } from 'playwright';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const AUTH_DIR = join(homedir(), '.config', 'video-pizarra', 'auth');
const launchOpts = (headless) => ({ headless, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const args = process.argv.slice(2);

if (args[0] === '--login') {
  const [, url, name = 'default'] = args;
  await mkdir(AUTH_DIR, { recursive: true });
  const browser = await chromium.launch(launchOpts(false));
  const ctx = await browser.newContext({ viewport: null });
  const page = await ctx.newPage();
  await page.goto(url);
  console.log(`Inicia sesión en la ventana. Cuando termines, CIÉRRALA y guardo la sesión como "${name}".`);
  await new Promise(r => page.on('close', r));
  await ctx.storageState({ path: join(AUTH_DIR, `${name}.json`) });
  await browser.close();
  console.log('Sesión guardada en', join(AUTH_DIR, `${name}.json`), '(no la subas nunca al repo).');
  process.exit(0);
}

const specPath = resolve(args[0] || '');
if (!args[0] || !existsSync(specPath)) { console.error('Uso: node capture.mjs capturas/<nombre>.capture.js'); process.exit(1); }
const spec = (await import(pathToFileURL(specPath).href)).default;
const name = basename(specPath).replace(/\.capture\.js$/, '');
const outDir = dirname(specPath);
const vp = spec.viewport || { width: 1280, height: 1440 };
const scale = spec.scale || 1;   // afecta a los PNG de los pasos 'shot' (más nítidos); el video se graba a la resolución del viewport

const storage = spec.auth ? join(AUTH_DIR, `${spec.auth}.json`) : undefined;
if (storage && !existsSync(storage)) { console.error(`Falta la sesión "${spec.auth}". Corre: node capture.mjs --login <url> ${spec.auth}`); process.exit(1); }
const browser = await chromium.launch(launchOpts(spec.headless ?? true));
const ctx = await browser.newContext({
  viewport: vp, deviceScaleFactor: scale, storageState: storage, locale: spec.locale || 'es-ES',
  colorScheme: spec.colorScheme || 'light',
  recordVideo: { dir: join(outDir, '.rec'), size: { width: vp.width, height: vp.height } },
});

// Cursor visible + pulso en clics + desenfoque de selectores sensibles, dentro de la página grabada
const blurSel = JSON.stringify((spec.blur || []).join(',') || '');
await ctx.addInitScript(`(() => {
  const S = ${blurSel};
  const install = () => {
    if (document.getElementById('__vp_cursor')) return;
    const st = document.createElement('style');
    st.textContent = \`#__vp_cursor{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;transform:translate(-4px,-3px);transition:none}
      #__vp_cursor svg{filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
      .__vp_ring{position:fixed;z-index:2147483646;pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;
        border:4px solid ${spec.accent || '#FF4B0B'};animation:__vp_ring .6s ease-out forwards}
      @keyframes __vp_ring{to{transform:scale(5);opacity:0}}
      \${S ? S + '{filter:blur(9px)!important}' : ''}\`;
    document.documentElement.appendChild(st);
    const c = document.createElement('div'); c.id = '__vp_cursor';
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 26 26"><path d="M3 2 L3 21 L8 16 L12 24 L15.5 22.5 L11.6 14.8 L19 14.8 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = '__vp_ring';
      r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700); }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', install); else install();
})();`);

const page = await ctx.newPage();
const t0 = Date.now();
const now = () => (Date.now() - t0) / 1000;
const actions = [];
let mouse = { x: vp.width / 2, y: vp.height / 2 };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const px = r => r && ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });   // px del video
const log = (type, rect, extra = {}) => actions.push({ t: +now().toFixed(3), type, rect: px(rect), ...extra });

async function box(sel) {
  const loc = page.locator(sel).first();
  await loc.waitFor({ state: 'visible', timeout: spec.timeout || 20000 });
  await loc.scrollIntoViewIfNeeded();
  return { loc, rect: await loc.boundingBox() };
}
async function moveTo(rect) {                      // movimiento suave (con curva ligera) hacia el centro del elemento
  const tx = rect.x + rect.width / 2, ty = rect.y + rect.height / 2, n = 28;
  const sx = mouse.x, sy = mouse.y, bend = (Math.random() - 0.5) * 60;
  for (let i = 1; i <= n; i++) {
    const p = i / n, e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    await page.mouse.move(sx + (tx - sx) * e + Math.sin(p * Math.PI) * bend, sy + (ty - sy) * e);
    await sleep(12);
  }
  mouse = { x: tx, y: ty };
}

await page.goto(spec.url, { waitUntil: 'domcontentloaded' });
await page.mouse.move(mouse.x, mouse.y);
await sleep(spec.startDelay ?? 1200);
log('start', null, { label: spec.title || name });

for (const [i, st] of (spec.steps || []).entries()) {
  const label = st.label || `${st.do} ${st.sel || st.url || ''}`.trim();
  try {
    if (st.do === 'wait') await sleep(st.ms ?? 800);
    else if (st.do === 'goto') { await page.goto(st.url, { waitUntil: 'domcontentloaded' }); await sleep(st.ms ?? 800); log('goto', null, { label }); }
    else if (st.do === 'waitFor') { await page.locator(st.sel).first().waitFor({ state: st.state || 'visible', timeout: spec.timeout || 20000 }); }
    else if (st.do === 'hover') { const { rect } = await box(st.sel); await moveTo(rect); log('hover', rect, { label, zoom: st.zoom ?? true }); await sleep(st.ms ?? 500); }
    else if (st.do === 'click') {
      const { loc, rect } = await box(st.sel); await moveTo(rect); await sleep(180);
      log('click', rect, { label, zoom: st.zoom ?? true }); await loc.click(); await sleep(st.ms ?? 700);
    } else if (st.do === 'type') {
      const { loc, rect } = await box(st.sel); await moveTo(rect); await loc.click(); await sleep(150);
      log('type', rect, { label, zoom: st.zoom ?? true, text: st.text });
      await page.keyboard.type(st.text, { delay: st.delay ?? 45 }); await sleep(st.ms ?? 500);
    } else if (st.do === 'press') { await page.keyboard.press(st.key); log('press', null, { label }); await sleep(st.ms ?? 500); }
    else if (st.do === 'scroll') {
      const steps = 20; for (let k = 0; k < steps; k++) { await page.mouse.wheel(0, (st.y ?? 500) / steps); await sleep(18); }
      log('scroll', null, { label }); await sleep(st.ms ?? 500);
    } else if (st.do === 'mark') { const { rect } = await box(st.sel); log('mark', rect, { label, zoom: st.zoom ?? true }); await sleep(st.ms ?? 1200); }
    else if (st.do === 'shot') {
      const f = join(outDir, `${name}-${st.name || i}.png`);
      if (st.sel) await page.locator(st.sel).first().screenshot({ path: f }); else await page.screenshot({ path: f });
      log('shot', null, { label, file: basename(f) });
    } else if (st.do === 'eval') { await page.evaluate(st.js); await sleep(st.ms ?? 300); }
    else throw new Error(`paso desconocido: ${st.do}`);
    console.log(`  ✔ ${String(i + 1).padStart(2)} ${now().toFixed(1)}s  ${label}`);
  } catch (e) {
    console.error(`  ✘ ${i + 1} ${label}: ${e.message.split('\n')[0]}`);
    await page.screenshot({ path: join(outDir, `${name}-ERROR-paso${i + 1}.png`) });
    if (!st.optional) { await ctx.close(); await browser.close(); console.error('Revisa el PNG de error y el selector.'); process.exit(1); }
  }
}
await sleep(spec.endDelay ?? 1000);
log('end', null);
const video = page.video();
await ctx.close(); await browser.close();
const out = join(outDir, `${name}.webm`);
await rename(await video.path(), out);
await writeFile(join(outDir, `${name}.json`), JSON.stringify({ name, url: spec.url, viewport: vp, scale,
  size: { w: vp.width, h: vp.height }, duration: +now().toFixed(3), actions }, null, 1));
console.log(`LISTO: ${out.replace(process.cwd() + '/', '')} (${now().toFixed(1)} s, ${actions.length} acciones)`);
