# Brand System · Globalizame

## Identidad

**Marca:** Globalizame  
**Tagline:** Tu negocio liberado. Tu tiempo recuperado.  
**Arquetipo:** El Liberador — no vende tecnología, vende autonomía  
**Posicionamiento:** Agencia de automatización e IA para dueños de PYMEs que quieren que su negocio funcione sin depender de ellos

---

## Marco de marca (firma fija, en TODOS los slides)

Va idéntico en cada slide. No se omite nunca:

- **Encuadre** fino 1px gris a ~40px del borde
- **"GLOBALIZAME"** arriba-izquierda (mayúsculas, sans bold, tracking ancho)
- **Contador** "01/08" arriba-derecha
- **Línea de acento verde** #86CA28 bajo el contador
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

**Familia principal:** Sans serif condensada y limpia  
**Uso:**
- Titulares: bold, grande, impacto máximo
- Etiquetas de diagrama: medium, compacta
- Body / copy: regular, legible

**Fuentes recomendadas para prompts ChatGPT:**
- Bebas Neue (titulares de impacto)
- Inter (cuerpo y etiquetas)
- Josefin Sans (titulares alternativos)

---

## Estilo visual

**Mood:** Editorial premium. Limpio. Mucho aire. Profesional sin ser corporativo.  
**Protagonista:** el diagrama / la infografía — no el texto  
**Textura:** opcional — grano sutil sobre fondo para profundidad  
**Elementos:** geométricos, líneas limpias, nada orgánico ni ilustrativo

---

## Formato de slides

**Ratio:** 3:4 (Retrato) — es el vertical que ofrece ChatGPT (Auto / 1:1 / **3:4** / 9:16 / 4:3 / 16:9). No existe 4:5 en ChatGPT.
**Safe zone:** 80px de padding en los 4 bordes. Texto y datos clave nunca pegados al borde.
**Coherencia:** misma paleta, tipografía y malla en todas las slides de una serie.

**Retícula:**
- Marco de marca (firma fija, ver arriba): "GLOBALIZAME" + contador + línea verde
- Cuerpo: headline gigante > subtítulo medio > dato pequeño, con data-viz cuando aporta
- Una idea por slide

**Micro-rótulo en slides intermedios (opcional):** "Desliza →" abajo-derecha.

---

## Voz visual de marca

**Lo que SÍ:**
- Fondos sólidos oscuros con acento verde
- Diagramas con flechas, nodos, flujos
- Tipografía bold en titulares
- Mucho espacio en blanco (o en negro)
- Datos reales como protagonistas

**Lo que NO:**
- Degradados complejos
- Más de 2 colores por slide (fondo + acento)
- Fotografías de stock
- Iconos decorativos sin función
- Texto corrido — solo titulares y micro-etiquetas

---

## Foto de Mario

**Archivo:** `mario-ruiz.jpg`  
**Uso:** slides de autoridad (etapa CONFIAR / BOFU), slide de cierre personal  
**Estilo:** fondo oscuro, camiseta blanca — encaja con el fondo carbón + acento verde  
**Nunca usar en:** slides técnicos, infografías, portadas con datos

---

## Aplicación en prompts para ChatGPT

Incluir siempre este bloque en cada prompt:

```
Visual system: solid dark charcoal background #232323, accent green #86CA28 OR purple #700962
(ONE accent per carousel), white text #FAFAF7. Premium editorial style — Monocle / Bloomberg / Stripe.
Clean, minimal, lots of breathing room. Geometric/humanist sans-serif (Inter, Geist, Satoshi).
Clear hierarchy: giant headline > medium subtitle > small data. Data-viz when it helps
(giant numbers, bars), minimal line icons, flat geometric shapes.
BRAND FRAME (identical every slide): thin 1px grey border ~40px from edge · "GLOBALIZAME" top-left
(uppercase, wide tracking) · counter "01/08" top-right · green accent line under the counter.
Ratio 3:4 (portrait), 80px safe padding on all 4 sides.
All text inside the image in Spanish, exact spelling.
```
