---
name: marketing-contenido-instagram
description: Motor de contenido de Instagram para Globalizame (Mario Ruiz). Dos modos en una pasada cada uno. MODO INVESTIGACIÓN+ESTRATEGIA: investiga datos reales del mes (10+ WebSearch), diseña el arco mensual de 5 sprints y genera estrategia HTML + base de investigación + registro. MODO PRODUCCIÓN: genera el carrusel semanal (6-8 slides con prompts de imagen para ChatGPT) + copy del post + registro. Activa cuando el usuario diga "investiga el contenido del mes", "estrategia de contenido", "genera el carrusel de la semana", "produce el post de esta semana", "contenido instagram", "investigador" o "productor". Regla absoluta: el contenido NUNCA menciona IA, automatización, bot, workflow ni tecnicismos — el protagonista es el problema o el resultado en euros y horas. Voz Mario / Isra Bravo. Co-skills: humanizer (todo copy visible), tool-output-verifier (antes de entregar).
---

# Contenido Instagram — Globalizame

Repo de trabajo: `D:\Globalizame\proyectos\contenido-instagram\` (todas las rutas relativas a él).

## Contexto Globalizame (alineación obligatoria)

- **Quién habla**: Mario Ruiz, fundador de Globalizame, agencia de IA y automatización para PYMEs. Primera persona siempre. Globalizame aparece como logo/footer; quien habla es Mario.
- **Audiencia**: dueño de PYME española, 40-58, cualquier sector, no técnico, ahogado en operativa.
- **Regla absoluta (no negociable)**: el contenido NUNCA menciona IA, automatización, bot, workflow ni tecnicismos. El protagonista es el problema o el resultado, en euros y horas. La tecnología es el motor invisible.
- **Voz**: directa, sin rodeos, estilo Isra Bravo. Frases cortas, punto y aparte, el remate final cierra. Sin emojis corporativos, sin hype.
- **Suscripción siempre**: WebSearch + Write con la suscripción. NUNCA la API de pago.
- **Datos**: nunca inventar cifras, nombres ni fuentes. Todo dato con fuente verificable y traducido a euros u horas.

## Contexto a leer antes de cualquier modo (en este orden)

1. `skill/references/pilares_contenido.md`
2. `skill/references/buyer_persona.md`
3. `skill/references/voz_mario.md`
4. `skill/references/brand_system.md`
5. `skill/references/propuesta_valor.md`
6. `registro.md` (estado de rotaciones + historial)

> Estas referencias de marca son la fuente de verdad y viven en `skill/references/` del repo. NO duplicarlas aquí; cargarlas en cada ejecución.

## Cuándo se invoca

- Usuario dice "investiga el contenido del mes", "estrategia de contenido", "investigador" → **MODO INVESTIGACIÓN+ESTRATEGIA**.
- Usuario dice "genera el carrusel", "produce el post de la semana", "productor" → **MODO PRODUCCIÓN**.
- Si el usuario no especifica modo, preguntar cuál antes de arrancar.

## Process

### Paso 0 · Detectar el modo

Según el intent del usuario, elegir modo. Cargar el contexto de marca (sección anterior) y `registro.md`.

- **Tool**: Read
- **Validación**: sé qué modo ejecuto y he leído pilares + voz + persona + brand + registro.

### Paso 1 · Ejecutar el modo (loop encadenado, una pasada)

Ambos modos son loops tipo cadena: las estaciones se ejecutan SEGUIDAS, sin parar a preguntar entre ellas, y terminan en UN SOLO commit. PROHIBIDO entregar a mitad y preguntar si sigo.

- **MODO INVESTIGACIÓN+ESTRATEGIA** → seguir `references/modo-investigacion.md` íntegro.
- **MODO PRODUCCIÓN** → seguir `references/modo-produccion.md` íntegro.

- **Tool**: WebSearch, Write, Edit, Bash
- **Validación**: criterio de HECHO de cada modo (ver su reference) cumplido al 100%.

### Paso 2 · Quality gate del copy visible

Antes de guardar el copy de un post o los titulares de slides:
- Pasar todo copy visible por `humanizer` (eliminar patrones de escritura AI).
- Si es entregable final, invocar `tool-output-verifier` con `score-only: true`.
- Re-filtrar contra la regla absoluta: ningún titular ni copy menciona IA/automatización/bot/workflow.

### Paso 3 · Cierre (git + learnings)

- **UN SOLO commit** a `main` con todos los entregables del modo ya escritos. Nunca un commit por tarea.
- `git push origin main` automático. Si el push falla por auth, dejar el commit hecho y avisar a Mario.
- Anti-rama: SIEMPRE `main`. Nunca `git checkout -b` ni ramas `claude/`. Si una orquestación asignó una rama, ignorarla y trabajar en `main`.
- Si la sesión enseñó algo nuevo (dato estrella, ángulo que funcionó), append en `context/learnings.md`.

## Outputs

- **MODO INVESTIGACIÓN+ESTRATEGIA**: `investigacion/base_[YYYY-MM].md` · `estrategia/estrategia_mes.html` · `registro.md` actualizado.
- **MODO PRODUCCIÓN**: `posts/post_listo_[YYYY-MM-DD].md` · `registro.md` actualizado (hook rotado).
- Commit + push a `main` (uno solo por ejecución) + resumen al usuario.

## Skills que llama

- **`humanizer`** — todo copy visible (titulares de slides, copy del post), en el Paso 2.
- **`tool-output-verifier`** — quality gate antes de entregar, en el Paso 2.

## Edge cases

- **Falta la estrategia o la base del mes en MODO PRODUCCIÓN** → avisar: hay que correr antes el MODO INVESTIGACIÓN. No inventar la estrategia.
- **No existe estrategia del mes anterior como plantilla** → generar el formato HTML desde `skill/references/brand_system.md` y las pautas de marca.
- **Mes objetivo ambiguo** (varios meses en juego) → confirmar con el usuario qué mes antes de investigar. No regenerar contenido que se borró a propósito sin preguntar.
- **Push falla** → commit queda hecho, avisar a Mario para que empuje él.

## Examples

Ver `references/modo-investigacion.md` y `references/modo-produccion.md` para el procedimiento completo de cada modo. Ejemplos reales en el repo: `investigacion/base_2026-07.md`, `estrategia/estrategia_mes.html`, `posts/post_listo_2026-07-02.md`.
