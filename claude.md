# CLAUDE.md — Instrucciones persistentes · Globalizame

## Git
- Todos los commits van directamente a `main`
- Nunca crear ramas de trabajo intermedias
- Nunca usar `git checkout -b` ni `git switch -c`
- Push siempre a `origin main`
- Un commit por tarea completada, con mensaje descriptivo en español

## Repositorio
- Repositorio de contenido, no de código — no hay revisión de PRs
- Los archivos que se generan van siempre a su carpeta correspondiente:
  - Investigación mensual → `investigacion/base_[YYYY-MM].md`
  - Estrategia mensual → `estrategia/estrategia_mes.html`
  - Posts semanales → `posts/post_listo_[YYYY-MM-DD].md`
  - Registro de rotaciones → `registro.md` (en raíz)

## Comportamiento
- Ejecutar todas las tareas de forma autónoma y secuencial
- Sin pedir confirmación en ningún paso
- Sin crear PRs ni ramas intermedias
- Si un archivo no existe todavía, créalo — no es un error
