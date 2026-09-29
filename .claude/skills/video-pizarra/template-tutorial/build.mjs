// Tubería completa del tutorial (funciona igual en Windows, Mac y Linux):
//   node build.mjs --prep        solo prepara fotogramas de las grabaciones y la voz (para QA con render.mjs --every)
//   node build.mjs <nombre>      prep → voz → render → efectos + música + voz → <nombre>.mp4 y <nombre>-movil.mp4
// Música: pon audio/music.mp3 (con derechos) o genera una base con: python3 beat.py 90
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PY = process.platform === 'win32' ? 'python' : (existsSync('.venv/bin/python') ? '.venv/bin/python' : 'python3');
const run = (cmd, a, o = {}) => { const r = spawnSync(cmd, a, { stdio: o.capture ? 'pipe' : 'inherit', encoding: 'utf8', env: { ...process.env, ...(o.env || {}) } });
  if (r.status !== 0) { console.error(`✘ falló: ${cmd} ${a.join(' ')}\n${r.stderr || ''}`); process.exit(1); } return r.stdout; };
const probe = f => JSON.parse(run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', f], { capture: true }));

const cfg = (await import(pathToFileURL(join(process.cwd(), 'tutorial.js')).href + '?' + Date.now())).default;
const FPS = cfg.fps || 30;

// 1 · fotogramas de cada grabación (JPG por fotograma: seek exacto y sin depender de códecs del navegador)
for (const s of cfg.segments.filter(s => s.type === 'screen')) {
  if (!existsSync(s.src)) { console.error(`✘ no existe ${s.src}`); process.exit(1); }
  const name = basename(s.src, extname(s.src)), dir = join('capturas', '.frames', name), info = join(dir, 'info.json');
  if (existsSync(info) && statSync(info).mtimeMs > statSync(s.src).mtimeMs) continue;
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  console.log(`· fotogramas de ${s.src}`);
  run('ffmpeg', ['-v', 'error', '-i', s.src, '-vf', `fps=${FPS},scale='min(iw,2560)':-2`, '-q:v', '3', join(dir, 'f_%05d.jpg')]);
  const p = probe(s.src), count = readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
  const w = p.streams[0].width, h = p.streams[0].height, sc = Math.min(1, 2560 / w);
  writeFileSync(info, JSON.stringify({ name, fps: FPS, count, w: Math.round(w * sc), h: Math.round(h * sc) & ~1, duration: count / FPS, scale: sc }));
  if (sc < 1) console.log(`  (reescalado ×${sc.toFixed(2)}: las cajas de zoom del .json se ajustan solas)`);
}

// 2 · voz en off (Piper o tu propia voz en audio/propia/NN.wav)
const lines = cfg.segments.map((s, seg) => s.say ? { seg, text: s.say } : null).filter(Boolean);
if (lines.length) { mkdirSync('audio', { recursive: true }); writeFileSync('audio/lines.json', JSON.stringify(lines, null, 1)); run(PY, ['vo.py']); }
const name = process.argv[2];
if (!name || name === '--prep') { console.log('Prep listo. QA: node render.mjs --every 1.5 && python3 contact.py 6'); process.exit(0); }

// 3 · video + audio
run('node', ['render.mjs', `_${name}-mudo.mp4`]);
const D = String(Number(probe(`_${name}-mudo.mp4`).format.duration));
const music = existsSync('audio/music.mp3') ? ['audio/music.mp3'] : [];
run(PY, ['sfx_mix.py', D, `audio/_${name}-fx.wav`, ...music], { env: { MUSIC_GAIN: process.env.MUSIC_GAIN || '0.22', SFX_GAIN: process.env.SFX_GAIN || '0.5' } });
if (lines.length) run(PY, ['vo_mix.py', `audio/_${name}-fx.wav`, `audio/_${name}-mix.wav`]);
const mix = lines.length ? `audio/_${name}-mix.wav` : `audio/_${name}-fx.wav`;
run('ffmpeg', ['-y', '-v', 'error', '-i', `_${name}-mudo.mp4`, '-i', mix, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '44100',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', `${name}.mp4`]);
run('ffmpeg', ['-y', '-v', 'error', '-i', `${name}.mp4`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-maxrate', '4M', '-bufsize', '8M',
  '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', `${name}-movil.mp4`]);
rmSync(`_${name}-mudo.mp4`, { force: true });
const mb = f => (statSync(f).size / 1e6).toFixed(1) + ' MB';
console.log(`LISTO: ${name}.mp4 (${mb(`${name}.mp4`)}) · ${name}-movil.mp4 (${mb(`${name}-movil.mp4`)}) · ${Number(D).toFixed(1)} s`);
