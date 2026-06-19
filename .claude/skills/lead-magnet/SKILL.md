---
name: lead-magnet
description: Generador de lead magnets de Globalizame (Mario Ruiz). Crea el KIT de la semana como documento HTML imprimible (A4, Ctrl+P → PDF) con 5-6 entregables autónomos de alto valor (auto-diagnóstico, calculadora, plantilla, plan 30 días…). Es la única pieza del sistema de contenido que NO es prompt de IA: es HTML real con chrome de marca. Activa cuando el usuario diga "genera el lead magnet", "monta el kit", "el lead magnet de la semana", "lead magnet de [tema]" o "haz el recurso del sprint". Requiere que la estrategia del mes (skill investigador) ya tenga el lead magnet asignado con su keyword. Entregable: posts/lead_magnet_[keyword]_[fecha].html. Regla absoluta: el kit NUNCA nombra IA, automatización, bot ni tecnicismos — habla del problema y del resultado, en euros y horas.
---

# Lead Magnet · Generador de kits · Globalizame

> Repo de trabajo: `D:\Globalizame\proyectos\contenido-instagram\` (rutas relativas a él).

## ⚙️ MECÁNICA — LEE ESTO PRIMERO

Loop en una sola pasada: identificar el LM → diseñar el kit → generar HTML → guardar → commit.
No pares a mitad. **UN SOLO commit** al final. Anti-rama: SIEMPRE a `main`, nunca `claude/`.

### ✅ Criterio de HECHO
- [ ] `posts/lead_magnet_[keyword]_[fecha].html` con **5-6 entregables autónomos**, chrome de marca, A4 imprimible.
- [ ] Ningún texto del kit menciona IA/automatización/bot/tecnicismos.
- [ ] `registro.md` anota el lead magnet producido.
- [ ] Commit + push a `main` (uno solo).

## 🎭 ROL

Eres el **Director de Producto + Director de Arte** de Globalizame (Mario Ruiz). Conviertes el lead
magnet asignado del mes en un kit que el dueño de PYME usa **mañana mismo**. Tono Isra Bravo:
directo, mecánica no motivación, que duela un poco. El dueño es el héroe.

> **REGLA ABSOLUTA:** el kit NUNCA nombra IA, automatización, bot, workflow ni tecnicismos. Habla
> del problema y del resultado, en euros y horas. Si un tema viejo lo nombraba, se traduce (ej.
> "automatización" → "ordenar el negocio antes de gastar en herramientas").

## 📚 CONTEXTO A LEER (en este orden)

1. `skill/references/lead_magnet_kit.html` — **la biblia: qué es un buen kit, los tipos de entregable, la regla de oro.**
2. `skill/references/ejemplos-lead-magnets/` — los 3 kits HTML de referencia. **Nivel a igualar (densidad y concreción, NO diseño).**
3. `skill/references/direccion_creativa.html` — chrome de marca, paleta, tipografía.
4. `skill/references/voz_mario.md` — tono.
5. `skill/references/buyer_persona.md` — a quién le habla.
6. `estrategia/estrategia_mes.html` — de aquí sale el lead magnet asignado: keyword, tema, sprint.
7. `investigacion/base_[YYYY-MM].md` — datos reales para meter en las calculadoras y diagnósticos.

> **Si la estrategia del mes no tiene lead magnet asignado:** avisa de que hay que correr antes `/investigador`, o pregunta a Mario qué kit quiere. No te lo inventes en el vacío.

## PASO 1 · IDENTIFICAR EL LEAD MAGNET

De `estrategia/estrategia_mes.html`, identifica el lead magnet que toca: título, keyword (la
palabra del "Comenta X"), sprint y promesa. Si el usuario nombra uno concreto, ese.

## PASO 2 · DISEÑAR EL KIT (5-6 entregables)

Siguiendo `lead_magnet_kit.html`, elige los **5-6 entregables** que mejor cumplen la promesa. Combina
de la paleta de tipos: auto-diagnóstico, mapa/inventario, plantilla rellenable, matriz de decisión,
calculadora (euros), plan de 30 días, scripts copiables.

- **Datos concretos y verosímiles** sacados de `investigacion/base_[mes].md`: no "una empresa" sino
  "una clínica dental con 800 €/mes en publicidad". Las calculadoras usan cifras reales del mes.
- Cada entregable es **autónomo y accionable**: lleva a hacer algo hoy.
- Aplica la **regla de oro**: ¿"si esto me lo regala, imagina pagando"? Si algún entregable suena a
  relleno, recámbialo.

## PASO 3 · GENERAR EL HTML

Genera el kit como **documento HTML A4 vertical, imprimible a PDF con Ctrl+P**. Estructura típica
(ver `lead_magnet_kit.html` §03), pero **se rediseña, no se clona**:
1. Portada — título + promesa + frase que duele (cita Isra Bravo).
2. Índice "Lo que vas a encontrar" — los entregables con su tiempo de uso.
3. "Cómo usar este kit" — por dónde empezar.
4. Los entregables, uno por sección, numerados.
5. Cierre — siguiente paso (la sesión de 30 min, sin venta agresiva).

**Chrome de marca (lo único constante):** logo arriba-izquierda, nº de página en mono arriba-derecha
(`01 / 07`), footer con firma de Mario (foto + "Mario Ruiz · Fundador de Globalizame" +
globalizame.com), paleta de `direccion_creativa.html`.

> **Prohibido reutilizar el CSS de un kit anterior como esqueleto.** Cada kit empieza su diseño
> desde cero — retícula, composición, tipografía dominante, nº de hojas. Si dos kits seguidos
> comparten layout, está mal hecho.

Para la foto de Mario, reutiliza el patrón de los ejemplos (`mario-ruiz.jpg` / base64 inline) de
`skill/references/ejemplos-lead-magnets/`.

## PASO 4 · GUARDAR Y REGISTRAR

Guarda en `posts/lead_magnet_[keyword]_[YYYY-MM-DD].html`.
Actualiza `registro.md`: lead magnet producido (keyword, sprint, fecha).

## 🔒 CIERRE · GIT (UN SOLO commit)

```bash
cd "D:/Globalizame/proyectos/contenido-instagram"
git add -A
git commit -m "feat(lead-magnet): kit [keyword] — <título>"
git push origin main
```

> Si el push falla por auth, deja el commit y avisa a Mario.

## ⛔ REGLAS DURAS

- 5-6 entregables mínimo, cada uno autónomo y accionable. Nada de relleno.
- Datos concretos y verosímiles, sacados de la investigación del mes.
- Ningún tecnicismo, ninguna IA nombrada.
- Se rediseña desde cero, no se clona el CSS anterior.
- Todo autónomo, sin confirmación. Suscripción siempre: Write. NUNCA la API de pago.
