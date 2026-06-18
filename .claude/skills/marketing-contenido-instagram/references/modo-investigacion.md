# MODO INVESTIGACIÓN + ESTRATEGIA

> Estratega de contenido mensual de Globalizame. Diseña la estrategia de Instagram del mes entrante.
> Loop tipo cadena: las 4 tareas se ejecutan SEGUIDAS, en una sola pasada, sin parar entre ellas.

```
INVESTIGAR (T1) → ARCO (T2) → ESTRATEGIA HTML (T3) → REGISTRO (T4) → UN SOLO COMMIT
```

**PROHIBIDO** terminar el turno o commitear tras la T1. La investigación es la primera estación, no el entregable final.

## Criterio de HECHO (los 4)
- ☐ `investigacion/base_[YYYY-MM].md` con sus 3 secciones (datos aprobados, casos reales, descartados).
- ☐ `estrategia/estrategia_mes.html` NO vacío, con los 13 posts + 4 lead magnets.
- ☐ `registro.md` actualizado con mes y tema central.
- ☐ Commit + push a `main` (uno solo).

---

## TAREA 1 · INVESTIGACIÓN PROFUNDA

Al menos 10 búsquedas WebSearch (suscripción) sobre datos de fondo del mes:
- Productividad y tiempo perdido en PYMEs españolas
- Coste operativo y administrativo de PYMEs en España
- Tiempo de respuesta a leads y conversión en España
- Casos reales de negocios que recuperaron tiempo (cualquier sector)
- Datos de INE, CEPYME, Qonto, Sage, Eurostat, MuyPymes, Factorial

Filtra cada dato con 3 tests:
1. ¿Tiene cifra concreta (horas, euros, %, días)? Si no → descarta.
2. ¿Lo entiende un dueño de bar sin contexto técnico? Si no → descarta.
3. ¿La fuente es verificable con nombre? Si no → descarta.

Guarda en `investigacion/base_[YYYY-MM].md`:
- Tabla de datos aprobados: dato | cifra | fuente | url
- Casos reales aprobados: sector | qué cambió | resultado en cifras | fuente
- Descartados: dato | razón
- (Recomendado, según el formato del repo) organizar por pilar 1-5 con traducción a copy y hook sugerido.

**NO commitees aquí. Sigue con la T2.**

## TAREA 2 · ARCO DEL MES

5 sprints semanales con esta progresión SIEMPRE:
- Semana 1: TOFU — EL ESPEJO (problema visible)
- Semana 2: TOFU→MOFU — LA OTRA FORMA (existe otra manera)
- Semana 3: MOFU — PRUEBA REAL (así funciona, con datos)
- Semana 4: MOFU→BOFU — LA DECISIÓN (coste de no actuar)
- Cierre: BOFU — LA SESIÓN (30 min, sin compromiso)

Ritmo Lun/Mié/Vie. 13 posts + 4 lead magnets.

Por cada post: título anclado a un dato real · Etapa (TOFU/MOFU/BOFU) · Formato (Carrusel/Lead Magnet) · Tipo de CTA (Recurso/Conversación/Sin petición) · Palabra clave del CTA si aplica.

Filtro por título:
1. ¿Menciona IA, automatización, bot, workflow? → REESCRIBIR
2. ¿Promete resultado récord sin contexto? → REESCRIBIR
3. ¿Habla de proceso en vez de problema/resultado? → REESCRIBIR
4. ¿Un dueño de bar lo entiende en 3 segundos? → APROBAR

## TAREA 3 · GENERAR HTML

Genera `estrategia/estrategia_mes.html` usando la del mes anterior como plantilla exacta de formato, CSS y estructura. Cambia solo: fechas del mes (Lun/Mié/Vie reales), títulos, datos, CTAs, palabras clave, los 4 lead magnets. Mantén: paleta Globalizame (#232323 fondo, #86CA28 verde), checklist interactivo, arco visual de 5 pasos, sprint cards.

Si NO existe estrategia previa → genera el formato desde `skill/references/brand_system.md`.

## TAREA 4 · ACTUALIZAR REGISTRO

Actualiza `registro.md`: mes procesado · tema central · datos clave usados (máx. 3, con fuente) · Estado: Estrategia generada.

## CIERRE · GIT (un solo commit)

```bash
cd "D:/Globalizame/proyectos/contenido-instagram"
git add -A
git commit -m "feat(estrategia): base + estrategia [MES] — <tema central>"
git push origin main
```

## Reglas
- Nunca inventar datos, cifras, nombres ni fuentes.
- No repetir temas idénticos al mes anterior (lee `registro.md`).
- Confirmar el mes objetivo si hay ambigüedad. No regenerar contenido borrado a propósito sin preguntar.
- Todo autónomo y secuencial. Suscripción siempre: WebSearch + Write.
