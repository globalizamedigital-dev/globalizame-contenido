---
name: content-loop
description: Motor manual de Globalizame que convierte los recursos canónicos en carruseles 4:5, copys, fuentes, QA y estado. Bloquea cualquier texto que sugiera clientes o casos propios.
---

# Content Loop

Este motor se ejecuta únicamente cuando el usuario lo pide. No debe crear rutinas, recordatorios ni tareas programadas.

Operar el motor determinista del repositorio. No duplicar reglas de `content-os/system/SYSTEM_PROMPT.md`.

## Ejecución

1. Leer `content-os/system/SYSTEM_PROMPT.md` y `content-os/config.json`.
2. Ejecutar `npm test` antes de la primera producción de una sesión.
3. Ejecutar `npm run content:plan -- [YYYY-MM-DD]` para inspeccionar la pieza elegida.
4. Ejecutar `npm run content:run -- [YYYY-MM-DD]` para producir el ciclo completo.
5. Redactar `copy-source.json` desde cero leyendo `recursos/voz_mario.md`, el brief, la evidencia y el CTA. Instagram debe superar 180 palabras y LinkedIn 250, con desarrollos propios para cada red.
6. Cargar la skill `humanizer` (skill real, ~/.claude/skills/humanizer, no el filtro de `content-os/lib/humanize.mjs`) y aplicarla al copy ANTES de que `content:run` lo procese: identificar patrones IA, reescribir, hacer la auditoría anti-IA ("¿qué hace que esto suene a IA?"), y una segunda reescritura. `humanize.mjs` solo actúa como red de seguridad determinista final (7 patrones mecánicos) — no sustituye este paso, y si `humanized.report.passed` es `false` el ciclo se bloquea igual.
7. Escribir `imagegen-prompts.json` en el directorio de salida: un prompt de imagen completo por slide, generado por Claude (no una llamada a API — Claude no genera imágenes). Cada prompt debe incluir: layout/rol de la slide (hook, flow, gauge, split, checklist, cta-minimal), headline y support exactos del `spec.json`, y las reglas de composición visual completas del `SYSTEM_PROMPT.md` §Sistema visual (formato 1080×1350, paleta blanco/negro/naranja #FF4B0B, robot opcional viviendo el conflicto, sin collage, portada de escena única, etiqueta superior adaptativa no fija). Usar hasta 5 referencias de `recursos/carrusel/` citadas por nombre de archivo en el prompt.
8. Entregar `imagegen-prompts.json` al usuario y ESPERAR: la generación real de PNG con GPT Image 2.0 la hace un agente con esa capacidad (Codex, vía la suscripción del usuario — nunca vía API de pago). Cuando el usuario traiga los PNG generados y las reseñas visuales, continuar.
9. Con los PNG en `outputs/<id>/final/slide-NN.png` y `imagegen.json` con las reseñas (`hook_visual_review`, `labels_visual_review`, `cta_visual_review`) ya escrito por quien generó las imágenes, ejecutar `npm run content:validate`.
10. Aceptar únicamente cuando `qa.json` indique `APPROVED`, `honesty.passed` sea `true`, los copys superen los mínimos y existan todos los assets GPT Image 2.0.

## Reglas

- Usar exclusivamente `recursos/` como fuente editorial.
- No editar recursos para forzar una validación.
- Tratar `FALSE_CLIENT_IMPLICATION` y `UNATTRIBUTED_RESULT` como bloqueos absolutos.
- No prometer un lead magnet inexistente.
- Elegir el CTA por etapa y objetivo de la pieza, no por una lista global de frases. TOFU abre conversación o guardado; MOFU puede entregar recurso; BOFU lleva a una acción comercial concreta.
- Mantener el modo de publicación en borrador.
- Reanudar desde `outputs/`; no repetir pasos aprobados sin motivo.
- Mantener un solo commit al final y hacer push directo a `main` según `AGENTS.md`.
- Nunca citar la fuente de un dato al estilo nota de prensa ("según un informe de X recogido por Y") en el copy público — se afirma el dato directo, sin atribución académica pegada.
- El SVG (`content-os/lib/render.mjs`) es solo wireframe/maqueta interna para revisar layout y densidad de texto antes de generar el prompt de imagen. Nunca es el arte final — el arte final siempre es el PNG generado con GPT Image 2.0.

## Diagnóstico técnico

```powershell
npm test
npm run content:plan -- 2026-07-10
npm run content:run -- 2026-07-10
npm run content:validate
npm run content:serve
```

El panel local queda en `http://127.0.0.1:4173` mientras el servidor está activo.
