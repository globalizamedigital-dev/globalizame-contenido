# Sistema visual automatizado

## Ejecución

Desde la raíz:

```powershell
node skill/scripts/run-carousel.mjs posts/post_2026-07-01_llamadas-perdidas
```

El comando lee `slides.yaml` como fuente de verdad y genera:

- SVG finales en `renders/`;
- PNG 1080×1350 listos para publicar en `exports/`;
- prompts coordinados en `prompts-system.md`;
- `contact-sheet.svg`;
- `qa-report.md`.

Los SVG son editables, escalables y publicables después de exportarlos a PNG. El texto, la marca, los datos y la retícula son deterministas. Los prompts permiten generar elementos visuales adicionales sin delegar al modelo la ortografía.

## Crear una pieza nueva

1. Copiar la estructura de un post anterior.
2. Escribir `strategy.md`.
3. Crear `visual-bible.md`.
4. Crear `slides.yaml` con un objeto por slide.
5. Ejecutar el comando único.
6. Abrir la hoja de contacto y completar la puntuación visual.
7. Si el validador detecta un fallo medible, corregir la especificación y ejecutar:

```powershell
node skill/scripts/validate-carousel.mjs posts/post_fecha_slug --repair
```

Solo se reescriben los renders fallidos.

## Límites reales

El validador automático puede comprobar dimensiones, texto, fuentes de datos, continuidad declarada, layouts y existencia de renders. La calidad conceptual requiere una revisión visual de la hoja de contacto. Las puntuaciones humanas quedan registradas en `slides.yaml` para que el criterio sea auditable.

## Formato maestro

El sistema usa 1080×1350, 4:5. Es el formato vertical estándar de Instagram y puede convertirse en PDF multipágina para LinkedIn. Se elimina la regla 3:4 porque hacía depender toda la identidad de una limitación circunstancial del generador.
