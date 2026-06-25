# Benchmarks de Carrusel · IG + LinkedIn

> Destilado accionable para que `/productor` decida tipo, nº de slides, gancho y CTA con criterio. Datos 2024-2026; en ausencia de cifra exacta, usar los rangos. Verificar siempre con A/B propios.

## Ratio y dimensiones

Estándar único del sistema: **3:4 (Retrato)** — es el vertical que ofrece ChatGPT, donde Mario genera las imágenes. No existe 4:5 en ChatGPT.

- **Instagram:** se sube como carrusel de imágenes. 3:4 ocupa buena parte del feed móvil. Margen seguro 80px; evita texto/caras en bordes (el perfil recorta).
- **LinkedIn:** se sube como **PDF multipágina** (post de documento). Mismo 3:4. PDF < 10 MB.
- Mismo visual para ambas redes; cambia solo el copy del post.

## Número de slides

Regla de oro: **1 idea = 1 slide**. Cada slide justifica su existencia.

| Red | Rango óptimo | Notas |
|-----|--------------|-------|
| Instagram | **7-10** (rango 5-12) | <5 el algoritmo deja de potenciarlo; >12-15 cae la tasa de finalización. Tips breves pueden ir a 5; contenido educativo profundo 8-12. |
| LinkedIn | **6-10** | <5 páginas pierde el bono algorítmico; >12 penaliza la finalización. B2B rinde mejor en 8-10. |

Tipos de carrusel y sus rangos en `system-prompt-carrusel.md` §3. Nunca 4-5 slides.

## 7 fórmulas de gancho de portada

1. **Vacío de información** (curiosidad): "Lo que nadie te dice sobre [tema]".
2. **Pérdida inminente** (riesgo): "El error en X que te está costando Y".
3. **Ataque al status quo** (contradicción): "Por qué [creencia común] es el peor consejo en 2026".
4. **Pregunta conspirativa** (validación del dolor): "¿Soy el único harto de [problema]?".
5. **Ahorro de tiempo** (beneficio): "Deja de hacer [proceso largo] y haz esto (ahorra X horas)".
6. **Lista curada** (masticable): "5 herramientas gratuitas que uso para [resultado]".
7. **Storytelling incompleta** (chisme narrativo): "Cómo logré [resultado] haciendo X".

Destaca la palabra clave con el color de acento. No repitas el mismo tipo de gancho que la semana pasada (mira `registro.md`).

## Estructura narrativa

- **Slide 1:** gancho/tema, NO resuelve.
- **Slide 2:** empatía / problema ("¿Te pasa esto?") para enganchar.
- **Medios:** valor — pasos, datos, ejemplos. Una idea por slide.
- **Penúltimo:** síntesis / tabla / antes-después.
- **Último:** CTA claro (solo en copy del post).
- **Microcopy:** "Desliza →" para animar el swipe en intermedios.

Si la audiencia deja de deslizar pronto, el problema está en el slide 1.

## Diseño según objetivo

| Objetivo | Formato | Tono | CTA típico |
|----------|---------|------|------------|
| **Saves** | educativo / recursos / checklist / framework | instructivo, útil, evergreen | "Guarda esto para más tarde" |
| **Shares** | relatable / encuesta / "etiqueta a quien…" / afirmación polarizante | cercano, divertido | "Comparte con quien lo necesite" / "Etiqueta a un colega" |
| **Autoridad** | datos / casos / cifras / testimonios | serio, creíble, escena editorial con la cifra protagonista | "Sígueme para más" / "Comenta tu opinión" |

Mapea el objetivo al tipo de cierre del sprint (`flujo_produccion.html`): recurso → saves, conversación → shares, autoridad → autoridad.

## Métricas objetivo

- **Swipe-through rate ≥ 50%** (la mayoría llega casi al final). Si baja → revisa el slide 1.
- **Saves ≥ 5-10%**. Si faltan → revisa el contenido educativo.
- Mide también shares y comentarios.
- Referencia de engagement: carrusel IG ~0.5-1.0%; carrusel LinkedIn ~5-7% (hasta ~6× un post de solo texto). Los carruseles baten a Reels e imágenes en saves (2-3×).

## Ideas de A/B test

- **Gancho:** curiosidad vs contradicción → mide swipe-through.
- **Longitud:** 5 vs 10 slides del mismo tema → mide finalización.
- **CTA:** "Guárdalo" vs "Compártelo" → mide saves vs shares.
- **Visual:** posición del CTA (último slide vs uno antes con flecha de aviso).
