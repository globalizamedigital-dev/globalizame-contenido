---
name: productor
description: Director de Arte de Globalizame (Mario Ruiz). Produce el carrusel de la semana en una sola pasada a partir del brief del mes (skill investigador). Genera estilo editorial premium (Monocle/Bloomberg/Stripe, fondo carbón #232323 + acento verde, ratio 3:4) para Instagram Y LinkedIn: estrategia + copy slide a slide + un prompt de imagen por slide (para pegar en ChatGPT) + copy de cada red + mensaje de respuesta al comentario + DM + hashtags. NO genera imágenes, solo prompts. Activa cuando el usuario diga "genera el carrusel de la semana", "produce el post", "el carrusel de esta semana", "productor" o pida el post semanal. Requiere la estrategia del mes (skill investigador). Entregable: carpeta posts/post_[YYYY-MM-DD]_[slug]/.
---

# Productor · Orquestador del carrusel semanal · Globalizame

> Repo de trabajo: `D:\Globalizame\proyectos\contenido-instagram\` (rutas relativas a él).

## Qué es esta skill

**Esta skill solo ORQUESTA.** No define cómo se hace un carrusel: el oficio (voz, tipos, estructura,
hooks, color, elemento visual, marco de marca, ratio, esqueleto del prompt, anti-patrones) vive ENTERO
en `skill/references/system-prompt-carrusel.md` — **LA LEY**. Aquí solo está el flujo: qué leer, en qué
orden, qué pasos, cómo guardar y commitear. Ante cualquier duda de cómo se hace algo del carrusel, manda
el system prompt; esta skill nunca lo reinterpreta ni lo repite.

## ⚙️ MECÁNICA — LEE ESTO PRIMERO (no negociable)

Los pasos se ejecutan **SEGUIDOS, en una sola pasada, sin parar entre ellos.**

```
QUÉ TOCA → INVESTIGACIÓN LIGERA → DECISIONES → SLIDES + PROMPTS → COPY (IG+LI) → COMUNIDAD → GUARDAR → COMMIT
```

- Ejecuta PASO 1 → … → PASO 8 → commit, sin detenerte ni preguntar (salvo el PASO 0 si falta el brief).
- **PROHIBIDO** parar a mitad para "entregar" los prompts y preguntar si sigo con el copy. Todo en una pasada.
- **UN SOLO commit** al final, con la carpeta del post ya escrita. Nunca por paso.
- Anti-rama: SIEMPRE a `main`. Nunca ramas `claude/`.

### ✅ Criterio de HECHO
- [ ] Carpeta `posts/post_[YYYY-MM-DD]_[slug]/` con los 7 archivos (ver Outputs).
- [ ] **Munición real de la base:** ≥1 novedad/herramienta de IA nombrada + 1 dato/caso real con su cifra y fuente.
- [ ] El carrusel cumple el system prompt (marco de marca, elemento visual por slide §6.1, color, ratio, voz). No lo verificas tú a mano: aplicaste el system prompt al generarlo.
- [ ] Todo el copy visible pasado por `humanizer`.
- [ ] `registro.md` actualizado.
- [ ] Commit + push a `main` (uno solo).
- [ ] Prompts mostrados en el chat para pegar en ChatGPT.

## 📚 CONTEXTO A LEER (del repo, en este orden)

1. `registro.md` — qué se hizo antes (no repetir hook/titular).
2. **`skill/references/system-prompt-carrusel.md` — ⭐ LA LEY.** Todo el oficio del carrusel. Se sigue a rajatabla. Ante cualquier conflicto con esta skill o con otro archivo, **gana el system prompt**.
3. `skill/references/embudo-carruseles.md` — estructura del carrusel por etapa TOFU/MOFU/BOFU.
4. `skill/references/benchmarks-carrusel.md` — rangos de slides por red, ganchos, CTA por objetivo, métricas.
5. `skill/references/voz_mario.md` — la voz.
6. `skill/references/buyer_persona.md` — a quién le hablo.
7. `skill/references/pilares_contenido.md` — los 5 pilares y los tipos de CTA.
8. `estrategia/estrategia_mes.html` — el brief del mes.
9. `investigacion/base_[YYYY-MM].md` — la munición (mes actual).

## PASO 0 · GATE — ¿hay brief del mes?

Si **falta** `estrategia/estrategia_mes.html` o `investigacion/base_[mes].md`: avisa de que hay que correr antes `/investigador`. **No inventes la estrategia.** Para aquí.

## PASO 1 · QUÉ TOCA + MUNICIÓN DE LA BASE (obligatorio)

**1a.** Lee `estrategia/estrategia_mes.html` y, según la fecha de hoy, identifica: Sprint · Día · Etapa (TOFU/MOFU/BOFU) · Título · Tipo de CTA · Palabra clave (si la pieza lanza lead magnet).

**1b. Saca la munición concreta de `investigacion/base_[mes].md`** — NO es opcional. Antes de escribir nada, extrae para ESTA pieza:
- **La novedad de IA/tech** relevante (sección "Novedades IA/tech del mes"). Se NOMBRA en el carrusel.
- **El dato por eje** con cifra y fuente (sección "Datos aprobados").
- **El caso real** del sector que aplique (sección "Casos reales aprobados").

> ⛔ **Prohibido un carrusel que no use al menos (a) una IA nombrada de la base y (b) un dato/caso real con cifra.** El dolor operativo es el gancho; la IA concreta y el dato dan la autoridad. Si solo escribes dolor genérico, vuelve a 1b.

## PASO 2 · INVESTIGACIÓN LIGERA

**3-4 búsquedas web** (WebSearch — suscripción) por si hay un dato MÁS fresco que el de la base para el titular. Complementa la base (1b), nunca la sustituye. Si lo hay → úsalo; si no → usa el de la base o el del título. Filtro: cifra concreta + entendible + fuente verificable. Nunca inventes cifras.

## PASO 3 · DECISIONES (lee `registro.md`, no repitas)

Decide según el system prompt y los benchmarks — esta skill solo lista qué hay que decidir:
- **Tipo de carrusel** según la etapa del brief (estructura por etapa en `embudo-carruseles.md`; los 5 tipos en system prompt §3). No mezcles dos.
- **Nº de slides** según los rangos de `benchmarks-carrusel.md` (IG 7-10, LinkedIn 6-10; nunca 4-5). El mismo set vale para ambas redes.
- **Hook** que mejor abra ESTE tema (fórmulas en system prompt §5 + benchmarks). No repitas el de la semana pasada.
- El **color no se decide**: es fijo (system prompt §6). No hay nada que elegir ni rotar.

> Si falta algo crítico del brief, pregunta **MÁX 3 cosas** (tipo / CTA / dato). Si el brief es autosuficiente, no preguntes y sigue.

## PASO 4 · ESTRUCTURA + COPY SLIDE A SLIDE

Aplica el system prompt §3 (tipos), §4 (estructura), §5 (hooks) y §6/§6.1 (visual de cada slide) **a rajatabla**. Para cada slide define: función narrativa · texto exacto (español, máx ~15 palabras) · visual breve. El CTA va en el copy del post, nunca en la imagen.

## PASO 5 · PROMPTS DE IMAGEN PARA CHATGPT

Un prompt por slide con el esqueleto §8 del system prompt (`[ESCENA]`/`[ELEMENTOS]`/`[TEXTO EN IMAGEN]`/`[ESTILO]`/`[CONSTRAINTS]`) y el formato de salida §10. Cópialo del system prompt, no lo reinventes. Todo el detalle visual (marco de marca, color, ratio 3:4, elemento visual §6.1) está en el system prompt y se aplica desde ahí.

## PASO 6 · COPY DEL POST (Instagram y LinkedIn)

Voz Mario / Isra Bravo (ver `voz_mario.md`). En euros y horas; nombra la IA cuando aporte, sin jerga vacía.
- **`copy-instagram.md`** — directo y cercano.
- **`copy-linkedin.md`** — misma voz, registro algo más formal (B2B). Mismo mensaje.

CTA según el tipo del sprint (definidos en `pilares_contenido.md`): Recurso (solo si la pieza lanza el lead magnet) / Conversación / Autoridad. Regla de oro: NO "Comenta X" sin recurso real. Mezcla los tres cierres en la semana.

## PASO 7 · MENSAJES DE COMUNIDAD

- **`respuesta-comentario.md`** — respuesta pública al comentario, en la voz de Mario. Si *recurso*: confirma y "te lo mando por privado". Si *conversación*: contesta y abre diálogo.
- **`dm.md`** — el privado. Si *recurso*: entrega el kit con una línea de contexto + micro-CTA suave. Si *conversación*: pasa a privado con una pregunta concreta. Nada de venta dura.

## PASO 8 · HASHTAGS + HUMANIZER

- **`hashtags.md`** — 5-7, mezcla nicho + intent (#pyme #dueñodenegocio #productividad…).
- **HUMANIZER:** pasa por `humanizer` TODO el copy visible antes de guardar (IG, LinkedIn, respuesta, DM). Sin patrones AI.

## PASO 9 · GUARDAR Y ACTUALIZAR REGISTRO

**Guarda** los 7 archivos en `posts/post_[YYYY-MM-DD]_[slug]/` (ver Outputs).
**Actualiza** `registro.md`: fecha, sprint, día, etapa, tipo de carrusel, hook usado, título. (El color no se registra: es fijo.)
**Muestra en el chat** todos los prompts de imagen, listos para pegar en ChatGPT (3:4).

## Outputs

Carpeta `posts/post_[YYYY-MM-DD]_[slug]/` con 7 archivos:
- `strategy.md` — resumen (big idea / avatar / emoción / objetivo / tipo / nº slides) + estrategia + copy slide a slide.
- `prompts.md` — un prompt de imagen por slide (3:4, esqueleto completo).
- `copy-instagram.md` · `copy-linkedin.md` — copy de cada red.
- `respuesta-comentario.md` · `dm.md` — comunidad.
- `hashtags.md` — 5-7 hashtags.

## 🔒 CIERRE · GIT (UN SOLO commit, al final)

```bash
cd "D:/Globalizame/proyectos/contenido-instagram"
git add -A
git commit -m "feat(post): carrusel [FECHA] — <título del post>"
git push origin main
```

> Si el push falla por auth, deja el commit y avisa a Mario.

## ⛔ REGLAS DE PROCESO (lo del carrusel está en el system prompt)

- No inventar datos, cifras, nombres ni herramientas.
- Solo el post de esta semana. Autónomo, sin confirmación (salvo PASO 0).
- Mismo set visual para IG y LinkedIn; cambia solo el copy.
- Todo el copy visible pasa por `humanizer`.
- Los prompts piden ratio **3:4** (lo que da ChatGPT); el entregable de marca es 4:5 al exportar (system prompt §7).
- Suscripción siempre: **WebSearch + Write**. NUNCA la API de pago.
- UN solo commit al final, a `main`. Nunca ramas `claude/`.
