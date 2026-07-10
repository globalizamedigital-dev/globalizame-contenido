# Globalizame Content OS

Sistema manual de producción de contenido para Globalizame. Tú decides cuándo se ejecuta. No hay horarios, rutinas ni procesos esperando a que el PC esté encendido.

## Cómo se usa

Abre este proyecto en Codex y escribe uno de estos comandos:

```text
$investigador
$productor
$lead-magnet
```

`$investigador` actualiza la base de fuentes y el calendario del mes dentro de `recursos/`. `$productor` toma la siguiente idea del calendario y genera el carrusel, los copys, las fuentes y el QA. `$lead-magnet` construye el recurso de la pieza que lo necesite.

No tienes que ejecutar scripts ni dejar el ordenador encendido. El ordenador solo debe estar encendido mientras Codex trabaja con el comando que acabas de pedir. Si lo apagas durante una ejecución, el trabajo se interrumpe y tendrás que reanudarlo después.

## Estructura

```text
.agents/skills/   comandos de Codex
recursos/         fuentes, voz, estrategia y referencias visuales
content-os/       motor, controles, estado y panel
outputs/          publicaciones y recursos producidos
```

`recursos/` es la única entrada editorial. `outputs/` es la única salida. No dupliques archivos en otras carpetas.

## Comandos técnicos opcionales

Solo hacen falta para diagnóstico o desarrollo del motor:

```powershell
npm test
npm run content:plan -- 2026-07-10
npm run content:run -- 2026-07-10
npm run content:validate
npm run content:serve
```

El panel local abre en `http://127.0.0.1:4173` mientras `npm run content:serve` está activo. La producción queda siempre en borrador.
