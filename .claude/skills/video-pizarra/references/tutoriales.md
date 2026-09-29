# Tutoriales reales (template-tutorial/)

Para guías paso a paso de herramientas de IA (Claude, Claude Code, la API, n8n, etc.) con **pantallas reales**:
grabación de la app, capturas anotadas, zoom automático a cada clic, subtítulos grandes, voz y CTA.

Regla de oro: **todo lo que sale en pantalla pasó de verdad**. Nada de interfaces inventadas, dibujadas o
generadas con IA imitando una app real. Si no se puede grabar, se dice y se busca otra forma (captura que te
pase la persona, documentación pública, su propia grabación).

## Contents
1. Flujo
2. De dónde salen las pantallas (4 vías)
3. Guion de captura (`capturas/<nombre>.capture.js`)
4. Guion del video (`tutorial.js`)
5. Estructura que retiene
6. Voz
7. QA y entrega
8. Privacidad y verdad

---

## 1 · Flujo
1. **Investiga en la fuente oficial** (docs, changelog, página de ayuda) y anota cada paso con su URL. Si algo cambió hace poco, verifícalo en la app, no en tu memoria.
2. **Haz el tutorial de verdad** mientras lo grabas: si un paso no funciona, el video no lo enseña.
3. Escribe el **guion** (una frase de voz por segmento) y enséñaselo a la persona antes de renderizar.
4. `node build.mjs --prep` → `node render.mjs --every 1.4` → `python3 contact.py 6` → mira `contact.jpg`.
5. `node build.mjs <nombre>` → `<nombre>.mp4` (master) y `<nombre>-movil.mp4`.

```bash
cp -r ~/.claude/skills/video-pizarra/template-tutorial ./mi-tutorial && cd mi-tutorial && npm install
cp tutorial.example.js tutorial.js
```
(En este repo la skill vive en `.claude/skills/video-pizarra/`.)

## 2 · De dónde salen las pantallas
| Vía | Cuándo | Cómo |
|---|---|---|
| **A. Grabación automática** (recomendada) | Webs y apps web: docs, consolas, claude.ai, n8n… | `node capture.mjs capturas/x.capture.js`. Cursor visible, pulso en cada clic, desenfoque de datos sensibles y un `.json` con el instante y la caja de cada acción → **zoom automático**. |
| **B. Con sesión iniciada** | La app pide login (claude.ai, Console, Notion…) | En el PC de la persona, una vez: `node capture.mjs --login https://claude.ai claude` → inicia sesión en la ventana, ciérrala. Luego `auth: 'claude'` en la captura. La sesión queda en `~/.config/video-pizarra/auth/` (fuera del repo; nunca se sube). |
| **C. Su propia grabación** | Apps de escritorio, Claude Code en terminal, móvil | OBS / Xbox Game Bar (Win+Alt+R) / QuickTime / grabación del móvil → `capturas/mi.mp4`. `python3 inspeccionar.py capturas/mi.mp4 2` genera una hoja con segundos y rejilla de píxeles para escribir los `zoom` a mano. |
| **E. Terminal real** | Tutoriales de Claude Code, CLI, scripts | `node terminal.mjs --cwd <carpeta>` levanta una terminal en localhost que ejecuta de verdad lo que se escribe; grábala con capture.mjs (`type` + `press Enter` + `waitFor body.done` con `state: 'attached'` + `mark div.ok >> nth=-1`). En el segmento usa `baseZoom: 1.8, focusMaxW: 720` para que el texto se lea. Ejemplo: `videos/tutorial-skill/` del repo. |
| **D. Capturas** | Un resultado, una pantalla de ajustes | PNG en `capturas/` y segmento `shot` con `boxes` numeradas. Los pasos `shot` de la vía A las generan solas. |

Consejos de grabación: viewport **1280×1440** (vertical) o **1600×900** (horizontal); el video se graba a la resolución del viewport (`scale` solo hace más nítidos los PNG de los pasos `shot`); modo claro; idioma de la app igual al del video; una idea por grabación (varias grabaciones cortas > una larga).

Claude en la app de escritorio (computer use / Claude in Chrome) también puede capturar la pantalla real de la persona: úsalo si está disponible, con su permiso.

