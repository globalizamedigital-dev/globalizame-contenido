# AGENTS.md - Globalizame Content OS

## Dos agentes, dos trabajos distintos

Este sistema lo operan dos agentes que NO hacen lo mismo:

- **Claude Code** (`.claude/skills/`): ejecuta el pipeline determinista completo --
  investigación, spec, copy, skill humanizer real, maqueta SVG, y escribe
  `imagegen-prompts.json` con un prompt de imagen por slide. Claude NO genera
  imágenes -- no tiene esa capacidad.
- **Codex** (`.agents/skills/`, `$investigador`/`$productor`/`$lead-magnet`): puede
  hacer el mismo pipeline, y además generar los PNG finales reales con GPT Image 2.0
  vía su suscripción, leyendo los prompts de `imagegen-prompts.json` si ya existen (o
  generándolos él mismo si arranca desde cero).

Ninguno de los dos usa API de pago para generar imagen. Globalizame no paga tokens de
API para loops -- todo va por suscripción o queda bloqueado hasta que un humano lo haga
a mano. Si un agente sin capacidad de imagen llega al paso de arte, escribe los prompts
y se detiene ahí; no inventa que generó imágenes.

El único paso manual de todo el ciclo es: Mario genera los PNG con GPT Images 2.0
pegando los bloques de `imagegen-prompts.md` y los suelta en `inbox/`. A partir de ahí
la skill `publicador` (Claude o Codex) hace ingest, reseña visual, QA, cola de
publicación y programación en Metricool sin intervención humana adicional. Ver
"Publicación" más abajo.

## Forma de trabajo

Este proyecto funciona bajo demanda. No usa rutinas, cron ni tareas programadas.
El usuario inicia cada trabajo escribiendo uno de estos comandos en Codex:

- `$investigador`: actualiza la investigación y el calendario mensual en `recursos/`.
- `$productor`: produce la siguiente pieza completa y la deja en `outputs/`.
- `$lead-magnet`: crea o mejora el recurso asociado a una pieza.
- `$publicador`: ingiere los PNG de `inbox/`, hace la reseña visual, valida y
  programa el borrador en Metricool.

En Claude Code, los mismos comandos existen como skills en `.claude/skills/`
(`investigador`, `productor`, `lead-magnet`, `publicador`, `content-loop`), con el
mismo contrato.

Cada comando debe terminar su ciclo completo sin pedir confirmaciones intermedias,
salvo el paso de generación de imagen si el agente en turno no tiene esa capacidad.

## Estructura canónica

- `recursos/`: única fuente editorial y visual.
- `.agents/skills/`: comandos y contratos del agente para Codex.
- `.claude/skills/`: mismos comandos y contratos, formato Claude Code.
- `content-os/`: motor, validadores, panel y estado (compartido por ambos agentes).
- `outputs/`: piezas terminadas y trazabilidad.
- `inbox/`: bandeja de entrada de PNG generados con GPT Images 2.0, gitignored. Único
  paso manual del ciclo; `publicador` la vacía en cada ejecución.

No se deben crear carpetas paralelas para investigación, estrategia o posts.

## Reglas de producción

- Globalizame no tiene clientes ni casos de éxito propios.
- Todo resultado externo debe estar atribuido sin ambigüedad, y nunca al estilo nota de
  prensa ("según un informe de X recogido por Y") en el copy público -- se afirma el
  dato directo.
- Todo texto visible pasa por la skill `humanizer` real (~/.claude/skills/humanizer o
  equivalente en Codex) ANTES del filtro mecánico determinista de
  `content-os/lib/humanize.mjs`, que es solo una red de seguridad de patrones fijos, no
  la skill.
- Todo arte final se genera con GPT Image 2.0 en máxima calidad, vía suscripción --
  nunca API de pago. El SVG de `content-os/lib/render.mjs` es maqueta interna, jamás
  arte final.
- El estilo visual se toma de `recursos/carrusel/`.
- El modo de publicación siempre es `draft` -- también en Metricool: se programa como
  borrador, nunca se publica directo. Mario aprueba dentro de Metricool.
- El ciclo solo termina con QA aprobado y todos los archivos obligatorios, incluidos
  los PNG finales reales y `imagegen.json` con las reseñas visuales.

## Publicación

Dos vías al mismo resultado (borrador en Metricool). `content-os/lib/queue.mjs`
mantiene `content-os/state/publish-queue.json` y `content-os/lib/manifest.mjs`
mantiene `content-os/state/publish-manifest.json` -- ambos contratos deterministas
entre el motor (que no toca la red) y el paso de publicación (que sí).

**Vía A -- Google Drive + n8n (principal, sin agente abierto).** Mario sube los PNG a
`Contenido/inbox/` en Drive. El workflow n8n `contenido-publicador`
(`https://n8n.globalizame.cloud/workflow/TXuPZ3Z7muYtBRAJ`) lee
`publish-manifest.json` vía GitHub raw, valida el lote, hace QA visual con Gemini
(gratis) y archiva en `Contenido/publicado/` o `Contenido/revision/`, notificando por
Telegram. No programa en Metricool directamente: el plan gratis de Metricool solo
expone MCP (conectado a Claude), no la API HTTP que n8n necesitaría. El paso final es
pedirle a Claude Code "programa las piezas listas en Metricool".

**Vía B -- local con `inbox/` del repo (respaldo).** Cada pieza `APPROVED` en
`outputs/` entra a `publish-queue.json` con sus dos copys y las rutas de
`final/*.png`. La skill `publicador` llama al MCP de Metricool
(`https://ai.metricool.com/mcp`, instalado con `claude mcp add --scope user`) para
programar el borrador.

En ambas vías, el modo de publicación siempre es `draft: true` -- Mario aprueba
dentro de Metricool. Brand: `mario.globalizame`, blogId `6581580`, timezone
`Europe/Madrid`.

## Git

- Trabajar directamente en `main`.
- Hacer un solo commit al final de cada comando completo.
- Enviar el resultado con `git push origin main`.
- No crear ramas ni pull requests para la producción de contenido.
