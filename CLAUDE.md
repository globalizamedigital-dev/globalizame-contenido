# CLAUDE.md - Globalizame Content OS

Ver `AGENTS.md` para la política completa (compartida con Codex). Este archivo
solo añade lo específico de Claude Code.

## Comandos disponibles aquí

- `investigador`: actualiza la investigación y el calendario mensual en `recursos/`.
- `productor`: produce la siguiente pieza completa hasta el paso de imagen.
- `lead-magnet`: crea o mejora el recurso asociado a una pieza.
- `content-loop`: skill base que las tres anteriores invocan.
- `publicador`: ingiere los PNG de `inbox/`, hace la reseña visual, valida QA
  y programa el borrador en Metricool. Ver "El único paso manual" abajo.

## Lo que Claude Code NO hace en este sistema

Claude no genera imágenes. En el paso de arte, `content:run` escribe
`outputs/<id>/imagegen-prompts.md` con un prompt completo por slide (bloques
``` listos para copiar/pegar tal cual, sin nada añadido) y el comando se
detiene ahí (`WAITING_ON_IMAGE_GENERATION`). Mario genera los PNG con GPT
Images 2.0 pegando cada bloque -- nunca vía API de pago -- y los suelta en
`inbox/`.

## El único paso manual: `inbox/`

Cuando Mario tiene los PNG generados, los suelta todos juntos en `inbox/`
(cualquier nombre, se ordenan alfabéticamente = orden de generación) y dice
`publicador`. A partir de ahí todo es automático:

1. `npm run content:ingest` asigna los PNG a la pieza pendiente más antigua,
   valida cantidad y dimensiones (1080x1350), y los renombra a
   `outputs/<id>/final/slide-NN.png`. Si algo no cuadra, no mueve nada y dice
   por qué.
2. Claude lee esas imágenes de verdad y escribe `outputs/<id>/imagegen.json`
   con la reseña visual honesta (contrato exacto en `content-os/lib/qa.mjs`).
3. `npm run content:validate` -- si `APPROVED`, sigue; si `BLOCKED`, se
   corrige (nunca se fuerza el pase).
4. `npm run content:queue` mete la pieza en
   `content-os/state/publish-queue.json` con los dos copys y las rutas de
   imagen.
5. Si el MCP de Metricool está conectado (`claude mcp list` debe mostrarlo),
   se programa como **borrador** con `post_schedule_post`. Mario solo entra a
   Metricool a aprobar.

Si el MCP de Metricool todavía no está conectado, el pipeline llega hasta el
paso 4 y avisa que faltan credenciales -- nada se pierde, se retoma en cuanto
estén.

## Diagnóstico técnico

```powershell
npm test
npm run content:plan -- YYYY-MM-DD
npm run content:run -- YYYY-MM-DD
npm run content:validate
npm run content:ingest
npm run content:queue
npm run content:serve
```
