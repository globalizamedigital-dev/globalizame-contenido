---
name: content-loop
description: Ejecuta el sistema autónomo de contenido de Globalizame desde los archivos canónicos de recursos hasta carruseles 4:5, copys, fuentes, QA y estado. Úsala cuando el usuario pida producir el siguiente post, generar contenido en piloto automático, ejecutar el loop, validar una pieza, preparar un carrusel o revisar el estado de producción. Impone que Globalizame no tiene clientes ni casos propios y bloquea cualquier texto que sugiera lo contrario.
---

# Content Loop

Operar el motor determinista del repositorio. No duplicar reglas de `content-os/system/SYSTEM_PROMPT.md`.

## Ejecución

1. Leer `content-os/system/SYSTEM_PROMPT.md` y `content-os/config.json`.
2. Ejecutar `npm test` antes de la primera producción de una sesión.
3. Ejecutar `npm run content:plan -- [YYYY-MM-DD]` cuando se necesite inspeccionar la pieza elegida.
4. Ejecutar `npm run content:run -- [YYYY-MM-DD]` para producir el ciclo completo.
5. Redactar `copy-source.json` desde cero leyendo `recursos/voz_mario.md`, el brief, la evidencia y el CTA. No usar el fallback del código como publicación final. Instagram debe superar 180 palabras y LinkedIn 250, con desarrollos propios para cada red.
6. Leer y aplicar la skill `humanizer` completa a todo texto visible. Hacer la pregunta de auditoría anti-IA y una segunda reescritura. Guardar `humanizer.json`.
7. Generar un PNG final por slide con GPT Image 2.0, máxima calidad, usando las referencias de `recursos/carrusel/` y la keyframe aprobada. Guardar `imagegen.json`.
8. Abrir la hoja de contacto final y revisarla visualmente contra las referencias.
9. Ejecutar `npm run content:validate` después de cualquier corrección.
10. Aceptar únicamente cuando `qa.json` indique `APPROVED`, `honesty.passed` sea `true`, los copys superen los mínimos editoriales y existan todos los assets GPT Image 2.0.

## Reglas

- Usar exclusivamente `recursos/` como fuente editorial.
- No editar recursos para hacer pasar una validación.
- Tratar `FALSE_CLIENT_IMPLICATION` y `UNATTRIBUTED_RESULT` como bloqueos absolutos.
- No prometer un lead magnet inexistente.
- Mantener el modo de publicación en borrador.
- Reanudar desde `outputs/`; no repetir pasos aprobados sin motivo.
- Mantener un solo commit al final y hacer push directo a `main` según `AGENTS.md`.

## Comandos

```powershell
npm test
npm run content:plan -- 2026-07-10
npm run content:run -- 2026-07-10
npm run content:validate
npm run content:serve
```

El panel local queda en `http://127.0.0.1:4173` mientras el servidor está activo.
