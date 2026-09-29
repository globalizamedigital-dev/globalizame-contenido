// Render determinista fotograma a fotograma del tutorial.
//   node render.mjs salida.mp4          video sin audio (+ sfx.json con los efectos y marcas de voz)
//   node render.mjs --every 1.5         fotos de QA cada 1.5 s → stills/
//   node render.mjs --stills 3,10.5     fotos de QA en esos segundos → stills/
//   node render.mjs --segments          lista los segmentos con su inicio y duración
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = args[0] && !args[0].startsWith('--') ? args[0] : null;
const fps = Number(opt('--fps', 30));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try { const p = join(process.cwd(), decodeURIComponent(req.url.split('?')[0])); const d = await readFile(p);
    res.writeHead(200, { 'content-type': types[extname(p).toLowerCase()] || 'application/octet-stream' }); res.end(d); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', e => console.error('ERROR EN LA PÁGINA:', e.message));
page.on('console', m => { if ((m.type() === 'warning' || m.type() === 'error') && !/Failed to load resource/.test(m.text())) console.error('consola:', m.text()); });
await page.goto(`http://localhost:${server.address().port}/index.html?render=1`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
const D = await page.evaluate(() => window.DURATION);
await writeFile('sfx.json', JSON.stringify(await page.evaluate(() => window.SFX)));
const frame = t => page.evaluate(async t => { await window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, t);

if (args.includes('--segments')) {
  for (const s of await page.evaluate(() => window.SEGMENTS)) console.log(`${String(s.i).padStart(2)} ${s.type.padEnd(7)} ${s.t0.toFixed(2).padStart(6)}s  +${s.dur.toFixed(2)}s  ${s.say}`);
  console.log(`total ${D.toFixed(2)} s`);
} else if (opt('--stills') || opt('--every')) {
  let ts = opt('--stills') ? opt('--stills').split(',').map(Number) : [];
  if (opt('--every')) for (let x = 0.4; x < D; x += Number(opt('--every'))) ts.push(+x.toFixed(2));
  await mkdir('stills', { recursive: true });
  for (const t of ts) await writeFile(join('stills', `t_${t.toFixed(2).padStart(7, '0')}.jpg`), Buffer.from(await frame(t), 'base64'));
  console.log(`fotos: ${ts.length} → stills/  (duración ${D.toFixed(2)} s)`);
} else if (out) {
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium',
    '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.ceil(D * fps);
  for (let i = 0; i < N; i++) {
    const buf = Buffer.from(await frame(i / fps), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % (fps * 5) === 0) process.stdout.write(`\r  render ${(i / fps).toFixed(0)}/${D.toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(`\r  render listo: ${out} (${D.toFixed(2)} s)`);
} else console.log('Uso: node render.mjs salida.mp4 | --every 1.5 | --stills 3,10 | --segments');
await browser.close(); server.close();
