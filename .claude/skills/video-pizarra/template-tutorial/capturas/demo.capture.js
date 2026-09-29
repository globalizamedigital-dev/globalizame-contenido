// Demo: cómo empezar con la API de Claude desde la documentación oficial (web pública, sin login).
export default {
  url: 'https://platform.claude.com/docs/en/home',
  viewport: { width: 1280, height: 1440 },   // alto > ancho: menos recorte en 9:16
  scale: 1.5,                                // más píxeles = zoom nítido
  steps: [
    { do: 'wait', ms: 1200 },
    { do: 'hover', sel: 'a:has-text("Get API key") >> nth=0', label: 'get-key' },
    { do: 'click', sel: 'button:has-text("TypeScript")', label: 'ts' },
    { do: 'wait', ms: 900 },
    { do: 'click', sel: 'a:has-text("Quickstart") >> nth=0', label: 'quickstart', ms: 2200 },
    { do: 'scroll', y: 700, ms: 1200 },
    { do: 'shot', name: 'quickstart' },
  ],
};
