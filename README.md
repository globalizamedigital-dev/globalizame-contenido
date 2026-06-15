# Sistema de Contenido · Globalizame

Sistema autónomo de producción de contenido de Instagram para Globalizame (Mario Ruiz).

## Cómo funciona

Dos routines de Claude Code mantienen vivo este sistema:

- **Routine 1 · ESTRATEGA** (mensual, día 1) — investiga el panorama del mes y construye la estrategia con datos reales. Punto de control humano antes de producir.
- **Routine 2 · PRODUCTOR** (semanal, lunes) — refresca datos del post de la semana y genera prompts para ChatGPT + copy listo.

## Estructura

```
/skill/references/   Reglas del sistema: marca, voz, pilares, buyer persona
/estrategia/         Estrategia del mes en curso (estrategia_mes.html)
/investigacion/      Informes de investigación (se llena solo)
/posts/              Posts listos para publicar (se llena solo)
/registro.md         Estado de rotaciones de color y hook (memoria viva)
```

## Regla de oro

El contenido nunca habla de IA ni tecnología. Habla del problema que resuelve, en el idioma del dueño de negocio. Datos reales siempre, traducidos a euros y horas.
