---
name: investigador
description: Comando manual para investigar y preparar el calendario mensual de Globalizame desde los recursos canónicos.
---

# Investigador

Comando manual. No crear ni depender de tareas programadas.

Usar `$content-loop` y completar el ciclo mensual en una sola ejecución:

1. Leer los recursos canónicos y detectar el mes que falta o necesita revisión.
2. Investigar y verificar cada fuente primaria necesaria.
3. Escribir `recursos/base_YYYY-MM.md`.
4. Crear o actualizar `recursos/estrategia_mes.html` con el calendario completo.
5. Comprobar que cada idea tiene evidencia, etapa del embudo y CTA viable.
6. Verificar cada idea contra `recursos/posicionamiento.md`: debe responder a una pregunta que un empresario se haría, declarar qué decisión de negocio ayuda a tomar, tratar la IA como medio y ser atemporal. Las ideas que no pasen se descartan o se reformulan, dejando constancia del motivo.
7. Ejecutar los tests y cerrar con un único commit en `main`.

No producir afirmaciones que sugieran clientes o resultados propios.
