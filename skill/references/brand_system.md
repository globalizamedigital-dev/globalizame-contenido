# Brand System · Globalizame

## Identidad

**Marca:** Globalizame  
**Tagline:** Tu negocio liberado. Tu tiempo recuperado.  
**Arquetipo:** El Liberador — no vende tecnología, vende autonomía  
**Posicionamiento:** Agencia de automatización e IA para dueños de PYMEs que quieren que su negocio funcione sin depender de ellos

---

## Marco de marca (firma fija, en TODOS los slides)

Va idéntico en cada slide. No se omite nunca. Es la marca personal de **Mario Ruiz** (Globalizame detrás):

- **Marco** fino 1px color **#444444**, separado ~40px del borde
- **Arriba-izquierda:** "Mario Ruiz" · debajo "Founder · Globalizame"
- **Arriba-derecha:** contador "01/08" · debajo una **línea verde** #86CA28
- Sin icono, sin globo, sin segundo logo abajo. El titular es el héroe, no el chrome.

---

## Paleta de color

Paleta corta a propósito. Cada tono tiene un trabajo.

| Nombre | Hex | Uso |
|---|---|---|
| Negro carbón | #232323 | Fondo principal — fijo en toda la serie |
| Blanco | #FAFAF7 | Texto sobre el fondo |
| Verde | #86CA28 | Acento de acción — palabra que resuelve |
| Morado | #700962 | Acento de giro — lo no-obvio, el reencuadre |

**Regla:** UN acento por pieza (verde o morado), elegido por la emoción del tema y mantenido en toda la serie. Se alterna el acento **entre** piezas para dar variedad al feed; nunca **dentro** del mismo carrusel. El fondo carbón no cambia entre slides ni entre piezas de la misma serie.

---

## Tipografía

**Familia:** sans-serif moderna geometric/humanist. **Solo estas (las del system prompt):**
- **Inter · Geist · Satoshi · Söhne**

**Uso (la escala construye la jerarquía):**
- Headline enorme: bold/black, impacto máximo
- Subtítulo: medium
- Dato / pie: regular, pequeño

---

## Estilo visual

**Mood:** Editorial premium tipo Monocle / Bloomberg / Stripe. Mucho aire. Profesional sin ser corporativo.  
**Protagonista:** el dato y la jerarquía tipográfica — headline enorme > subtítulo medio > dato pequeño  
**Recursos gráficos:** data visualization, grandes números, barras, iconos lineales, formas geométricas planas

---

## Formato de slides

**Ratio:** 4:5 (Retrato) — 1080×1350 px. Es el estándar del sistema (el que mejor ocupa el feed de IG). ChatGPT no tiene 4:5 nativo (da Auto / 1:1 / 3:4 / 9:16 / 4:3 / 16:9): genera en **3:4** y reencuadra/exporta a 4:5, o usa una herramienta con 4:5 directo. El entregable final es siempre 4:5 (1080×1350).
**Safe zone:** 80px de padding en los 4 bordes. Texto y datos clave nunca pegados al borde.
**Coherencia:** misma paleta, tipografía y malla en todas las slides de una serie.

**Retícula:**
- Marco de marca (firma fija, ver arriba): "Mario Ruiz" / "Founder · Globalizame" + contador + línea verde
- Cuerpo: headline enorme > subtítulo medio > dato pequeño, con data-viz/número grande cuando aporta
- Una idea por slide

**Micro-rótulo en slides intermedios (opcional):** "Desliza →" abajo-derecha.

---

## Voz visual de marca

Editorial premium tipo Monocle / Bloomberg / Stripe. Jerarquía tipográfica muy clara y data-viz limpia. Mucho aire.

> **Ningún slide es solo texto sobre fondo plano** (system prompt §6). Cada slide lleva su elemento visual editorial o su tratamiento tipográfico real. El visual cuenta la idea; no ilustra literalmente la palabra del titular.

**Lo que SÍ:**
- Fondo carbón #232323 con el verde solo como acento puntual
- Elementos editoriales: data-viz (números gigantes, barras), iconos line minimal, formas geométricas planas
- La tipografía construye la jerarquía (headline gigante > subtítulo medio > dato pequeño)
- Mucho aire

**Lo que NO:**
- Slides compuestas únicamente por texto sobre fondo plano
- Infografías cliché, stock photos, degradados neón, clipart
- El verde dominando o en grandes superficies
- Iconos decorativos sin función · emojis dibujados
- Texto pegado a los bordes · artefactos tipográficos de IA

---

## Aplicación en prompts para ChatGPT

Incluir siempre este bloque en cada prompt:

> El esqueleto canónico del prompt (`[ESCENA]`/`[ELEMENTOS]`/`[TEXTO EN IMAGEN]`/`[ESTILO]`/`[CONSTRAINTS]`) está en system prompt §8. Bloque de estilo resumido:

```
Visual system: dark editorial premium (Monocle / Bloomberg / Stripe) — solid charcoal background
#232323, white text, green #86CA28 as a SINGLE accent only (never dominant), purple #700962 for detail.
No slide is plain text on a flat background. Lots of negative space, clear hierarchy: huge headline >
medium subtitle > small data. Recursos: data-viz, big numbers, bars, line icons, flat geometric shapes.
Geometric/humanist sans-serif (Inter, Geist, Satoshi).
BRAND FRAME (identical every slide): thin 1px #444444 border ~40px from edge · "Mario Ruiz" + "Founder ·
Globalizame" top-left · counter "01/08" top-right with a green accent line under it.
Ratio 3:4 (portrait) — ChatGPT format, 80px safe padding on all 4 sides.
All text inside the image in Spanish, literal and quoted, exact spelling.
NEGATIVE: no gradients, no neon, no clipart, no stock photos, no AI typography artifacts.
(A single hero object MAY be a realistic 3D render floating on the carbon background — an editorial
still life; everything else stays flat/editorial.)
```
