# Sistema visual automatizado

## Regla actual

El sistema no debe vender una maqueta SVG como diseño final premium.

El flujo correcto es:

1. `slides.yaml` define narrativa, texto exacto, datos y función de cada slide.
2. `prompts-system.md` genera prompts para assets visuales premium sin texto.
3. La capa editorial compone titulares, subtítulos y CTA encima del asset.
4. Las fuentes de datos se guardan como metadata interna o caption, no dentro del arte.

Referencia obligatoria:

- `skill/references/prompt-engine-premium.md`

## Ejecución técnica

Desde la raíz:

```powershell
node skill/scripts/run-carousel.mjs posts/post_2026-07-01_llamadas-perdidas
```

El comando genera:

- SVG de maqueta técnica en `renders/`;
- PNG de revisión en `exports/`;
- prompts coordinados en `prompts-system.md`;
- `contact-sheet.svg` y `contact-sheet.png`;
- `qa-report.md`.

## Qué es publicable y qué no

Publicable:

- un slide compuesto con asset visual rico y texto controlado;
- un asset generado sin texto, números, marcas, fuentes ni microcopy;
- una capa editorial revisada a tamaño móvil.

No publicable:

- iconos planos como pieza principal;
- infografías tipo PowerPoint;
- fuentes de datos impresas en el slide;
- texto deformado dentro de una imagen generativa;
- maquetas SVG sin asset visual premium.

## Crear una pieza nueva

1. Copiar la estructura de un post anterior.
2. Escribir `strategy.md`.
3. Crear `visual-bible.md`.
4. Crear `slides.yaml` con un objeto por slide.
5. Ejecutar el comando único.
6. Revisar `prompts-system.md`.
7. Generar assets visuales sin texto.
8. Componer capa editorial.
9. Revisar hoja de contacto en móvil.

## Límite del QA automático

El validador automático solo revisa estructura técnica: dimensiones, texto declarado, fuentes de datos como metadata, continuidad y existencia de renders.

No certifica potencia visual. Si el resultado parece plantilla barata, el sistema debe tratarlo como fallo aunque el QA técnico pase.
