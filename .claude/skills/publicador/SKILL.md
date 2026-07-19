---
name: publicador
description: Ingiere los PNG generados con GPT Images 2.0 desde inbox/, hace la reseña visual honesta, valida QA y programa el borrador en Metricool. Es el único paso manual del content-loop: soltar los PNG en inbox/ y decir "publicador".
---

# Publicador

Comando manual. No crear ni depender de tareas programadas.

Cierra el ciclo que `content-loop`/`productor` deja abierto en
`WAITING_ON_IMAGE_GENERATION`: coge los PNG que Mario generó con GPT Images 2.0
a partir de `imagegen-prompts.md` y los ha soltado en `inbox/`, los asigna a la
pieza correcta, hace la reseña visual real (mirando las imágenes, no
inventando), valida, y programa el borrador en Metricool. La única acción
humana en todo el ciclo de publicación es soltar los PNG en `inbox/` y
aprobar el borrador dentro de Metricool.

## Ejecución

1. Ejecutar `npm run content:ingest`.
   - `EMPTY`: no hay PNG en `inbox/`. Informar y parar.
   - `NO_PENDING_PIECE`: no hay ninguna pieza esperando imagen. Informar y parar.
   - `COUNT_MISMATCH` o `DIMENSION_MISMATCH`: no se movió nada. Explicar el
     fallo exacto (cuántos PNG hay vs cuántos hacen falta, o qué archivo no
     mide 1080x1350) y parar. No renombrar ni recortar nada a mano para forzar
     el paso.
   - `INGESTED`: los PNG ya están en `outputs/<id>/final/slide-NN.png`. Continuar.

2. Leer cada PNG de `outputs/<id>/final/` con la herramienta de lectura de
   imágenes (soporta PNG). Comparar contra `spec.json` de esa pieza:
   - Portada (`hook`): ¿protagoniza el robot de marca la escena? ¿es una sola
     escena, no un collage de tarjetas+cifras+robot? ¿es disruptiva, relevante
     y se entiende en dos segundos? ¿el estilo (blanco/negro/naranja
     #FF4B0B, render 3D producto) coincide con `recursos/carrusel/`?
   - Etiquetas: ¿el chip superior de cada slide es el texto adaptativo del
     spec (nunca "DATO 01" fijo)? ¿aparece algún contador de slide tipo
     "1/6" en alguna esquina? Si aparece, es un fallo real, no se aprueba.
   - Cierre (`cta`): ¿el robot protagoniza la acción (no un icono gigante
     suelto)? ¿máximo 2 bloques de texto? ¿repite algún concepto visual de
     una slide anterior de la misma pieza?
   - Titular y apoyo: ¿el texto renderizado en la imagen coincide con
     `slide.headline` / `slide.support` del spec, sin erratas ni texto de más?

3. Escribir `outputs/<id>/imagegen.json` con el resultado real de esa
   inspección, siguiendo el contrato exacto de
   `content-os/lib/qa.mjs` (buscar `hook_visual_review`,
   `labels_visual_review`, `cta_visual_review` en ese archivo para los campos
   exactos que exige). Si algo no pasa, marcarlo como `false`/con el defecto
   real -- nunca escribir una reseña que apruebe algo que no se ha mirado.

4. Ejecutar `npm run content:validate`.
   - Si `BLOCKED`: leer los `failures`, decidir si el defecto es de imagen
     (hay que regenerar esa slide con GPT Images 2.0 y repetir desde el paso 1
     con esa slide en `inbox/`) o de reseña (corregir `imagegen.json` para que
     refleje la realidad). Nunca alterar el spec o el copy para forzar el pase.
   - Si `APPROVED`: continuar.

5. Ejecutar `npm run content:queue`. Añade/actualiza la pieza en
   `content-os/state/publish-queue.json` con status `pending`.

6. Para cada item `pending` de la cola:
   - Si el MCP de Metricool no está conectado todavía (sin
     `METRICOOL_USER_TOKEN`/`METRICOOL_USER_ID` configurados), informar a
     Mario que faltan las credenciales y parar aquí -- el resto del pipeline
     (ingest, reseña, QA, cola) ya quedó hecho y no se pierde nada.
   - Si está conectado: usar `get_best_time_to_post` de Metricool para la red
     y fecha de la pieza como referencia, luego `post_schedule_post` con
     `caption_instagram` (o el copy de cada red si el MCP permite multi-red en
     una llamada) y las rutas de `images[]`, en modo **borrador** (nunca
     publicación directa: la política de `AGENTS.md` es que Mario aprueba
     antes de que salga nada).
   - Guardar el resultado con `markScheduled` (`content-os/lib/queue.mjs`) o
     editando `publish-queue.json` directamente si no hay helper expuesto por
     CLI: `status: "scheduled"`, `metricool_ids`, `scheduled_at`.

7. Reportar a Mario: qué piezas quedaron programadas como borrador en
   Metricool (con enlace si el MCP lo devuelve) y qué piezas, si alguna, se
   quedaron bloqueadas y por qué.

## Reglas

- Nunca marcar `imagegen.json` como aprobado sin haber leído las imágenes.
- Nunca editar `spec.json` ni el copy para que el QA pase artificialmente.
- Nunca programar en Metricool en modo publicación directa: siempre borrador.
- Si `inbox/` tiene más o menos PNG de los que pide la pieza pendiente, no
  intentar adivinar el reparto -- pedir a Mario que corrija el lote.
- Un solo commit al final, igual que el resto de comandos del content-loop.
