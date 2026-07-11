---
name: productor
description: Comando manual para producir el siguiente carrusel completo de Globalizame con Humanizer, prompts para GPT Image 2.0 y QA.
---

# Productor

Comando manual. No crear ni depender de tareas programadas.

Usar `content-loop` (skill) para elegir la siguiente pieza pendiente y avanzarla en una sola ejecución. Pasar todo texto por la skill `humanizer` real antes de escribirlo. Claude no genera imágenes: en el paso de arte, escribir `imagegen-prompts.json` con un prompt completo por slide (referencias de `recursos/carrusel/`, reglas de composición del `SYSTEM_PROMPT.md`) y entregarlo al usuario para que el agente con capacidad de imagen (Codex, GPT Image 2.0, vía suscripción — nunca API de pago) genere los PNG reales. No aceptar SVG como arte final; el SVG es solo maqueta. No insinuar clientes propios. Dejar el resultado en `outputs/` y en modo borrador.
