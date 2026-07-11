# CLAUDE.md - Globalizame Content OS

Ver `AGENTS.md` para la política completa (compartida con Codex). Este archivo
solo añade lo específico de Claude Code.

## Comandos disponibles aquí

- `investigador`: actualiza la investigación y el calendario mensual en `recursos/`.
- `productor`: produce la siguiente pieza completa hasta el paso de imagen.
- `lead-magnet`: crea o mejora el recurso asociado a una pieza.
- `content-loop`: skill base que las tres anteriores invocan.

## Lo que Claude Code NO hace en este sistema

Claude no genera imágenes. En el paso de arte, `content:run` escribe
`outputs/<id>/imagegen-prompts.json` con un prompt completo por slide y el
comando se detiene ahí (`WAITING_ON_IMAGE_GENERATION`). La generación real de
PNG con GPT Image 2.0 la hace un agente con esa capacidad (Codex, vía
suscripción) -- nunca vía API de pago. Cuando esos PNG y su `imagegen.json`
existan en `outputs/<id>/final/`, re-ejecutar `npm run content:validate`.

## Diagnóstico técnico

```powershell
npm test
npm run content:plan -- YYYY-MM-DD
npm run content:run -- YYYY-MM-DD
npm run content:validate
npm run content:serve
```
