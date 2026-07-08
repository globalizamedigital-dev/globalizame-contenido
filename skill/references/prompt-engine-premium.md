# Motor de prompts premium para carruseles

Este sistema no debe pedir “slides bonitos”. Debe construir una escena de campaña por slide.

## Regla madre

El diseño final no sale de un SVG básico. El SVG solo puede servir para maqueta técnica, composición de texto o revisión de copy. La pieza final requiere un asset visual rico: fotografía, 3D, collage, textura, mockup o escena generativa con profundidad.

## Contrato de producción por slide

Cada slide se genera en dos capas:

1. **Asset visual sin texto**
   - Escena protagonista.
   - Sin titulares, sin subtítulos, sin fuentes, sin numeración, sin microcopy.
   - Formato 1080x1350, composición pensada para dejar zonas limpias donde luego se compone texto.

2. **Capa editorial**
   - Titular exacto.
   - Subcopy exacto si aporta.
   - CTA solo en cierre.
   - Las fuentes de datos no aparecen dentro del arte. Van en caption, documento interno o notas del post.

## Cómo debe sonar un prompt bueno

Un buen prompt define:

- el tipo de pieza: póster publicitario, collage premium, escena 3D, fotografía intervenida, infografía cinematográfica;
- el objeto protagonista: ticket, teléfono, mano, reloj, caja registradora, negocio vacío, competencia;
- la dirección de luz: flash duro, glow lateral, estudio oscuro, fondo azul saturado, papel blanco roto con sombra real;
- la composición: objeto gigante cortado por borde, diagonal agresiva, centro dramático, profundidad, sombra;
- el espacio reservado para texto: zona superior izquierda, franja inferior limpia, banda lateral;
- el criterio de rechazo: si parece icono, clipart, PowerPoint o plantilla Canva barata, rehacer.

## Prompt base

```text
Genera un asset visual premium para un carrusel de Instagram 4:5, 1080x1350.

NO incluyas texto, letras, números, logos, firmas, fuentes ni marcas de agua.

Dirección de arte:
pieza de campaña para una marca de automatización de llamadas, estética potente tipo collage 3D/fotografía intervenida, alto contraste, profundidad real, sombras dramáticas, textura editorial, composición agresiva y limpia.

Paleta:
negro carbón, verde lima eléctrico, azul saturado o blanco papel según el slide. No usar paleta genérica corporativa.

Escena:
[describir escena concreta del slide]

Composición:
[dónde va el objeto, escala, diagonal, zona libre para titular]

Criterio de calidad:
debe parecer una pieza de estudio creativo, no un icono, no un dashboard, no un wireframe, no una infografía escolar, no una plantilla barata.
```

## Prompts negativos fijos

```text
no text, no letters, no numbers, no captions, no watermark, no logo, no flat vector icon, no clipart, no powerpoint infographic, no generic corporate illustration, no cartoon, no childish shapes, no cheap Canva template, no tiny UI labels, no source text, no stock-photo smiley people
```

## Fuente de datos

La fuente es evidencia editorial, no decoración visual. Nunca se imprime dentro del slide salvo que Mario lo pida expresamente.
