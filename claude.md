# CLAUDE.md — Instrucciones persistentes · Globalizame

## Git — REGLA CRÍTICA PARA RUTINAS

Este repositorio usa rutinas programadas (Claude Code Routines) que leen archivos desde `main`.
Si los archivos están en una rama distinta, la rutina no los encuentra.

**Regla absoluta — se aplica en cualquier tipo de sesión:**
- Todos los commits van directamente a `main`
- Push siempre a `origin main` con: `git push origin main`
- Nunca crear ramas intermedias (ni `git checkout -b`, ni `git switch -c`)
- Si el sistema de orquestación asigna una rama `claude/` al inicio de la sesión,
  ignorarla: hacer el trabajo en `main` de todas formas
- Si ya se hizo trabajo en una rama `claude/`, fusionarla en `main` antes de terminar:
  `git checkout main && git merge --no-ff <rama> && git push origin main`
- Un commit por tarea completada, con mensaje descriptivo en español

## Repositorio

- Repositorio de contenido, no de código — no hay revisión de PRs ni rama de trabajo
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

## Por qué esta regla existe

Las rutinas programadas clonan el repositorio desde `main` en cada ejecución.
Cualquier archivo en una rama `claude/` es invisible para la rutina siguiente.
Por tanto, todo lo que genera una sesión debe llegar a `main` antes de que
termine esa sesión, sea interactiva o automática.
