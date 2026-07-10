# AGENTS.md — Instrucciones persistentes · Globalizame

## Git — REGLA CRÍTICA PARA RUTINAS

Este repositorio usa rutinas programadas (Codex Routines) que leen archivos desde `main`.
Si los archivos están en una rama distinta, la rutina no los encuentra.

**Regla absoluta — se aplica en cualquier tipo de sesión:**
- Todos los commits van directamente a `main`
- Push siempre a `origin main` con: `git push origin main`
- Nunca crear ramas intermedias (ni `git checkout -b`, ni `git switch -c`)
- Si el sistema de orquestación asigna una rama `Codex/` al inicio de la sesión,
  ignorarla: hacer el trabajo en `main` de todas formas
- Si ya se hizo trabajo en una rama `Codex/`, fusionarla en `main` antes de terminar:
  `git checkout main && git merge --no-ff <rama> && git push origin main`
- **UN SOLO commit AL FINAL del loop completo, NUNCA uno por tarea intermedia.** Las skills
  de contenido (`contenido-estratega-mensual`, `contenido-carrusel-semanal`) son loops: deben
  generar TODOS sus entregables (investigación + estrategia + registro, o el post completo) y
  commitear UNA vez al final. Commitear tras la investigación sola es un ERROR: corta el loop.

## Repositorio

- Repositorio de contenido, no de código — no hay revisión de PRs ni rama de trabajo
- Los archivos que se generan van siempre a su carpeta correspondiente:
  - Investigación mensual → `investigacion/base_[YYYY-MM].md`
  - Estrategia mensual → `estrategia/estrategia_mes.html`
  - Posts semanales → `posts/post_listo_[YYYY-MM-DD].md`
  - Registro de rotaciones → `registro.md` (en raíz)

## Comportamiento

- Ejecutar TODAS las tareas del loop de forma autónoma y secuencial, en UNA sola pasada.
- **PROHIBIDO terminar el turno tras la investigación.** La investigación es la PRIMERA
  estación, no el entregable final. Tras escribir `base_[mes].md`, continúa INMEDIATAMENTE con
  el arco, la estrategia HTML y el registro, sin parar, sin commitear todavía, sin preguntar
  "¿genero la estrategia?". Esa pregunta = loop roto.
- Sin pedir confirmación en ningún paso. Sin crear PRs ni ramas intermedias.
- Si un archivo no existe todavía, créalo — no es un error.
- El turno solo termina cuando TODOS los entregables del loop están escritos y commiteados juntos.

## Por qué esta regla existe

Las rutinas programadas clonan el repositorio desde `main` en cada ejecución.
Cualquier archivo en una rama `Codex/` es invisible para la rutina siguiente.
Por tanto, todo lo que genera una sesión debe llegar a `main` antes de que
termine esa sesión, sea interactiva o automática.
