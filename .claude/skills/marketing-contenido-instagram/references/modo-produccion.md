# MODO PRODUCCIÓN

> Director de Arte + Estratega de Contenido Visual de Globalizame. Convierte el tema de la semana
> en un carrusel con consistencia visual absoluta: ilustración cartoon vintage + tipografía potente.
> Loop tipo cadena: los 7 pasos en una sola pasada, sin parar entre ellos.

```
QUÉ TOCA → INVESTIG. LIGERA → DECISIONES → SLIDES+PROMPTS → COPY → GUARDAR → UN SOLO COMMIT
```

**PROHIBIDO** parar a mitad para "entregar" los prompts y preguntar si sigo con el copy.

## Criterio de HECHO
- ☐ `posts/post_listo_[YYYY-MM-DD].md` con los 6-8 prompts + copy completo.
- ☐ Bloque VISUAL SYSTEM idéntico en todos los slides.
- ☐ `registro.md` con el hook rotado.
- ☐ Commit + push a `main` (uno solo).

Si falta la estrategia o la base del mes → avisar: hay que correr antes el MODO INVESTIGACIÓN. No inventar.

---

## PASO 1 · QUÉ TOCA
Lee `estrategia/estrategia_mes.html` y según la fecha de hoy identifica: sprint, día, etapa, título, tipo de CTA, palabra clave.

## PASO 2 · INVESTIGACIÓN LIGERA
3-4 búsquedas WebSearch por si hay un dato más fresco para el título de este post. Si lo hay → úsalo; si no → usa el de `base_[mes].md` o el del título. Filtro: cifra concreta + entendible sin contexto técnico + fuente verificable.

## PASO 3 · DECISIONES AUTOMÁTICAS (lee `registro.md`)
- **HOOK** — siguiente en la rotación: estadística → caso real → provocación → pregunta directa → error común → (repite).
- **ESCENA DEL PERSONAJE** — decídela tú según el tema del slide. Principio: el personaje cartoon traduce la emoción del titular a una metáfora visual física. No ilustres el concepto literal; busca la imagen que haga sentir el problema o el alivio de un vistazo.
  - La escena debe leerse en menos de 1 segundo y reforzar el titular.
  - Exagera la emoción (es cartoon, no foto): frustración, agobio, alivio, confianza, sorpresa.
  - No repitas la misma metáfora de semanas anteriores (mira `registro.md`). Si el último carrusel usó relojes, busca otra cosa.
  - Prioriza metáforas inesperadas sobre las obvias. El reloj y la montaña de papeles son el camino fácil; úsalos solo si de verdad son lo mejor.

## PASO 4 · ESTRUCTURA DEL CARRUSEL (6-8 slides)
- SLIDE 1 — PORTADA: hook potente + "Desliza →". Puro gancho tipográfico con ilustración cartoon vintage en la mitad inferior. Sin infografía de datos.
- INTERMEDIOS — uno por idea: titular grande arriba (serif negro + palabra clave en color), ilustración cartoon abajo reforzando el concepto, subtexto corto bajo el titular.
- ÚLTIMO — CIERRE: mensaje de autoridad Globalizame. Sin CTA. Solo branding.

## PASO 5 · PROMPTS PARA CHATGPT
Un prompt por slide. En INGLÉS, autónomo y completo. Todo el texto dentro de las imágenes en ESPAÑOL. Cada prompt incluye SIEMPRE este bloque idéntico:

```
=== VISUAL SYSTEM — copy this block identically in every slide ===
Format: vertical 4:5, 1080x1350px
Style: editorial cartoon poster. Bold mixed-weight typography as hero, vintage
1940s-1950s cartoon illustration anchoring the lower half. Energetic, punchy,
high scroll-stopping power. Premium but with personality — never corporate-bland.
Background: warm cream textured paper #F0EBE0 — FIXED, identical in every slide.
Palette: black for primary headlines + #00C896 green and #7B4FFF purple as
alternating accent colors for the key italic/emphasis word in each headline.
Orange #F5A623 only for small decorative 4-pointed star accents. No other colors.
Typography: ultra-bold condensed serif for the main headline (1950s editorial
poster weight). Italic serif in the accent color for the emotional/key word.
Clean handwritten-style font for subtext and the swipe indicator. Same families
across all slides.
Fixed layout every slide:
  - Top-left: "0X / 08" counter in a small rounded box + "GLOBALIZAME" small caps
  - Top-right: swipe indicator, handwritten style
  - Hand-drawn horizontal black rule separating headline from subtext
  - Footer: "Globalizame" wordmark, discreet, bottom area
Illustration: ORIGINAL vintage cartoon character (1940s-1950s animation style,
NOT any existing IP or known character), black ink with sepia/cream tones,
occupying the bottom ~40% of frame, expressive face and exaggerated gesture,
suit and tie, interacting with the concept of the slide. Small orange 4-pointed
star accents near the character.
All text inside the image in Spanish.
=================================================================
```

Después del bloque, describe lo concreto de cada slide:
- Portada: titular completo, palabra clave en color, subtexto, escena del personaje, "Desliza →" abajo a la derecha.
- Intermedios: titular, palabra clave en color, subtexto, escena del personaje.
- Cierre: logo Globalizame prominente, mensaje centrado, personaje en tono de autoridad, sin swipe.

Formato de entrega: bloques separados por `─────` con encabezado `SLIDE N — TÍTULO EN ESPAÑOL` y debajo el prompt completo en inglés.

## PASO 6 · COPY DEL POST
Primera persona como Mario. Estilo Isra Bravo: frases cortas, punto y aparte, directo.
- Hook (1-2 frases) · Qué van a ver · Desarrollo (2-4 líneas con dato real)
- CTA según tipo: Recurso ("Comenta [PALABRA] y te mando [recurso].") · Conversación ("Comenta [PALABRA] y te cuento.") · Sin petición (remate o pregunta abierta).
- Pocos hashtags al final. CTA SOLO en el copy, NUNCA en las imágenes.
- Pasar el copy por `humanizer` antes de guardar.

## PASO 7 · GUARDAR Y ACTUALIZAR REGISTRO
Guarda en `posts/post_listo_[YYYY-MM-DD].md`: todos los prompts + copy completo + registro de sesión (sprint, etapa, hook usado).

Actualiza `registro.md`: fecha, sprint, día, etapa, hook usado, título · avanza la rotación de hook al siguiente.

## CIERRE · GIT (un solo commit)
```bash
cd "D:/Globalizame/proyectos/contenido-instagram"
git add -A
git commit -m "feat(post): carrusel [FECHA] — <título del post>"
git push origin main
```

## Reglas duras
- No inventar datos, cifras, nombres ni herramientas.
- Varía el hook y los titulares — nunca iguales semana tras semana.
- Bloque VISUAL SYSTEM idéntico en todos los prompts. Slide de cierre nunca lleva CTA.
- Solo el post de esta semana. Todo autónomo. Suscripción siempre: WebSearch + Write.
```
