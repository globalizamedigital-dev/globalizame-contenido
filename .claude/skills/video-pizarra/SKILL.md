---
name: video-pizarra
description: Crea videos cortos potentes para marca personal sobre IA — TUTORIALES REALES paso a paso con grabación de pantalla y capturas auténticas de la app (Claude, Claude Code, la API, n8n…) con zoom automático a cada clic, subtítulos, voz y CTA; videos explicativos animados estilo pizarrón con mascota; y estilos editoriales (acuarela, cuaderno, minimal). Renderiza MP4 vertical u horizontal con voz en off, música y efectos. Úsalo cuando alguien pida "un tutorial de X", "una guía paso a paso en video", "graba la pantalla de…", "video con capturas", "enséñame a usar X en un reel", "un video animado", "video tipo pizarrón", "video explicativo", "reel sobre [herramienta/noticia de IA]", o quiera explicar una herramienta, noticia o concepto en video corto sin grabarse, aunque no diga "pizarrón".
---

# video-pizarra

## Elige el modo

| La persona quiere… | Modo | Carpeta |
|---|---|---|
| Enseñar a usar una herramienta (Claude, API, n8n…) paso a paso | **Tutorial real**: grabación de pantalla + capturas anotadas + zoom automático | `template-tutorial/` → lee `references/tutoriales.md` |
| Explicar una noticia, un concepto o una opinión con ritmo y humor | **Pizarrón** animado con mascota | `template/` (flujo abajo) |
| Algo más editorial/limpio | **Estilos** (acuarela, cuaderno, minimal) | `template-estilos/` |
| Noticia + demo | Pizarrón para el hook/contexto y tutorial para la demo; se unen con ffmpeg (`concat`) | ambos |

## Reglas de un video potente (valen para los tres modos)
1. **Hook en 1 s**: resultado, número o tensión ("Vale 10.000 M$", "En 60 s haces X"). Nada de saludos.
2. **Algo cambia cada 1–2 s**: zoom, sello, clic, subtítulo, corte. Escenas de 2–5 s.
3. **Voz + subtítulos grandes** (la mayoría ve sin sonido). Voz propia > voz sintética.
4. **Datos verificados con fuente y fecha**; si una fuente es más nueva que el material de la persona, usa la nueva y díselo. Lo que no se pueda verificar no sale en pantalla.
5. **Pantallas reales**: nunca dibujes ni generes una interfaz que imite una app real; grábala o captúrala.
6. **CTA honesto**: comentar una palabra a cambio de un recurso que existe o se va a crear. No prometas invitaciones, descuentos o accesos que la persona no tenga.
7. **Aviso cuando toque** (beta, plan de pago, permisos/privacidad): una línea, sin dramatizar.
8. Marca personal: pide una vez su @usuario, colores y si usará su voz; guárdalo en `brand` del proyecto.

Rutas: la skill puede estar en `~/.claude/skills/video-pizarra` o en `.claude/skills/video-pizarra` del proyecto; usa la carpeta real ("Base directory") donde abajo dice `~/.claude/skills/video-pizarra`.

Antes de la primera vez corre `instalar.sh` (revisa Node, Python con numpy/Pillow, ffmpeg y Chromium; con `--instalar` instala lo que falte; con `--voz` añade la voz local Piper). Si Chromium de Playwright vive en otra ruta, exporta `CHROME_PATH`.

Convierte cualquier tema en un video animado de ~60–75 s que se siente dibujado a mano: una mascota que actúa, frases escritas en vivo, cada escena con su propio fondo y herramienta, transiciones que conectan una escena con la siguiente y caen en el beat de la música.

Todo el motor ya está hecho en `template/`. Tu trabajo es **entender bien el video que la persona quiere**, escribir una historia clara y construir las escenas con el API del motor. No reescribas el motor.

## Todo se puede personalizar (no le digas "no se puede")

El skill es un punto de partida, no un molde. Si la persona pide algo que no viene de fábrica, adáptalo: cambia la configuración, edita el estilo o escribe una escena nueva con el API del motor. Lo único que no negocias es la calidad (texto legible, datos reales, QA antes de entregar).

