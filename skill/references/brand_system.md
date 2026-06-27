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

**Ratio:** 3:4 (Retrato) — es el vertical que ofrece ChatGPT (Auto / 1:1 / **3:4** / 9:16 / 4:3 / 16:9). No existe 4:5 en ChatGPT.
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

> **El concepto visual de cada slide lo decides como director de arte** — repertorio y criterio en system prompt §5.6 (no se repite aquí). Representa la idea, nunca la palabra literal del titular.

**Lo que SÍ:**
- Fondo carbón #232323 con el verde solo como acento puntual
- Concepto visual elegido con criterio: tipografía-héroe, gran número/data-viz, objeto icónico, escena, personaje, famoso/meme, metáfora inesperada (§5.6)
- La tipografía construye la jerarquía (headline enorme > subtítulo medio > dato pequeño)
- Variedad entre slides · mucho espacio negativo

**Lo que NO:**
- **Ilustrar la palabra literal del titular** (la "correa" dibujada porque el copy dice correa)
- Repetir el mismo recurso en slides seguidos
- Infografías cliché, stock photos, degradados neón, clipart
- El verde dominando o en grandes superficies
- Iconos decorativos sin función · emojis dibujados
- Texto pegado a los bordes · artefactos tipográficos de IA

---

## Aplicación en prompts para ChatGPT

Incluir siempre este bloque en cada prompt:

> El esqueleto canónico del prompt (con `[DIRECCIÓN DE ARTE]` al frente) está en system prompt §7. Bloque de estilo resumido:

```
Visual system: dark editorial premium (Monocle / Bloomberg / Stripe) — solid charcoal background
#232323, white text, green #86CA28 as a SINGLE accent only (never dominant), purple #700962 for detail.
The visual concept conveys the IDEA, never the literal word of the headline. Lots of negative space,
clear hierarchy: huge headline > medium subtitle > small data. Recursos: data-viz, big numbers, bars,
line icons, flat geometric shapes, hero typography. Geometric/humanist sans-serif (Inter, Geist, Satoshi).
BRAND FRAME (identical every slide): thin 1px #444444 border ~40px from edge · "Mario Ruiz" + "Founder ·
Globalizame" top-left · counter "01/08" top-right with a green accent line under it.
Ratio 3:4 (portrait), 80px safe padding on all 4 sides.
All text inside the image in Spanish, literal and quoted, exact spelling.
NEGATIVE: no gradients, no neon, no clipart, no stock photos, no photorealistic photography or realistic
3D renders, no generic mockups, no AI typography artifacts.
```
