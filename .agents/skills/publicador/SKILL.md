---
name: publicador
description: Ingiere los PNG generados con GPT Image 2.0 desde inbox/, hace la reseña visual honesta, valida QA y programa el borrador en Metricool. Único paso manual: soltar los PNG en inbox/.
---

# Publicador

Comando manual. No crear ni depender de tareas programadas.

Cierra el ciclo que deja abierto `content:run` en `WAITING_ON_IMAGE_GENERATION`.

1. Ejecutar `npm run content:ingest`. Asigna los PNG de `inbox/` a la pieza
   pendiente más antigua y los renombra a `outputs/<id>/final/slide-NN.png`.
   Si el resultado es `COUNT_MISMATCH` o `DIMENSION_MISMATCH`, no se movió
   nada: corregir el lote de `inbox/` antes de reintentar.
2. Leer cada PNG final y escribir `outputs/<id>/imagegen.json` con la reseña
   visual real (contrato exacto en `content-os/lib/qa.mjs`:
   `hook_visual_review`, `labels_visual_review`, `cta_visual_review`). Nunca
   aprobar sin haber mirado la imagen.
3. Ejecutar `npm run content:validate`. Si `BLOCKED`, corregir la causa real
   (regenerar la slide o corregir la reseña) -- nunca forzar el pase.
4. Ejecutar `npm run content:queue` para meter la pieza `APPROVED` en
   `content-os/state/publish-queue.json`.
5. Si el MCP de Metricool está conectado, programar el borrador de cada
   pieza `pending` con `post_schedule_post` (nunca publicación directa) y
   marcarla `scheduled` en la cola. Si no está conectado, avisar y parar ahí
   sin perder el trabajo ya hecho.