| Quiere… | Pizarrón (`template/`) | Estilos (`template-estilos/`) |
|---|---|---|
| Colores de su marca | `palette` y `hatches` en la config | `palette: { accent: '#hex', bg: '#hex' }` |
| Su tipografía | fuentes en `engine-api.md` | `font: { display: 'Bebas Neue', body: 'Poppins' }` (cualquier fuente de Google Fonts) |
| Su mascota o personaje | `mascotShape` (silueta propia) o `image()` con su PNG | `mascot: 'clawd' \| 'bot' \| 'blob'`, `mascotColor: '#hex'`, o su logo/personaje: `mascot: { image: 'assets/logo.png' }` |
| Salir él/ella | — | `person: { photo }` (`cutout.py foto.jpg`) o personaje dibujado con su `look` |
| Sus imágenes, logos, capturas | `image()` | escenas `media`, `sticker`, `shotCard` (ver `references/historia.md`) |
| Formato / duración | 9:16 o 16:9, cualquier duración | igual |
| Su voz, su música o nada | `audio/vo.wav`, `audio/music.mp3`, Suno o sin música | igual; si se grabó a cámara, `componer.sh` |
| Otro idioma | textos y `say` en su idioma | igual |
| Un look que no está | ajusta el estilo más cercano (fondo, trazos, colores, tipografía) | copia el estilo más cercano en `styles/` y modifícalo |
| Mezclar | — | `style` por escena; pizarrón y estilos se pueden unir con ffmpeg |

## Modo estilos (acuarela · cuaderno · minimal)

Además del pizarrón, el skill trae `template-estilos/`: otro motor por código (canvas) con 4 estilos listos — `acuarela` (papel de acuarela, tinta que hierve), `acuarela-viva` (acuarela con naranja/negro/blanco/rojo y mascota que resalta), `cuaderno` (bullet journal con marcatextos) y `minimal` (blanco premium). Úsalo cuando la persona pida uno de esos looks o un video más "limpio/editorial" que el pizarrón. Muéstrale `catalogo-estilos/` para elegir.

- Se escribe como una lista de escenas (`hook, statement, chapter, list, stat, compare, quote, media, steps, cta`) en `video.js`; guía completa en `references/guion-estilos.md`.
- Persona: su foto (`python3 cutout.py foto.jpg`) o un personaje dibujado con su look (piel, pelo, peinado, lentes, barba).
- Se pueden mezclar estilos en un mismo video poniendo `style` en cada escena.
- **Modo historia** (recomendado para intros e historias): mascota continua, cámara que la sigue, transiciones dentro de la historia y un lápiz que dibuja en vivo. Lee `references/historia.md` y parte de `template-estilos/historia.example.js`.
- **Si la persona ya se grabó a cámara**: su video es la base y la animación va encima solo en los tramos animados (`anclas.py` → `timing.js` → `./componer.sh aroll.mov nombre`). Ver "Si la persona se grabó a cámara" en `references/historia.md`.
- Antes de mostrar un borrador repasa `references/errores.md` (errores reales que ya cometimos: sensación de presentación, escenas saturadas, mismo layout, nombres de terceros, etc.).
- Pasos: `cp -r template-estilos ./proyecto && cd proyecto && npm install && npx playwright install chromium && python3 -m venv .venv && .venv/bin/pip install numpy pillow` → `node render.mjs --scenes` (QA, mira las imágenes) → `python3 suno_music.py "<prompt>" "<título>" audio/music.mp3` (opcional) → `./build.sh <nombre>`.

## Flujo (pizarrón)

1. **Entrevista** (no te la saltes: es lo que separa un video bueno de uno genérico)
2. **Investigar y verificar datos**
3. **Storyboard → aprobación**
4. **Construir `scenes.js`**
5. **QA visual con capturas**
6. **Música, beats, efectos y render final**
7. **Entregar + caption**

---

## 1 · Entrevista

