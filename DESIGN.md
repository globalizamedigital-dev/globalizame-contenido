# Globalizame Carousel Design System

## Visual Theme

Sistema editorial de precisión con tensión gráfica: fondo carbón, tipografía blanca de alta legibilidad, verde ácido como señal funcional y diagramas construidos con geometría simple. La referencia no es una revista decorativa, sino un informe de operaciones convertido en cartel.

## Color Palette

- Canvas: `#232323`
- Ink: `#F5F5F2`
- Muted ink: `#A7A7A2`
- Structural line: `#444444`
- Primary accent: `#86CA28`
- Reserved accent: `#700962`, máximo 3% de superficie
- Deep surface: `#191919`

El carbón ocupa 75–88% de cada slide. El verde ocupa 6–12%. El morado no puede ser protagonista.

## Typography

- Display: `Aptos Display`, fallback `Arial`
- Body: `Aptos`, fallback `Arial`
- Headline cover: 104–132 px, 800, line-height 0.92
- Headline content: 72–92 px, 750, line-height 0.98
- Supporting copy: 34–42 px, 500, line-height 1.18
- Metadata: 22–26 px, 600
- Source: 18–22 px, 400

Máximo 18 palabras visibles por slide, salvo una checklist deliberada. Nunca reducir el cuerpo por debajo de 32 px para encajar más texto.

## Layout

Lienzo 1080×1350. Marco en `x=40`, `y=40`, `w=1000`, `h=1270`. Zona de contenido: `x=88..992`, `y=168..1240`. Retícula de 12 columnas, gutter 20 px. Unidad base: 8 px.

La cabecera es invariable. El contenido alterna tensión izquierda/derecha, escala y densidad. Dos slides consecutivas no comparten familia de layout.

## Brand Shell

- Firma: `Mario Ruiz` y `Founder · Globalizame`, arriba izquierda.
- Contador de dos dígitos, arriba derecha.
- Línea verde de 68×4 px bajo el contador.
- Marco de 1 px `#444444`.
- Sin logo adicional ni firma repetida al pie.

## Imagery

Metáforas geométricas, diagramas y visualización de datos. Una imagen debe explicar una relación. Perspectiva frontal o isométrica muy leve; nunca mezclar estilos dentro de una serie. Sombras duras y discretas, no brillos.

## Components

- `brand-shell`: marco, firma, contador.
- `display-headline`: titular y palabra acento.
- `metric`: cifra dominante más contexto.
- `dot-matrix`: proporciones sobre 100 unidades.
- `flow`: movimiento causal con flechas y nodos.
- `split`: comparación de dos estados.
- `timeline`: secuencia temporal.
- `closing-loop`: recupera el motivo de portada.
