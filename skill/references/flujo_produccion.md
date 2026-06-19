# Flujo de Producción · Globalizame

> Cómo se fabrica cada pieza y por qué nunca se descuadra. Importado y adaptado del sistema de
> carruseles. El formato de salida ahora es prompt de IA para carruseles + HTML para lead magnets.

---

## 01 · Libertad con suelo alto

No hay una dirección visual fija por pieza. Claude diseña cada carrusel desde cero según lo que el
contenido pide: composición, ritmo, gancho, número de slides. **Lo único constante es el chrome de
marca y la paleta** (ver `direccion_creativa.md`). El resto es decisión creativa pieza a pieza.

- **Formato fijo:** 4:5 (1080×1350). Siempre. Óptimo en móvil.
- **Número de slides/hojas:** lo decide el contenido y la densidad de ideas. Ni uno de relleno, ni
  uno de menos. No hay número mágico.
- **Visual por slide:** cada slide explica su idea con un elemento visual (escena, diagrama, mock,
  big number, nodos). Nunca texto solo.

---

## 02 · La semana — el sprint

**Lunes, miércoles, viernes.** Esta cadencia es FIJA: es el latido de publicación. Todo lo demás
(cuántos sprints tiene el mes, cuántos lead magnets, cuántos posts en total) lo decide el contenido.

Cada sprint es una semana con arco de embudo. Tres piezas, **tres cierres distintos** (ver abajo).
**El lead magnet del sprint es uno solo, no uno por carrusel** — se produce desde el lunes y se
lanza el día asignado del sprint.

---

## 03 · Los 3 tipos de cierre — y la regla de oro

> **El "Comenta X" NO va en todos los cierres.** La palabra clave solo tiene sentido cuando hay un
> recurso que entregar (el lead magnet). Es el peaje a cambio del kit. Ponerla en los otros cierres
> convierte cada post en un embudo y la quema. Mientras el volumen sea bajo, las conversaciones se
> abren a mano — es más humano y convierte más.

| Cierre | Cuándo | Mecánica |
|--------|--------|----------|
| **Recurso** | Solo la pieza que lanza el lead magnet del sprint (máx. 1/semana) | "Comenta [KEYWORD]" → auto-DM entrega el kit. |
| **Conversación** | ~1 por semana, posts donde quieres diálogo | Pregunta abierta en comentarios · Mario responde a mano y pasa a privado. Puede llevar palabra clave de bajo compromiso. |
| **Autoridad / sin petición** | ~1 por semana, posts de marca | Remate potente, pregunta abierta o "guárdalo". Sin keyword, sin DM-funnel. Es el de más alcance orgánico. |

**Regla de rotación:** cada semana mezcla los tres. No repitas el mismo cierre tres días seguidos.
El slide de CIERRE del carrusel nunca lleva CTA — es solo branding.

---

## 04 · Qué hay en cada pieza (formato actual)

El sistema nuevo guarda en `posts/`:
- `post_listo_[YYYY-MM-DD].md` — prompts de los slides + copy del post + DM si lleva keyword + registro de sesión.
- `lead_magnet_[keyword]_[fecha].html` — solo cuando el sprint lanza lead magnet (lo genera la skill `lead-magnet`).

El registro de rotaciones y el historial van en `registro.md` (raíz).

---

## 05 · El pipeline — de brief a pack listo

1. **Brief** — Claude define enfoque, gancho y estructura según el sprint y la etapa del embudo.
2. **Diseño del carrusel** — nº de slides según el contenido; ritmo de color propio; variedad de
   fondos y layouts. Cero plantilla.
3. **Verificación** — revisar cada slide: jerarquía limpia, ningún titular menciona IA/tecnicismos,
   dato real con fuente. Pasar el copy por `humanizer`.
4. **Copy** — post.md y DM (si aplica) en texto plano, tono Isra Bravo, listos para pegar.
5. **Lead magnet** — si el sprint lo lleva: skill `lead-magnet` genera el kit HTML.
6. **Entrega** — pieza completa. Mario revisa, aprueba, publica.
