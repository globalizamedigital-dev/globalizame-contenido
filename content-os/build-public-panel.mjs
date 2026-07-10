import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'content-os');
const target = path.join(root, 'dist-panel');
const state = JSON.parse(await readFile(path.join(source, 'state', 'state.json'), 'utf8'));

await rm(target, { recursive: true, force: true });
await mkdir(path.join(target, 'assets'), { recursive: true });

let html = await readFile(path.join(source, 'app', 'index.html'), 'utf8');
html = html
  .replaceAll('/content-os/app/styles.css', './styles.css')
  .replaceAll('/content-os/app/mobile.css', './mobile.css')
  .replaceAll('/content-os/app/app.js', './app.js')
  .replace(/<button id="run"[\s\S]*?<\/button>/, '<span class="count">Panel público · solo lectura</span>');

await writeFile(path.join(target, 'index.html'), html);
await copyFile(path.join(source, 'app', 'styles.css'), path.join(target, 'styles.css'));
await copyFile(path.join(source, 'app', 'mobile.css'), path.join(target, 'mobile.css'));

const publicRuns = [];
for (const run of state.runs ?? []) {
  const runDir = path.join(target, 'assets', run.id);
  const outputDir = path.join(root, 'outputs', run.id);
  await mkdir(runDir, { recursive: true });
  const slides = [];
  const slideFiles = (await readdir(path.join(outputDir, 'final'))).filter((name) => name.endsWith('.png')).sort();
  for (const [index, slide] of slideFiles.entries()) {
    const name = `slide-${String(index + 1).padStart(2, '0')}.png`;
    await copyFile(path.join(outputDir, 'final', slide), path.join(runDir, name));
    slides.push(`./assets/${run.id}/${name}`);
  }
  const files = {};
  for (const [key, input] of Object.entries({
    copy: run.artifacts?.instagram,
    qa: run.artifacts?.qa,
    contactSheet: 'contact-sheet-final.png',
  })) {
    if (!input) continue;
    const ext = path.extname(input) || '.txt';
    const name = `${key}${ext}`;
    await copyFile(path.join(outputDir, input), path.join(runDir, name));
    files[key] = `./assets/${run.id}/${name}`;
  }
  publicRuns.push({ ...run, topic: run.title, finalSlides: slides, ...files });
}

await writeFile(path.join(target, 'state.json'), JSON.stringify({ ...state, runs: publicRuns }, null, 2));

await copyFile(path.join(source, 'public-app.js'), path.join(target, 'app.js'));
console.log(`Panel público creado en ${target} con ${publicRuns.length} publicaciones.`);
