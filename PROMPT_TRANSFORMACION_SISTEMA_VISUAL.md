# Prompt maestro · Transformación del proyecto en un sistema visual automatizado

> Pega este prompt en Codex o en otro agente con acceso completo al repositorio. No es un prompt para generar un carrusel aislado: es el encargo para construir el sistema que producirá todos los carruseles.

---

Actúa como **arquitecto de sistemas creativos, director de arte editorial senior, diseñador de información y especialista en automatización de contenido**.

Tu misión es transformar este repositorio de Globalizame en un sistema autónomo capaz de convertir la estrategia semanal en un carrusel completo, listo para revisar y publicar, con una consistencia visual extrema:

- consistente con la marca Globalizame;
- consistente entre todas las slides del mismo carrusel;
- reconocible entre carruseles distintos;
- potente en portada, desarrollo, infografías y cierre;
- específico para cada idea, nunca una plantilla genérica con decoración intercambiable.

No quiero que escribas una propuesta teórica ni que te limites a mejorar un prompt. **Inspecciona el repositorio, diseña la arquitectura, crea o modifica los archivos necesarios, prueba el sistema con el post semanal existente, evalúa los resultados y refina hasta que el flujo funcione de extremo a extremo.**

## Resultado que debes construir

El sistema debe recibir como entrada una estrategia de contenido o un brief semanal y producir, en una sola ejecución:

1. concepto creativo central;
2. guion narrativo slide a slide;
3. dirección de arte del carrusel;
4. una `VISUAL_BIBLE` específica de la pieza;
5. prompts de generación coordinados para todas las slides;
6. imágenes finales o artefactos renderizables, según las capacidades disponibles;
7. hoja de contacto con todas las slides juntas;
8. informe automático de control de calidad;
9. segunda generación solo de las slides que fallen;
10. archivos finales ordenados y listos para publicar.

El flujo no termina cuando existen prompts. Termina cuando el carrusel ha sido **generado, comparado como conjunto, validado y corregido**.

## Lee primero, decide después

Antes de editar:

1. Lee `AGENTS.md`, `README.md`, `registro.md`, la estrategia del mes y todos los documentos relevantes de `skill/references/`.
2. Analiza los posts existentes, en especial sus archivos de estrategia y prompts.
3. Identifica contradicciones, duplicidades y reglas que hoy dependan de interpretación.
4. Conserva la voz, propuesta de valor, honestidad comercial y lógica de embudo ya definidas.
5. Comprueba el estado de Git. Respeta el trabajo existente y las reglas del repositorio.

Hay una contradicción conocida entre **3:4 y 4:5**. No la arrastres. Elige un único formato maestro después de comprobar el canal real de generación y publicación; documenta la decisión y actualiza todas las referencias para que ninguna instrucción vuelva a contradecirla.

## Principio central: sistema, no colección de prompts

No generes cada slide como una pieza aislada.

Primero crea una identidad invariable. Después una dirección de arte específica del carrusel. Solo entonces deriva cada slide.

La jerarquía debe ser:

```text
BRAND_DNA
└── CAROUSEL_VISUAL_BIBLE
    ├── COVER_SYSTEM
    ├── CONTENT_SYSTEM
    ├── INFOGRAPHIC_SYSTEM
    └── CTA_SYSTEM
        └── SLIDE_SPECS
```

Cada nivel hereda todas las decisiones del anterior. Una slide no puede reinterpretar por su cuenta la paleta, tipografía, marco, retícula, estilo de iconos, tratamiento de datos, profundidad, iluminación o textura.

## 1. Construye un `BRAND_DNA` inequívoco

Convierte la marca existente en especificaciones ejecutables, no en adjetivos vagos. Debe definir al menos:

- formato y dimensiones exactas;
- zona segura;
- retícula con columnas, filas, márgenes y gutters;
- posición exacta del marco, firma, contador y línea verde;
- paleta con porcentajes de uso;
- un único acento principal;
- tipografías concretas, escala tipográfica, interlineado y pesos;
- reglas de alineación;
- densidad máxima de texto;
- lenguaje de iconos;
- grosor de líneas;
- radios, sombras y textura;
- estilo de fotografía o ilustración, si se permite;
- reglas de visualización de datos;
- lista explícita de recursos prohibidos.

“Editorial premium”, “tipo Stripe” o “mucho aire” no son especificaciones suficientes. Tradúcelos a decisiones observables y medibles.

El sistema debe mantener como mínimo la identidad ya fijada:

- carbón `#232323`;
- verde `#86CA28` como acento protagonista;
- morado `#700962` solo como detalle muy puntual;
- blanco y grises de soporte;
- marco, firma y contador invariantes.

## 2. Crea una `CAROUSEL_VISUAL_BIBLE` antes de crear slides

Para cada carrusel, genera primero un contrato visual breve y cerrado que contenga:

