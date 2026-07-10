# AGENTS.md - Globalizame Content OS

## Forma de trabajo

Este proyecto funciona bajo demanda. No usa rutinas, cron ni tareas programadas.
El usuario inicia cada trabajo escribiendo uno de estos comandos en Codex:

- `$investigador`: actualiza la investigación y el calendario mensual en `recursos/`.
- `$productor`: produce la siguiente pieza completa y la deja en `outputs/`.
- `$lead-magnet`: crea o mejora el recurso asociado a una pieza.

Cada comando debe terminar su ciclo completo sin pedir confirmaciones intermedias.

## Estructura canónica

- `recursos/`: única fuente editorial y visual.
- `.agents/skills/`: comandos y contratos del agente.
- `content-os/`: motor, validadores, panel y estado.
- `outputs/`: piezas terminadas y trazabilidad.

No se deben crear carpetas paralelas para investigación, estrategia o posts.

## Reglas de producción

- Globalizame no tiene clientes ni casos de éxito propios.
- Todo resultado externo debe estar atribuido sin ambigüedad.
- Todo texto visible pasa por `$humanizer` completo.
- Todo arte final se genera con GPT Image 2.0 en máxima calidad.
- El estilo visual se toma de `recursos/carrusel/`.
- El modo de publicación siempre es `draft`.
- El ciclo solo termina con QA aprobado y todos los archivos obligatorios.

## Git

- Trabajar directamente en `main`.
- Hacer un solo commit al final de cada comando completo.
- Enviar el resultado con `git push origin main`.
- No crear ramas ni pull requests para la producción de contenido.
