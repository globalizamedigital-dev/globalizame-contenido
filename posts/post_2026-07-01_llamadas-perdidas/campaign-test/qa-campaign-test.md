# QA campaña visual · Globalizame AI

## Resultado

**Aprobado como dirección visual de sistema.**

La prueba abandona el enfoque de infografía y genera piezas de campaña alineadas con las referencias del usuario:

- objetos protagonistas grandes;
- estética IA/voz/automatización;
- mezcla 3D, fotografía y collage;
- paleta Globalizame: negro carbón, verde lima, azul eléctrico, blanco roto y metal;
- texto compuesto en capa editorial, no dentro de la imagen generativa;
- sin fuentes de datos dentro del arte.

## Evidencia generada

- `contact-sheet.png`: hoja de prueba con 4 piezas.
- `exports/slide-01.png`: portada dark AI.
- `exports/slide-03.png`: collage blanco teléfono/etiqueta.
- `exports/slide-06.png`: fondo azul, fuga de dinero, IA.
- `exports/slide-07.png`: agente de voz nocturno.

## Criterios revisados

| Criterio | Estado | Evidencia |
|---|---|---|
| Estilo similar a referencias | PASS | Piezas tipo campaña con 3D/foto/collage |
| Identidad Globalizame | PASS | Negro, verde lima, azul eléctrico, blanco roto |
| Alineado a inteligencia artificial | PASS | Robot/agente de voz, ondas, circuito, automatización |
| No infografía barata | PASS | No hay matrices, dashboards ni widgets como base visual |
| Texto controlado | PASS | Titulares compuestos por HTML/CSS |
| Fuentes fuera del arte | PASS | No se imprimen fuentes en slides |

## Observaciones

La prueba confirma que el sistema debe producir primero assets raster de campaña y después componer texto. El renderer SVG anterior queda descartado como salida visual final.

Para escalar a 8 slides, repetir esta lógica por familia:

1. Hero 3D.
2. Fotografía intervenida.
3. Collage premium.
4. Fotografía intervenida dark.
5. Collage premium con calle/competencia.
6. Hero 3D azul.
7. Dark cinematic AI.
8. Dark cinematic CTA.
