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

## Forma de trabajo

Este proyecto funciona bajo demanda. No usa rutinas, cron ni tareas programadas.
El usuario inicia cada trabajo escribiendo uno de estos comandos en Codex:

- `$investigador`: actualiza la investigación y el calendario mensual en `recursos/`.
- `$productor`: produce la siguiente pieza completa y la deja en `outputs/`.
- `$lead-magnet`: crea o mejora el recurso asociado a una pieza.

En Claude Code, los mismos comandos existen como skills en `.claude/skills/`
(`investigador`, `productor`, `lead-magnet`, `content-loop`), con el mismo contrato.

Cada comando debe terminar su ciclo completo sin pedir confirmaciones intermedias,
salvo el paso de generación de imagen si el agente en turno no tiene esa capacidad.

## Estructura canónica

- `recursos/`: única fuente editorial y visual.
- `.agents/skills/`: comandos y contratos del agente para Codex.
- `.claude/skills/`: mismos comandos y contratos, formato Claude Code.
- `content-os/`: motor, validadores, panel y estado (compartido por ambos agentes).
- `outputs/`: piezas terminadas y trazabilidad.

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
- El modo de publicación siempre es `draft`.
- El ciclo solo termina con QA aprobado y todos los archivos obligatorios, incluidos
  los PNG finales reales y `imagegen.json` con las reseñas visuales.

## Git

- Trabajar directamente en `main`.
- Hacer un solo commit al final de cada comando completo.
- Enviar el resultado con `git push origin main`.
- No crear ramas ni pull requests para la producción de contenido.