- idea visual madre;
- metáfora central;
- familia de formas;
- motivo recurrente;
- tratamiento de objetos;
- tipo de composición;
- ritmo visual entre slides;
- nivel de abstracción;
- distribución de color;
- estilo de infografías;
- reglas de continuidad;
- elementos que evolucionan de una slide a otra;
- lista de cosas que este carrusel no puede parecer.

La Biblia debe contener una **slide maestra o keyframe de referencia**. Las siguientes slides deben usar esa imagen como referencia visual cuando la herramienta de generación lo permita. No confíes solo en repetir texto: utiliza referencia de imagen, edición de la slide maestra, composición programática, seed consistente o el mecanismo más fiable disponible.

Si el generador no garantiza texto correcto, separa responsabilidades:

- genera fondos, objetos o ilustraciones con IA;
- compón tipografía, marco, contador, datos e iconos deterministas con HTML/CSS/SVG/Canvas;
- renderiza el resultado final de forma programática.

La consistencia y la ortografía importan más que presumir de haber generado toda la slide en una sola imagen.

## 3. Diseña cuatro sistemas de slide

### Portada

Debe detener el scroll en menos de un segundo.

Obligatorio:

- una sola idea;
- 6–10 palabras de titular;
- una jerarquía dominante inequívoca;
- contraste brutal;
- una imagen o metáfora con doble lectura, no un icono decorativo;
- un punto focal;
- tensión o curiosidad sin resolver la pieza;
- legibilidad a tamaño móvil;
- reconocimiento inmediato de Globalizame.

Prohibido:

- persona mirando un portátil;
- bombilla, cohete, cerebro digital, engranajes o robot;
- collage de iconos;
- degradado neón;
- estética de banco de imágenes;
- titulares flotando sobre decoración sin relación conceptual;
- “diseño tecnológico” azul genérico;
- exceso de elementos compitiendo.

### Slides intermedias

Cada slide debe cumplir una función narrativa única: contexto, tensión, prueba, mecanismo, ejemplo, objeción, síntesis o giro.

Alterna de forma deliberada:

- cifra dominante;
- comparación;
- flujo;
- mapa;
- matriz;
- cronología;
- antes/después;
- anatomía de un problema;
- checklist;
- diagrama causal;
- metáfora visual.

No repitas el mismo layout dos veces seguidas. Tampoco conviertas cada idea en “icono + titular + tres bullets”.

### Infografías

Las infografías deben explicar antes de decorar:

- representar magnitudes con proporción honesta;
- etiquetar directamente los datos;
- evitar leyendas innecesarias;
- destacar una conclusión principal;
- citar la fuente cuando exista;
- usar como máximo un color protagonista y grises de contexto;
- mantener el mismo lenguaje gráfico del carrusel;
- entenderse en tres segundos sin leer el copy del post.

No inventes cifras. No fabriques precisión visual para datos sin fuente.

### CTA y cierre

El cierre no puede parecer una diapositiva corporativa ni un cartel de venta.

Debe:

- cerrar el arco iniciado en portada;
- recuperar la metáfora o motivo visual inicial;
- dejar una sola acción;
- expresar con claridad qué obtiene el lector;
- mantener la misma potencia visual de la portada;
- aplicar el CTA correspondiente a la etapa del embudo.

Si las reglas editoriales vigentes indican que el CTA va solo en el copy, crea un cierre visual fuerte sin botón falso ni llamada a comentar dentro de la imagen. No contradigas el sistema existente.

## 4. Genera especificaciones, no prosa decorativa

Cada slide debe producir una ficha estructurada como esta:

```yaml
slide:
  number:
  role:
  narrative_job:
  reader_takeaway:
  exact_copy:
    eyebrow:
    headline:
    support:
    source:
    microcopy:
  layout:
    template_id:
    grid_areas:
    focal_point:
    reading_order:
    whitespace_ratio:
  visual:
    concept:
    metaphor:
    subject:
    composition:
    scale:
    perspective:
    material:
    lighting:
    recurring_motif:
  data_visualization:
    type:
    values:
    labels:
    source:
  color_roles:
    background:
    primary_text:
    accent:
    secondary:
  continuity:
    inherited_from_master:
    evolves_from_previous:
    prepares_next:
  generation:
    reference_assets:
    prompt:
    negative_prompt:
    seed_or_consistency_method:
  acceptance_tests:
```

Todos los textos visibles deben aparecer como cadenas exactas. El prompt no puede dejar que el modelo “redacte algo parecido”.

## 5. Introduce memoria y variación controlada

El sistema necesita memoria entre ejecuciones.

Registra:

- hook usado;
- metáfora usada;
- familia de layout usada;
- color/acento;
- tipo de infografía;
- CTA;
- número de slides;
- rendimiento cuando haya datos.

No repitas automáticamente lo que funcionó: extrae el principio, no la superficie. Evita repetir la misma portada, metáfora o composición en carruseles consecutivos.

