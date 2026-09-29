// Tutorial: cómo Claude Opus 5.5 genera vídeos con la skill video-pizarra. Todo el material es real:
// los dos vídeos son renders hechos con la skill en esta sesión, la terminal ejecutó de verdad cada comando
// y el prompt es el que se usó para el vídeo de Instinct.
export default {
  format: '9:16', fps: 30, totalSteps: 4,
  brand: { bg: '#0B0B0C', bg2: '#1C1C20', ink: '#F7F7F5', accent: '#FF4B0B', handle: '' },
  segments: [
    { type: 'screen', src: 'capturas/resultado-instinct.mp4', from: 0.2, to: 5.2, zoom: false, crop: [40, 250, 1000, 1150], host: 'instinct-ai.mp4',
      title: 'Este vídeo lo hizo *Claude Opus 5.5*', say: 'Este vídeo no lo edité yo. Lo hizo Claude Opus 5.5 con una skill.' },
    { type: 'text', text: 'Claude no tiene generador de vídeo. Lo *programa*.', sub: 'guion → código → render',
      say: 'Claude no tiene un generador de vídeo: lo programa. Escribe el guion, anima con código y lo renderiza.' },
    { type: 'screen', src: 'capturas/terminal.webm', from: 1.0, to: 6.8, step: 1, title: 'Instala la *skill*', host: 'Claude Code', baseZoom: 1.8, focusMaxW: 720,
      callouts: { skill: 'Pizarrón, estilos y tutoriales' }, say: 'Paso uno: pon la skill en la carpeta de skills de Claude Code.' },
    { type: 'text', step: 2, text: '"Crea un vídeo para Instagram sobre *Instinct AI*…"', size: 76, sub: 'pídeselo con tus palabras',
      say: 'Paso dos: pídeselo con tus palabras. Claude investiga, verifica los datos y te enseña el guion.' },
    { type: 'screen', src: 'capturas/terminal.webm', from: 7.2, to: 29.6, speed: 3, step: 3, title: 'Graba la pantalla *de verdad*', host: 'Claude Code', baseZoom: 1.8, focusMaxW: 720,
      callouts: { capture: 'Abre la app real', grabado: 'Cada clic, registrado' },
      say: 'Paso tres: graba la pantalla real, clic a clic, y apunta dónde hacer zoom.' },
    { type: 'screen', src: 'capturas/terminal.webm', from: 30.2, to: 130.4, speed: 10, step: 4, title: 'Un comando lo *monta todo*', host: 'Claude Code', baseZoom: 1.8, focusMaxW: 720,
      callouts: { build: 'Voz, subtítulos y render', listo: 'Vídeo listo' },
      say: 'Paso cuatro: un comando y lo monta todo. Voz, subtítulos, música y render.' },
    { type: 'screen', src: 'capturas/resultado-tutorial.mp4', from: 4.5, to: 10, zoom: false, crop: [20, 330, 1040, 1130], host: 'mi-tutorial.mp4',
      title: 'Y sale *esto*', say: 'Y sale esto: un tutorial con zoom automático, subtítulos y voz.' },
    { type: 'list', title: 'Lo que hace la skill', items: ['Tutoriales con pantalla real', 'Zoom automático a cada clic', 'Pizarrón animado con mascota', 'Voz, subtítulos y música'],
      say: 'Tutoriales con pantalla real, vídeos animados, voz y subtítulos. Todo desde un chat.' },
    { type: 'cta', word: 'SKILL', sub: 'y te la mando', say: 'Comenta SKILL y te la mando.' },
  ],
};
