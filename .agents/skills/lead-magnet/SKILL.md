---
name: lead-magnet
description: Comando manual para producir y validar el recurso asociado a una pieza de Globalizame.
---

# Lead magnet

Comando manual. No crear ni depender de tareas programadas.

Usar `$content-loop`. Seleccionar la pieza pendiente que tenga CTA de recurso, construir el lead magnet desde el post y la evidencia de `recursos/`, pasar todo texto por `$humanizer` y aplicar el control de honestidad. El CTA solo se activa cuando el archivo existe y ha superado QA. El recurso debe resolver una decisión de negocio (medir, priorizar, delegar) según `recursos/posicionamiento.md` — nunca un tutorial de herramienta; si el brief pide un tutorial, señalarlo y proponer la versión alineada.
