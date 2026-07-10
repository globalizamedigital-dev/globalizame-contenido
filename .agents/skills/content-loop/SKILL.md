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
6. Leer y aplicar la skill `humanizer` completa a todo texto visible. Hacer la auditoría anti-IA y una segunda reescritura. Guardar `humanizer.json`.
7. Generar un PNG final por slide con GPT Image 2.0, máxima calidad, usando las referencias de `recursos/carrusel/` y una keyframe aprobada. Guardar `imagegen.json`.
   - Mantener el ADN visual, pero variar de forma sutil la cantidad de slides, jerarquía, posición de tarjetas, diagramas, robot y espacio negativo según el contenido.
   - No reutilizar automáticamente la misma secuencia de layouts entre publicaciones.
   - La última slide debe ejecutar el CTA real. Si el CTA es `Comenta X`, debe mostrar `COMENTA X` y explicar qué recibe la persona.
8. Abrir la hoja de contacto final y revisarla visualmente contra las referencias.
9. Ejecutar `npm run content:validate` después de cualquier corrección.
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

## Diagnóstico técnico

```powershell
npm test
npm run content:plan -- 2026-07-10
npm run content:run -- 2026-07-10
npm run content:validate
npm run content:serve
```

El panel local queda en `http://127.0.0.1:4173` mientras el servidor está activo.
