# Globalizame Content OS

Sistema autónomo para convertir `recursos/` en carruseles 4:5, copys, fuentes y QA verificable.

## Fuente de verdad

El motor solo consume:

- `recursos/base_YYYY-MM.md`
- `recursos/estrategia_mes.html`
- `recursos/voz_mario.md`
- `recursos/embudo_carruseles.md`
- `recursos/carrusel/`

Las carpetas históricas se conservan como archivo, no como instrucciones de producción.

## Honestidad comercial

Globalizame no tiene clientes ni casos propios. El validador bloquea cualquier pieza que sugiera lo contrario y exige atribución explícita para resultados externos.

## Uso

```powershell
npm test
npm run content:plan -- 2026-07-10
npm run content:run -- 2026-07-10
npm run content:validate
npm run content:serve
```

El panel operativo se sirve en `http://127.0.0.1:4173`. Los artefactos aprobados quedan en `outputs/`. La publicación continúa en modo borrador.
