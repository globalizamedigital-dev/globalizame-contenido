# Motor de prompts premium para carruseles

## Estilo objetivo

Este sistema debe generar carruseles con estética de campaña, no infografías.

La referencia visual es:

- póster digital con objeto protagonista;
- 3D/fotografía/collage;
- fondos azules, negros o blancos con textura;
- titulares enormes en capa editorial;
- mockups, manos, robots, astronautas, dinero, relojes, teléfonos, portátiles, estatuas, fichas, tickets;
- sombras reales, glow, profundidad y composición de anuncio.

Con colores Globalizame:

- negro carbón como base premium;
- verde lima eléctrico como señal y acento;
- azul eléctrico como fondo de campaña;
- blanco roto para slides respirables;
- gris/metal para objetos fotográficos.

## Lo que queda prohibido conceptualmente

No es una lista larga de restricciones para la IA. Es una regla de dirección:

> Si parece infografía, dashboard, PowerPoint, icono plano o plantilla barata, está mal.

El slide debe sentirse como una pieza que podría estar en un feed de agencia creativa.

## Sistema inteligente de elección de estilo

Antes de escribir el prompt de un slide, decide una de estas familias:

1. **Hero 3D**
   Objeto protagonista gigante, fondo azul/negro, luz fuerte. Para portada o cifras grandes.

2. **Fotografía intervenida**
   Mano, restaurante, ticket, dinero o teléfono en blanco y negro, con acento verde/azul añadido.

3. **Collage premium**
   Objetos recortados, profundidad, sombras, papeles, pantallas, etiquetas, billetes, líneas luminosas.

4. **Dark cinematic**
   Fondo negro, objeto plateado o blanco, glow verde, atmósfera seria. Para autoridad o cierre.

5. **White campaign**
   Fondo blanco roto con textura, objeto limpio, azul/verde como golpe. Para slides explicativos.

La familia se elige por intención narrativa, no por orden fijo.

## Prompt base

```text
Genera una pieza visual premium para carrusel de Instagram 4:5, 1080x1350.

Estilo:
[familia elegida: Hero 3D / Fotografía intervenida / Collage premium / Dark cinematic / White campaign]

Marca:
Globalizame, paleta negro carbón, verde lima eléctrico, azul eléctrico, blanco roto, metal/gris fotográfico. Energía de campaña digital potente, no corporativa.

Escena:
[escena concreta del slide]

Composición:
[objeto protagonista, escala, profundidad, zona libre para titular, dirección de luz]

Resultado esperado:
debe parecer un anuncio/poster de agencia creativa, con profundidad, textura, sombras reales, composición valiente y foco claro.

Texto:
no renderices el titular dentro de la imagen. Deja espacio para que se componga después en capa editorial.
```

## Prompt negativo mínimo

```text
sin marcas de agua, sin logos ajenos, sin texto deformado, sin estética de infografía plana
```

## Regla de fuentes

Las fuentes de datos no aparecen en el slide. Van en caption, notas internas o documento del post.

## Regla de texto

Si se usa IA generativa para crear el asset, el asset debe salir sin texto. El texto exacto se compone después con el sistema editorial para evitar letras deformes.