**Adapta la entrevista a lo que ya te dieron.** Si el pedido trae tema, formato y tono (por ejemplo, un prompt copiado de un tutorial), no hagas la entrevista completa: decide lo que falte con defaults sensatos, muestra un resumen de 5 líneas y arranca. Pregunta solo lo que de verdad cambie el video (datos que no puedes verificar, su marca, su CTA). Si dice "hazlo directo", no preguntes nada.

Usa la herramienta de preguntas (máx. 4 por tanda, cada una con opción recomendada primero). Si la persona ya respondió algo en su mensaje, no lo vuelvas a preguntar. Pregunta en el idioma del usuario.

**Tanda 1 — el contenido**
- **Tema y la UNA idea** que el espectador debe llevarse. ¿Hay links, artículos, notas o datos que el video deba usar? (Pídelos: los datos correctos importan más que la animación.)
- **Formato**: vertical 9:16 para Reels/TikTok/Shorts (recomendado) u horizontal 16:9 para YouTube.
- **Duración**: 45–60 s, 60–75 s (recomendado para explicar algo) o 90 s.
- **Tono y público**: divertido/cercano, serio/profesional, épico. ¿Para quién es?

**Tanda 2 — lo visual**
- **Personaje**: la mascota por defecto (un bicho cuadrado con bracitos), su propia mascota o marca, o sin mascota. ¿Quiere un segundo personaje humano que represente al espectador?
- **Imágenes de referencia**: pide explícitamente capturas de estilos que le gusten, su mascota/logo, colores de marca o un video de referencia. Léelas con Read y describe qué vas a tomar de cada una antes de seguir.
- **Colores / marca**: ¿paleta propia? ¿Debe llevar logo o nombre (o explícitamente NO)?
- **Idioma** del texto en pantalla.

**Tanda 3 — sonido y cierre**
- **Música**: generar con Suno (necesita `SUNO_API_KEY` de sunoapi.org), usar un mp3 propio (que lo ponga en `audio/music.mp3`) o sin música (solo efectos).
- **CTA final**: seguir + comentar (default para alcance), link en bio, producto/servicio, o ninguno.
- **Hook**: propón 2–3 hooks concretos para ESTE tema (ver `references/storytelling.md`) y deja que elija.

Cierra con un **resumen**: lo que respondió vs. lo que tú decidiste por defecto, en dos grupos separados. Si corrige algo, vuelve a mostrar el resumen antes de seguir.

## 2 · Investigar y verificar

- Si el tema es noticia o tiene cifras, busca fuentes (WebSearch/WebFetch) y anota cada dato con su fuente.
- Solo pon en pantalla datos que aparecen en las fuentes. **No calcules ni inventes cifras derivadas** (p. ej. "precio anterior" deducido de un porcentaje). Si un dato solo viene de medios secundarios, díselo a la persona.
- Guarda las fuentes: las necesitarás para el caption.

## 3 · Storyboard → aprobación

Lee `references/storytelling.md` y escribe `STORYBOARD.md` en la carpeta del proyecto: una tabla con, por escena, **fondo · herramienta · texto en pantalla · qué hace el personaje · transición de salida**. Muéstrale a la persona un resumen corto (una línea por escena) y **espera su aprobación** antes de animar — salvo que haya pedido hacerlo directo: entonces muéstralo y sigue. Cambiar un storyboard cuesta minutos; cambiar un video, horas.

Reglas que vienen de lo que ya funcionó (y de lo que no):
- **Hook en el primer segundo.** La primera frase aparece en ~0.2 s. Nada de intros lentas ni escenas de "contexto" antes del hook.
- **El texto explica, el personaje actúa.** Cada escena tiene un titular grande y claro arriba + una línea de apoyo. Los gags visuales refuerzan el texto; nunca lo reemplazan (un video "solo con acciones" no se entiende).
- **Una idea por escena**, en orden de historia: hook → revelación → problema → giro → pruebas → twist/cierre → CTA.
- **Fondos distintos** por escena y **herramienta distinta** (plumón, gis, pluma, lápiz, pincel) — y varias escenas **sin** herramienta (el texto rebota, se teclea o se estampa).
- **Transiciones motivadas y rápidas** (0.4–0.8 s): algo de la escena causa el paso a la siguiente (entrar al ojo, borrar, algo cae, una barra se expande, un círculo de tinta, algo revienta, la tarjeta se voltea, destello). No repitas la misma transición seguida.

