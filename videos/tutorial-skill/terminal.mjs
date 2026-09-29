// Terminal real para grabar: ejecuta de verdad los comandos que se escriben y muestra su salida en vivo.
//   node terminal.mjs --cwd ../mi-proyecto [--port 4173] [--title "Claude Code"]
// Luego graba con capture.mjs apuntando a http://localhost:4173 (ver capturas/terminal.capture.example.js).
// Solo escucha en localhost y está pensada para grabar demos: no la dejes abierta ni la expongas.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const cwd = resolve(opt('--cwd', '.')), port = Number(opt('--port', 4173)), title = opt('--title', 'terminal');
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const page = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
html,body{margin:0;height:100%;background:#0d0d10;color:#e8e8ea;font:30px/1.4 "JetBrains Mono",ui-monospace,Menlo,Consolas,monospace}
#t{padding:24px 28px 40px;white-space:pre-wrap;word-break:break-word}
.p{color:#FF4B0B;font-weight:700}.c{color:#fff;font-weight:700}.e{color:#ff8a80}.ok{color:#7ee2a8}.dim{color:#8a8a92}
#row{display:flex;gap:12px;align-items:baseline}#in{flex:1;background:none;border:0;outline:0;color:#fff;font:inherit;font-weight:700;caret-color:#FF4B0B}
</style></head><body><div id="t"><div class="dim">${esc(cwd.split(/[\\/]/).slice(-2).join('/'))}</div></div>
<div id="t2" style="padding:0 30px"><div id="row"><span class="p">$</span><input id="in" autofocus autocomplete="off" spellcheck="false"></div></div>
<script>
const T = document.getElementById('t'), I = document.getElementById('in');
function line(cls, txt) { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = txt; T.appendChild(d); return d; }
I.addEventListener('keydown', async e => {
  if (e.key !== 'Enter' || !I.value.trim()) return;
  const cmd = I.value; I.value = ''; I.disabled = true; document.body.classList.remove('done');
  const h = line('', ''); h.innerHTML = '<span class="p">$ </span><span class="c"></span>'; h.lastChild.textContent = cmd;
  let cur = line('', ''); const r = await fetch('/run', { method: 'POST', body: cmd }); const rd = r.body.getReader(), dec = new TextDecoder();
  for (;;) { const { value, done } = await rd.read(); if (done) break;
    for (const ch of dec.decode(value, { stream: true }).replace(/\\x1b\\[[0-9;]*[A-Za-z]/g, '')) {
      if (ch === '\\n') cur = line('', ''); else if (ch === '\\r') cur.textContent = ''; else cur.textContent += ch;
      if (/^(LISTO|  ✔)/.test(cur.textContent)) cur.className = 'ok'; if (/^(  ✘|✘|Error)/.test(cur.textContent)) cur.className = 'e'; }
    scrollTo(0, document.body.scrollHeight); }
  I.disabled = false; I.focus(); document.body.classList.add('done'); scrollTo(0, document.body.scrollHeight);
});
</script></body></html>`;

createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/run') {
    let cmd = ''; req.on('data', d => cmd += d); req.on('end', () => {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
      const shell = process.platform === 'win32' ? ['powershell.exe', ['-NoProfile', '-Command', cmd]] : ['bash', ['-lc', cmd]];
      const p = spawn(shell[0], shell[1], { cwd, env: { ...process.env, FORCE_COLOR: '0' } });
      p.stdout.on('data', d => res.write(d)); p.stderr.on('data', d => res.write(d));
      p.on('close', () => res.end());
    });
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(page);
}).listen(port, '127.0.0.1', () => console.log(`Terminal en http://localhost:${port} (cwd: ${cwd}). Ctrl+C para cerrar.`));
