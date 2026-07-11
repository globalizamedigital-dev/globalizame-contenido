---
name: investigador
description: Comando manual para investigar y preparar el calendario mensual de Globalizame desde los recursos canónicos.
---

# Investigador

Comando manual. No crear ni depender de tareas programadas.

Usar `content-loop` (skill) y completar el ciclo mensual en una sola ejecución:

1. Leer los recursos canónicos y detectar el mes que falta o necesita revisión.
2. Investigar y verificar cada fuente primaria necesaria.
3. Escribir `recursos/base_YYYY-MM.md`.
4. Crear o actualizar `recursos/estrategia_mes.html` con el calendario completo.
5. Comprobar que cada idea tiene evidencia, etapa del embudo y CTA viable.
6. Ejecutar los tests y cerrar con un único commit en `main`.

No producir afirmaciones que sugieran clientes o resultados propios.
