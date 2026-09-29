// Grabación real: la terminal ejecuta de verdad los comandos de la skill (servidor: node terminal.mjs --cwd <proyecto>).
export default {
  url: 'http://localhost:4173',
  viewport: { width: 1080, height: 1440 }, timeout: 400000,
  steps: [
    { do: 'wait', ms: 800 },
    { do: 'type', sel: '#in', text: 'ls ~/.claude/skills/video-pizarra', label: 'ls', delay: 35 },
    { do: 'press', key: 'Enter' }, { do: 'waitFor', sel: 'body.done', state: 'attached' },
    { do: 'mark', sel: 'div:text-is("template-tutorial")', label: 'skill', ms: 1500 },
    { do: 'type', sel: '#in', text: 'node capture.mjs capturas/demo.capture.js', label: 'capture', delay: 35 },
    { do: 'press', key: 'Enter' }, { do: 'waitFor', sel: 'body.done', state: 'attached' },
    { do: 'mark', sel: 'div.ok >> nth=-1', label: 'grabado', ms: 1500 },
    { do: 'type', sel: '#in', text: 'node build.mjs mi-tutorial', label: 'build', delay: 35 },
    { do: 'press', key: 'Enter' }, { do: 'waitFor', sel: 'body.done', state: 'attached' },
    { do: 'mark', sel: 'div.ok >> nth=-1', label: 'listo', ms: 2000 },
  ],
};