## 4 · Construir

```bash
PROJ=~/Documents/<slug-del-video>      # o la carpeta que pida la persona
mkdir -p "$PROJ/audio" && cp -R ~/.claude/skills/video-pizarra/template/. "$PROJ/"
cd "$PROJ" && npm install && npx playwright install chromium
cp scenes.example.js scenes.js           # punto de partida: el ejemplo completo
```

Antes de escribir escenas, lee **`references/engine-api.md`** (API completo, coordenadas, transiciones, personajes, sonidos) y revisa `scenes.example.js`: es un video real terminado con todos los patrones. Reescribe `scenes.js` para el nuevo tema siguiendo el storyboard.

- Formato horizontal: `bootVideo(build, { width: 1920, height: 1080 })` y recalcula posiciones.
- Mascota propia: define su silueta con `mascotShape` (ver engine-api) a partir de la imagen de referencia; dibújala con formas simples (cuerpo, brazos, piernas, ojos) para que pueda actuar. Si es muy compleja, usa `image()` con un PNG transparente y anímala como bloque.
- Colores de marca: `palette` y `hatches` en la config.
- Previsualiza en vivo con `npx serve .` (o cualquier servidor estático) y abre `index.html`.

## 5 · QA visual (obligatorio antes del render final)

```bash
node render.mjs --every 1.2 && python3 contact.py 10    # hoja de contacto de todo el video
```
Abre `contact.jpg` con Read. Revisa: texto cortado o encimado, personajes tapando texto, escenas en negro/vacías, elementos fuera de cuadro, legibilidad en teléfono. Para las transiciones: `node render.mjs --stills 12.1,12.3,12.5` alrededor de cada una. Corrige y vuelve a revisar. Los errores típicos y sus soluciones están en `references/lessons.md` — léelo si algo se ve raro.

## 6 · Música, beats, efectos y render

- **Suno** (si hay key): `python3 suno_music.py "<estilo>" "<título>" audio/music.mp3` (instrumental, 100–120 BPM, pulso claro, acorde al tono).
- **Beats**: `python3 -m venv .venv && .venv/bin/pip install librosa && .venv/bin/python beats.py audio/music.mp3` → `audio/beats.json`. Con esto las transiciones caen en golpes fuertes y la cámara se sacude en los acentos. Sin música, sáltalo.
- **Render final**: `./build.sh <nombre>` → `<nombre>.mp4` (master) + `<nombre>-movil.mp4` (<30 MB, para mandar por chat/teléfono). Incluye efectos de sonido sintetizados, subida de música en transiciones y volumen normalizado a −14 LUFS.

El render tarda ~3–5 min por minuto de video. Córrelo en segundo plano y avisa a la persona.

### Voz en off y música sin Suno (pizarrón)
- `template/beat.py 60` crea una base rítmica propia (128 BPM, sin derechos) en `audio/music.mp3` + `audio/beats.json` para que las transiciones caigan en el beat.
- Voz: en `scenes.js` marca dónde entra cada frase con `sfx('vo_N', a)` (N = número de frase) y ajusta cada escena a `duración de la frase / speed + 0.35`. Genera las frases con Piper o grábalas, escribe `audio/vo.json` (`[{file, dur, text}]`) y mezcla con `vo_mix.py` (baja la música mientras se habla). Ejemplo completo: `videos/instinct-ai/` del repo (`vo.py`, `build-vo.sh`).

## 7 · Entregar

- Entrega la versión móvil (y dónde está el master). Si la persona está en otro dispositivo, envíala como archivo.
- Resume en 3–5 líneas qué tiene el video (historia, escenas clave).
- Ofrece un **caption** con información **extra** que no está en el video (contexto, detalles para devs, detrás de cámaras), con CTA de comentario y hashtags, más una nota de qué datos vienen de qué fuente.
- Si pide cambios, edita `scenes.js` y vuelve a QA → build. Mantén copias `scenes_vN.js` por versión.
