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

**Lo que SÍ:**
- Fondo carbón #232323 con el verde solo como acento puntual
- Grandes números, barras, iconos lineales, formas geométricas planas
- La tipografía construye la jerarquía (headline enorme > subtítulo medio > dato pequeño)
- Mucho espacio negativo

**Lo que NO:**
- Infografías cliché, stock photos, degradados neón, clipart
- El verde dominando o en grandes superficies
- Iconos decorativos sin función · emojis dibujados
- Texto pegado a los bordes · artefactos tipográficos de IA

---

## Aplicación en prompts para ChatGPT

Incluir siempre este bloque en cada prompt:

```
Visual system: dark editorial — solid charcoal background #232323, white text, green #86CA28 as a
SINGLE accent only (never dominant), purple #700962 only when it adds visual tension. Premium magazine
cover / strategic report feel. Designed as a CONCEPT/SCENE, not an infographic: a single main subject
integrated into an editorial scene (render or photographic), asymmetric composition, lots of negative
space. Typography builds the hierarchy: hero word 110–150px black/heavy > headline 26–38px light >
subtitle 18–26px regular. Geometric/humanist sans-serif (Inter, Geist, Satoshi). Lighting with intent.
BRAND FRAME (identical every slide): thin 1px #444444 border ~40px from edge · "Mario Ruiz" + "Founder ·
Globalizame" top-left · counter "01/08" top-right with a green accent line under it.
Ratio 3:4 (portrait), 80px safe padding on all 4 sides.
All text inside the image in Spanish, literal and quoted, exact spelling.
NEGATIVE: no gradients, no neon, no clipart, no generic mockups, no full-bleed photos, no centered
layouts, no decorative geometry, no AI typography artifacts.
```
