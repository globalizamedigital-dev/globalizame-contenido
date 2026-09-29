// Tutorial v2: qué hace la skill que se regala (texto dinámico + capturas con zoom + voz + subtítulos).
// El propio vídeo está hecho con ese motor; el clip de resultado es un render real hecho con él.
export default {
  format: '9:16', fps: 30, totalSteps: 3,
  brand: { bg: '#0B0B0C', bg2: '#1C1C20', ink: '#F7F7F5', accent: '#FF4B0B', handle: '' },
  segments: [
    { type: 'title', kicker: 'HECHO CON CLAUDE OPUS 5.5', title: 'Este vídeo lo ha hecho *Claude*. Entero.', sub: 'guion, voz, subtítulos y montaje',
      say: 'Este vídeo lo ha hecho Claude. Entero. Guion, voz, subtítulos y montaje.' },
    { type: 'text', text: 'Claude no genera vídeo con IA. Lo *programa*.', sub: 'por eso el texto sale perfecto',
      say: 'Claude no tiene un generador de vídeo: lo programa. Por eso el texto sale perfecto.' },
    { type: 'text', step: 1, text: 'Añade la *skill* a Claude Code', sub: 'una carpeta, una vez',
      say: 'Paso uno: añade la skill a Claude Code. Solo una vez.' },
    { type: 'text', step: 2, text: '"Hazme un reel sobre *Instinct AI* para dueños de negocio"', size: 80, sub: 'pídeselo con tus palabras',
      say: 'Paso dos: pídele el vídeo con tus palabras.' },
    { type: 'list', step: 3, title: 'Claude hace el resto', items: ['Investiga y verifica los datos', 'Escribe el guion', 'Pone voz y subtítulos', 'Te entrega el MP4'],
      say: 'Paso tres: Claude investiga, escribe el guion, pone voz y subtítulos, y te entrega el vídeo.' },
    { type: 'screen', src: 'capturas/resultado-tutorial.mp4', from: 13.8, to: 22.5, speed: 1.2, zoom: false, crop: [20, 330, 1040, 1130], host: 'mi-reel.mp4',
      title: 'Y sale *esto*', say: 'Y sale esto: titulares, capturas con zoom y voz. Listo para Reels.' },
    { type: 'cta', word: 'SKILL', sub: 'y te la mando gratis', say: 'Comenta SKILL y te la mando gratis.' },
  ],
};
