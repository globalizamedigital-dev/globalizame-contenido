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

## El único paso manual: subir PNG a una carpeta

Hay dos vías, misma idea (soltar los PNG generados con GPT Images 2.0 en una
carpeta), distinto sitio según si Mario está delante del PC o no.

### Vía A -- Google Drive + n8n (automática de verdad)

Mario sube los PNG a `Contenido/inbox/` en Google Drive (desde el PC o el
móvil). El workflow `contenido-publicador` en n8n (id `TXuPZ3Z7muYtBRAJ`,
https://n8n.globalizame.cloud/workflow/TXuPZ3Z7muYtBRAJ) hace el resto solo,
sin que nadie abra Claude Code:

1. Detecta el archivo nuevo, espera 90s a que termine de subirse el lote
   completo, lista `inbox/`.
2. Lee `content-os/state/publish-manifest.json` vía GitHub raw (pieza
   pendiente más antigua, `slide_count`, captions, `slide_headlines`).
3. Si el nº de PNG no coincide con `slide_count`, no toca nada y avisa por
   Telegram que el lote está incompleto.
4. Si coincide, descarga los PNG, valida dimensiones 1080x1350 (mismo
   criterio que `readPngSize` de `qa.mjs`, portado a JS del nodo).
5. QA visual con Gemini (`models/gemini-2.0-flash`, gratis): compara los
   títulos reales de cada slide contra `slide_headlines` del manifest, revisa
   que no haya contador de página y que el estilo (paleta blanco/negro/naranja,
   tipografía) sea consistente.
6. Aprobado → sube los PNG a `Contenido/publicado/`, notifica por Telegram
   que la pieza está lista para programar. Rechazado → sube a
   `Contenido/revision/` con el motivo, notifica para regenerar.
7. Borra los originales de `inbox/`.

El paso de Metricool queda fuera del workflow n8n a propósito: el plan
gratis de Metricool solo da MCP (conectado a esta sesión de Claude), no la
API HTTP que necesitaría n8n para llamar directo. Cuando llega la
notificación de "lista para programar", basta con decirle a Claude Code
*"programa las piezas listas en Metricool"* y lo hace vía MCP
(`createScheduledPost`, `draft: true`, blogId `6581580`).

### Vía B -- local con `inbox/` del repo (respaldo, requiere Claude Code abierto)

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
5. Se programa como **borrador** en Metricool vía MCP. Mario solo entra a
   Metricool a aprobar.

## Diagnóstico técnico

```powershell
npm test
npm run content:plan -- YYYY-MM-DD
npm run content:run -- YYYY-MM-DD
npm run content:validate
npm run content:ingest
npm run content:queue
npm run content:manifest
npm run content:serve
```
