// Ejemplo real: "Tu primera llamada a la API de Claude" con grabación y captura de la documentación oficial.
// Copia este archivo a tutorial.js y reescríbelo para tu tutorial. Guía completa: references/tutoriales.md
export default {
  format: '9:16',                       // '9:16' Reels/TikTok/Shorts · '16:9' YouTube
  fps: 30,
  totalSteps: 4,                        // muestra "PASO 2 / 4"
  brand: { bg: '#0B0B0C', bg2: '#1C1C20', ink: '#F7F7F5', accent: '#FF4B0B', handle: '' },   // handle: '@tuusuario'
  segments: [
    { type: 'title', kicker: 'TUTORIAL · 60 s', title: 'Tu primera llamada a la *API de Claude*', sub: 'Paso a paso, con la documentación oficial',
      say: 'En un minuto vas a hacer tu primera llamada a la API de Claude. Paso a paso.' },
    { type: 'screen', src: 'capturas/demo.webm', from: 3.4, to: 13.6, speed: 1.3, step: 1, title: 'Entra en la *documentación oficial*',
      callouts: { 'get-key': 'Aquí sacas tu API key', ts: 'Elige tu lenguaje', quickstart: 'Abre el Quickstart' },
      say: 'Entra en la documentación oficial de Claude. Aquí sacas tu API key, eliges tu lenguaje y abres el Quickstart.' },
    { type: 'shot', src: 'capturas/demo-quickstart.png', step: 2, title: 'Guarda la key e *instala el SDK*',
      boxes: [{ at: 0.4, rect: [511, 832, 977, 76], label: 'Tu key como variable', hold: 2.4 }, { at: 3.1, rect: [511, 999, 977, 162], label: 'Instala el SDK', hold: 2.4 }],
      numbered: true, say: 'Primero guarda tu key como variable de entorno. Después crea el proyecto e instala el SDK.' },
    { type: 'shot', src: 'capturas/demo-quickstart.png', step: 3, title: 'Pega el código y *ejecútalo*',
      boxes: [{ at: 0.4, rect: [511, 1310, 977, 675], label: 'Tu primer mensaje a Claude', hold: 2.8 }, { at: 3.6, rect: [511, 2077, 977, 78], label: 'npx tsx quickstart.ts', hold: 2.2 }],
      say: 'Copia este código en quickstart punto ts y ejecútalo con npx tsx. Claude te responde en la terminal.' },
    { type: 'list', step: 4, title: 'Errores típicos', bad: true, items: ['La key pegada en el código', 'Olvidar instalar el SDK', 'Subir el .env a GitHub'],
      say: 'Errores típicos: pegar la key en el código, olvidar el SDK, o subir el punto env a GitHub.' },
    { type: 'cta', word: 'CLAUDE', sub: 'y te mando la guía con el código listo', say: 'Comenta CLAUDE y te mando la guía con el código listo.' },
  ],
};