La consistencia debe vivir en la retícula, tipografía, firma, tratamiento del color y lenguaje gráfico. La novedad debe vivir en la idea, la metáfora, el ritmo y la visualización.

## 6. Añade un juez visual independiente

Después de generar, crea una hoja de contacto y evalúa el carrusel completo, no solo slides aisladas.

Puntúa de 0 a 5:

1. impacto de portada;
2. claridad a tamaño móvil;
3. jerarquía;
4. continuidad entre slides;
5. fidelidad de marca;
6. fuerza conceptual;
7. calidad de infografías;
8. ritmo y variedad;
9. ortografía y exactitud del texto;
10. potencia del cierre.

También aplica comprobaciones binarias:

- dimensiones correctas;
- márgenes seguros;
- marco idéntico;
- firma idéntica;
- contador correcto;
- colores autorizados;
- tipografías autorizadas;
- máximo de palabras;
- fuente incluida en datos;
- ausencia de texto inventado;
- ausencia de elementos prohibidos;
- ausencia de duplicación de layouts;
- CTA coherente con el embudo.

Reglas de aceptación:

- ninguna dimensión crítica puede fallar;
- ninguna slide puede tener menos de 4/5 en marca, claridad o jerarquía;
- media total mínima de 4,3/5;
- la portada y el cierre deben alcanzar al menos 4,5/5;
- si falla una slide, regenera solo esa slide conservando la Biblia visual;
- máximo tres iteraciones por slide;
- si el conjunto sigue siendo incoherente, corrige la Biblia visual y regenera la serie completa.

El juez debe ser crítico. No aceptes una slide porque “cumple el prompt” si visualmente es mediocre.

## 7. Arquitectura esperada

Adapta los nombres a lo que ya exista, pero deja una estructura equivalente a:

```text
skill/
  references/
    brand-dna.md
    visual-grammar.md
    layout-library.md
    quality-rubric.md
  templates/
    slide-shell.*
  scripts/
    build-carousel.*
    render-slides.*
    make-contact-sheet.*
    validate-carousel.*
posts/
  post_[fecha]_[slug]/
    strategy.md
    visual-bible.md
    slides.yaml
    prompts.md
    assets/
    renders/
    contact-sheet.*
    qa-report.md
```

Debe existir un único comando o punto de entrada que ejecute el flujo entero. Debe poder reanudarse si una generación falla sin repetir trabajo correcto.

Usa datos estructurados como fuente de verdad. No copies manualmente la misma regla en diez prompts: crea componentes reutilizables y ensámblalos.

## 8. Antipatrones que el sistema debe bloquear

Rechaza automáticamente:

- diseño SaaS genérico;
- stock corporativo;
- iconografía mezclada;
- ilustración 3D aleatoria;
- neón, glassmorphism o brillos sin función;
- marcos y cabeceras que cambian entre slides;
- datos tratados como decoración;
- cinco elementos con igual peso;
- párrafos pequeños;
- composiciones centradas repetidas;
- prompts vagos;
- metáforas literales obvias;
- slides bonitas que no explican nada;
- slides útiles que parecen una plantilla barata;
- CTAs débiles;
- texto ilegible o inventado por el generador;
- cambios arbitrarios de perspectiva, material, luz o estilo.

## 9. Prueba obligatoria

No declares terminado el sistema sin ejecutar una prueba real usando el post semanal más completo que ya exista en el repositorio.

La prueba debe demostrar:

- una portada con concepto potente;
- al menos tres tipos distintos de slide intermedia;
- al menos una infografía;
- un cierre con fuerza;
- consistencia visible al observar la hoja de contacto;
- validación automática;
- regeneración selectiva de cualquier fallo.

Compara el nuevo resultado con los prompts existentes y documenta qué mejora de forma objetiva.

## 10. Entregables y criterio de finalización

Entrega:

1. sistema implementado;
2. documentación mínima para ejecutarlo;
3. archivos de marca y gramática visual;
4. biblioteca inicial de layouts;
5. generador de especificaciones y prompts;
6. render o integración con el generador disponible;
7. hoja de contacto;
8. validador y rúbrica;
9. carrusel de prueba;
10. informe breve de decisiones y limitaciones reales.

No preguntes por preferencias que puedas deducir de los archivos. Si falta una decisión técnica, toma la opción que maximice consistencia, editabilidad y calidad visual, y documéntala.

Trabaja de forma autónoma hasta completar el loop. Haz un único commit final en `main` y push a `origin main`, siguiendo `AGENTS.md`. No crees ramas ni PR.

Tu estándar no es “se ve profesional”.

Tu estándar es este: si oculto el logo, todas las slides siguen pareciendo inequívocamente parte del mismo carrusel; si mezclo varias publicaciones, todas siguen pareciendo inequívocamente Globalizame; y cada slide merece existir porque comunica una idea mejor de lo que podría hacerlo un bloque de texto.