## 3 · Guion de captura
```js
export default {
  url: 'https://claude.ai/new',
  auth: 'claude',                         // opcional: sesión guardada con --login
  viewport: { width: 1280, height: 1440 }, scale: 1.5,
  blur: ['[data-testid="user-menu-button"]', '.email'],   // se desenfoca en la grabación
  steps: [
    { do: 'click', sel: 'button:has-text("Projects")', label: 'proyectos' },
    { do: 'type', sel: 'div[contenteditable="true"]', text: 'Resume este PDF en 5 puntos', label: 'prompt' },
    { do: 'press', key: 'Enter' },
    { do: 'waitFor', sel: '[data-is-streaming="false"]', label: 'respuesta', zoom: true },   // espera a que Claude termine
    { do: 'mark', sel: '.font-claude-message', label: 'resultado' },                        // zoom sin clic
    { do: 'scroll', y: 600 }, { do: 'hover', sel: 'text=Copiar' }, { do: 'shot', name: 'final' },
  ],
};
```
Pasos: `wait, goto, click, type, press, scroll, hover, mark, waitFor, shot, eval`. Cada uno admite `label` (para callouts), `zoom: false`, `ms` (pausa después) y `optional: true`.
Si un selector falla, se guarda `capturas/<nombre>-ERROR-pasoN.png`: ábrela, corrige el selector y repite. Los selectores de apps reales cambian: busca con `getByRole`/texto visible antes que con clases.

## 4 · Guion del video (`tutorial.js`)
Segmentos (cada uno dura lo que su frase `say` + un respiro, o `dur`):
- `title` — `kicker`, `title` (con `*énfasis*`), `sub`.
- `screen` — `src` (webm/mp4), `from`/`to` (segundos del clip), `speed` (1.2–1.6 quita esperas), `step`, `title`, `callouts: { label: 'texto' }`, `zoom: 'auto' | false | [{ at, rect: [x,y,w,h], hold }]`, `baseZoom` (1.6 por defecto: nunca enseña la página entera diminuta), `zoomMax`, `crop: [x,y,w,h]` (encuadre fijo, p. ej. para mostrar un video 9:16 ya renderizado), `focusMaxW` (ancho máximo del zoom en px, para líneas largas de terminal), `host` (texto de la barra de la ventana).
- `shot` — `src` (png), `boxes: [{ at, rect, label, hold }]`, `numbered: true`.
- `list` — `title`, `items`, `bad: true` para errores (✕ rojas).
- `text` — frase grande (`text`, `sub`).
- `cta` — `word` (palabra a comentar), `sub`, `pre`.
Globales: `format`, `totalSteps`, `brand { bg, bg2, ink, accent, handle }`, `captions: false` para quitar subtítulos.
`node render.mjs --segments` muestra inicio y duración de cada segmento.

## 5 · Estructura que retiene (Reels / Shorts de 30–75 s)
1. **Resultado primero (0–3 s)**: enseña lo que va a conseguir o el dolor ("En 60 s haces X", "Deja de hacer Y a mano"). Nunca "Hola, hoy vamos a ver…".
2. **Promesa concreta**: número de pasos y tiempo ("3 pasos", "sin programar").
3. **Pasos**: uno por segmento, `PASO n / N`, verbo en imperativo en el título ("Crea el proyecto", no "Creación del proyecto"). Algo cambia en pantalla cada 1–2 s: zoom, clic, callout, subtítulo.
4. **Errores típicos o truco extra**: es lo que se guarda y comparte.
5. **CTA con recurso real** (guía, plantilla, prompt): solo prometes lo que existe o vas a crear (`lead-magnet`).
Largo: 30–45 s para una función, 60–90 s para un flujo completo; si pasa de 90 s, divídelo en serie (Parte 1/2).
Para YouTube (16:9, 3–10 min): mismo motor con `format: '16:9'`, capítulos con `title` y más `screen` largos a `speed: 1`.

## 6 · Voz
- **Su propia voz** es lo mejor para marca personal: graba cada frase en `audio/propia/01.wav`, `02.wav`… (móvil, en un cuarto sin eco). `vo.py` la recorta, la nivela y ajusta el video a su duración.
- Sin grabación: voz sintética local con Piper (`./instalar.sh --voz`). Sirve para borradores; avisa de que suena artificial.
- Escribe como se habla: frases de 8–15 palabras, números en letra si el TTS los lee mal ("punto ts", "npx tsx").

## 7 · QA y entrega
- Mira `contact.jpg` entera: texto legible a tamaño móvil, zoom sobre lo que dice la voz, nada importante bajo los subtítulos ni en los bordes (UI de Reels), sin datos personales visibles.
- `node render.mjs --stills 12.3,12.8` alrededor de cada zoom dudoso.
- Entrega la versión móvil, el guion y un caption con los pasos por escrito + enlace a la fuente oficial.

## 8 · Privacidad y verdad
- `blur` para correos, nombres, claves API, facturación, conversaciones privadas. Revisa cada fotograma de QA buscando datos sensibles antes de publicar.
- Nunca grabes ni muestres una clave real: usa una de prueba o desenfócala.
- Si la función es de un plan de pago o está en beta, dilo en pantalla.
- Cifras, precios y límites: solo con fuente oficial y fecha, en el caption.
