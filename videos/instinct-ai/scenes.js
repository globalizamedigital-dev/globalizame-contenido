/* Instinct AI v2 — ritmo alto, voz en off (audio/vo.json) y CTA de invitación.
 * Fuentes: TechCrunch 26-ago y 28-sep-2026, SiliconANGLE 28-sep-2026, instinct.com. Ver STORYBOARD.md
 * Cada escena dura lo que su frase de voz + un respiro; sfx('vo_N') marca dónde entra cada frase (vo_mix.py). */
bootVideo(async (V) => {
  const { el, P, T, H, draw, write, pop, popIn, type, comic, stamp, wobble, mover, bubble, sfx,
          face, arms, wave, hop, wiggle, jump,
          mascot, drawMascot, popMascot,
          newScene, show, BG, TR, setTool, tl, S } = V;
  const OR = '#FF4B0B', BK = '#090909', WH = '#F7F7F5', YL = '#FFD23F';
  const VO = await (await fetch('audio/vo.json')).json();
  const len = (k, pad = 0.35) => VO[k - 1].dur / 0.95 + pad;   // speed 0.95 → segundos de guion
  const say = (k, at) => sfx('vo_' + k, at);
  let t = 0;

  /* 1 · HOOK: 1.000 M$ (negro, estampado) */
  const s1 = newScene(BG.solid(BK)); show(s1, 0); setTool(null);
  { const g = s1.g, a = 0.05; say(1, a);
    const rain = el('g', {}, g);            // capa de billetes detrás del texto
    pop(T(g, 540, 360, 'Una startup de IA', { size: 104, color: WH }), a);
    pop(T(g, 540, 480, 'acaba de levantar', { size: 104, color: WH }), a + 0.7, { rot: 4 });
    stamp(g, 540, 800, '$1.000M', a + 1.9, { color: OR, rot: -6, size: 230 });
    pop(T(g, 540, 1000, 'mil millones de dólares', { size: 76, color: WH, cls: 'kalam' }), a + 2.5, { rot: 0, sound: false });
    comic(g, 810, 1180, '¡BOOM!', a + 2.1, { color: YL, size: 110, rot: 12, sound: 'boom', life: 1.2 });
    for (let i = 0; i < 9; i++) {           // lluvia de billetes
      const b = mover(rain, 90 + i * 115, -120, 1); el('rect', { x: -45, y: -25, width: 90, height: 50, rx: 6, fill: '#3DAA5C', stroke: BK, 'stroke-width': 5 }, b.g);
      T(b.g, 0, 14, '$', { size: 44, color: WH });
      tl.to(b, { y: 1750 + (i % 3) * 40, r: (i % 2 ? 1 : -1) * (20 + i * 9), duration: S(1.3 + (i % 4) * 0.15), ease: 'power1.in' }, S(a + 2.0 + i * 0.07));
    }
    sfx('cash', a + 2.2);
    const m = mover(g, 250, 1200, 1.5), c = mascot(m.g, 0, 0, 1, { theme: 'cream', ground: null });
    popMascot(c, a + 1.2); face(c, a + 2.1, 'star', { mouth: 'O', emote: '!' }); arms(c, a + 2.2, { L: 80, R: -80, dur: 0.15 }); wiggle(c, a + 2.6, 4);
    t = a + len(1);
  }
  const s2 = newScene(BG.sunburst(OR, '#FF6A33'));
  t = TR.flash(s1, s2, t);

  /* 2 · VALORACIÓN x4 (sunburst naranja, barras) */
  { const g = s2.g, a = t; say(2, a);
    pop(T(g, 540, 330, 'Ya vale', { size: 120, color: WH, stroke: BK }), a);
    pop(T(g, 540, 520, '$10.000M', { size: 220, color: BK }), a + 0.35, { sound: 'stamp', rot: -8 });
    draw(P(g, 'M170,1500 L910,1500', { color: BK, w: 9 }), a + 0.8, 0.25, { sound: false, tool: null });
    const b1 = el('rect', { x: 250, y: 1340, width: 200, height: 160, fill: H('white'), stroke: BK, 'stroke-width': 7 }, g);
    const b2 = el('rect', { x: 630, y: 700, width: 200, height: 800, fill: BK, stroke: BK, 'stroke-width': 7 }, g);
    gsap.set([b1, b2], { scaleY: 0, transformOrigin: '50% 100%' });
    tl.to(b1, { scaleY: 1, duration: S(0.4), ease: 'back.out(2)' }, S(a + 1.2)); sfx('rise', a + 1.2, { gain: 0.6 });
    pop(T(g, 350, 1590, 'hace 1 mes', { size: 60, color: BK, cls: 'kalam' }), a + 1.4, { rot: 0, sound: false });
    pop(T(g, 350, 1310, '$2.500M', { size: 70, color: WH, stroke: BK }), a + 1.5, { rot: 0, sound: 'blip' });
    tl.to(b2, { scaleY: 1, duration: S(0.6), ease: 'elastic.out(1,0.5)' }, S(a + 1.9)); sfx('riser', a + 1.7, { gain: 0.7 });
    pop(T(g, 730, 1590, 'hoy', { size: 60, color: BK, cls: 'kalam' }), a + 2.1, { rot: 0, sound: false });
    comic(g, 330, 1020, 'x4', a + 2.4, { color: YL, size: 230, rot: -10, sound: 'boing', life: 5 });
    t = a + len(2);
  }
  const s3 = newScene(BG.solid(BK));
  t = TR.expand(s2, s3, t, { x: 630, y: 700, w: 200, h: 800, color: BK });

  /* 3 · NOMBRE (negro + gis) */
  setTool('chalk');
  let chatB;
  { const g = s3.g, a = t; say(3, a);
    write(T(g, 540, 400, 'Se llama', { size: 130, color: WH }), a, 0.4);
    pop(T(g, 540, 640, 'INSTINCT', { size: 190, color: OR }), a + 0.55, { sound: 'stamp', rot: -6 });
    chatB = bubble(g, 230, 900, 850, 1130, 400, 1230); popIn(chatB, a + 1.1, { origin: '30% 100%' });
    T(chatB, 540, 1040, 'otro chatbot', { size: 90, color: BK, cls: 'kalam' });
    draw(P(g, 'M200,880 L880,1250', { color: '#E23B3B', w: 18 }), a + 1.5, 0.15, { sound: false, tool: null });
    draw(P(g, 'M880,880 L200,1250', { color: '#E23B3B', w: 18 }), a + 1.65, 0.15, { sound: false, tool: null }); sfx('slap', a + 1.6);
    pop(T(g, 540, 1480, 'NO es', { size: 150, color: YL, rot: 4 }), a + 1.55, { sound: false });
    t = a + len(3);
  }
  const s4 = newScene(BG.solid(WH));
  t = TR.eraser(s3, s4, t);

  /* 4 · CÓMO FUNCIONA (blanco + plumón) */
  setTool('marker');
  { const g = s4.g, a = t; say(4, a);
    write(T(g, 540, 330, 'Le escribes un mensaje', { size: 100, color: BK }), a, 0.8);
    const b = bubble(g, 160, 470, 920, 690, 780, 780); popIn(b, a + 0.4, { origin: '80% 100%' });
    type(T(b, 210, 570, 'Resérvame mesa', { size: 58, anchor: 'start', cls: 'code' }), a + 0.6, 0.5, OR);
    type(T(b, 210, 645, 'para 4 el viernes', { size: 58, anchor: 'start', cls: 'code' }), a + 1.1, 0.5, OR);
    pop(T(g, 540, 930, '…y lo hace por ti', { size: 120, color: OR }), a + 1.5, { rot: -4, sound: 'ding' });
    // su teléfono y su ordenador
    const ph = el('g', { transform: 'translate(260,1320)' }, g);
    draw(P(ph, 'M-85,-170 L85,-170 L85,170 L-85,170 Z', { color: BK, w: 9, fill: H('orange') }), a + 2.3, 0.3);
    draw(P(ph, 'M-30,140 L30,140', { color: BK, w: 9 }), a + 2.55, 0.1, { sound: false });
    const pc = el('g', { transform: 'translate(760,1330)' }, g);
    draw(P(pc, 'M-190,-140 L190,-140 L190,90 L-190,90 Z', { color: BK, w: 9, fill: H('orange') }), a + 3.0, 0.3);
    draw(P(pc, 'M-240,90 L240,90 L210,150 L-210,150 Z', { color: BK, w: 9 }), a + 3.25, 0.2, { sound: false });
    pop(T(g, 260, 1580, 'su teléfono', { size: 60, color: BK, cls: 'kalam' }), a + 2.6, { rot: 0, sound: false });
    pop(T(g, 760, 1580, 'su ordenador', { size: 60, color: BK, cls: 'kalam' }), a + 3.4, { rot: 0, sound: false });
    const m = mover(g, 400, 1000, 1.0), c = mascot(m.g, 0, 0, 1, { ground: null });
    popMascot(c, a + 1.7); face(c, a + 2.0, 'happy', { mouth: 'grin', emote: 'sparkle' }); hop(c, a + 3.6, 2);
    t = a + len(4);
  }
  const s5 = newScene('notebook');
  t = TR.slideUp(s4, s5, t);

  /* 5 · QUÉ HACE (cuaderno + lápiz, ticks al ritmo de la voz) */
  setTool('pencil');
  { const g = s5.g, a = t; say(5, a);
    pop(T(g, 560, 330, 'Lo hace por ti:', { size: 110, color: BK }), a, { rot: -2 });
    const items = [['Reserva restaurantes', 0.1], ['Hace la compra', 1.2], ['Cancela suscripciones', 2.0], ['¡Llama por ti!', 3.6]];
    items.forEach(([w, dt], k) => {
      const y = 600 + k * 230, at = a + dt, last = k === 3;
      draw(P(g, `M140,${y - 70} L230,${y - 70} L230,${y + 20} L140,${y + 20} Z`, { color: BK, w: 7 }), at, 0.12, { sound: false });
      pop(T(g, 270, y, w, { size: last ? 96 : 82, anchor: 'start', color: last ? OR : BK, cls: last ? 'hand' : 'kalam' }), at + 0.05, { rot: 0, sound: 'blip' });
      draw(P(g, `M152,${y - 30} L182,${y + 5} L245,${y - 100}`, { color: '#1F9D55', w: 14 }), at + 0.45, 0.14, { sound: false, tool: null }); sfx('tick', at + 0.5);
    });
    comic(g, 820, 1560, '¡RING!', a + 3.8, { color: YL, size: 120, rot: 10, sound: 'ding', life: 2 });
    t = a + len(5);
  }
  const s6 = newScene(BG.solid(BK));
  t = TR.iris(s5, s6, t, { x: 540, y: 1290 });

  /* 6 · ESCASEZ (negro, candado + sello) */
  setTool(null);
  { const g = s6.g, a = t; say(6, a);
    pop(T(g, 540, 380, 'El problema:', { size: 110, color: WH }), a);
    pop(T(g, 540, 520, 'casi nadie puede entrar', { size: 92, color: OR }), a + 0.7, { rot: 3 });
    const lk = el('g', { transform: 'translate(540,960)' }, g);
    draw(P(lk, 'M-90,-40 L-90,-130 C-90,-230 90,-230 90,-130 L90,-40', { color: WH, w: 22 }), a + 1.1, 0.3, { tool: null, sound: false });
    draw(P(lk, 'M-150,-40 L150,-40 L150,190 L-150,190 Z', { color: WH, w: 10, fill: H('orange') }), a + 1.3, 0.25, { tool: null, sound: 'thud' });
    stamp(g, 540, 1420, 'SOLO CON INVITACIÓN', a + 1.9, { color: YL, rot: -8, size: 104 });
    t = a + len(6);
  }
  const s7 = newScene(BG.solid(WH));
  t = TR.flip(s6, s7, t);

  /* 7 · AVISO (blanco, tecleado) */
  { const g = s7.g, a = t; say(7, a);
    pop(T(g, 540, 400, 'Eso sí', { size: 130, color: OR }), a);
    type(T(g, 540, 640, 'accede a mucha', { size: 78, cls: 'code', color: BK }), a + 0.4, 0.6, OR);
    type(T(g, 540, 740, 'información personal', { size: 78, cls: 'code', color: BK }), a + 0.9, 0.7, OR);
    pop(T(g, 540, 1010, 'Empieza poco a poco', { size: 96, color: BK }), a + 2.2, { rot: -2 });
    pop(T(g, 540, 1140, 'y revisa los permisos', { size: 96, color: OR }), a + 3.2, { rot: 2 });
    const m = mover(g, 400, 1340, 1.3), c = mascot(m.g, 0, 0, 1, { ground: null });
    popMascot(c, a + 0.6); face(c, a + 1.0, 'wide', { mouth: 'o', emote: 'sweat' }); face(c, a + 3.4, 'determined', { mouth: 'smile' });
    t = a + len(7);
  }
  const s8 = newScene(BG.sunburst(OR, '#FF6A33'));
  t = TR.zoomInto(s7, s8, t, { x: 400 + 1.3 * (10 + 133.5), y: 1340 + 1.3 * 62 });

  /* 8 · CTA (sunburst naranja; queda en pantalla para leerlo y comentar) */
  { const g = s8.g, a = t; say(8, a);
    pop(T(g, 540, 380, 'Comenta', { size: 160, color: WH, stroke: BK }), a);
    stamp(g, 540, 690, 'INSTINCT', a + 0.35, { color: BK, rot: -5, size: 190 });
    pop(T(g, 540, 930, 'y te mando', { size: 104, color: WH, stroke: BK }), a + 0.9, { rot: 0 });
    pop(T(g, 540, 1060, 'una invitación', { size: 140, color: BK }), a + 1.3, { rot: -3, sound: 'sparkle' });
    const m = mover(g, 400, 1300, 1.4), c = mascot(m.g, 0, 0, 1, { theme: 'cream', ground: null });
    popMascot(c, a + 1.1); face(c, a + 1.5, 'star', { mouth: 'grin', emote: 'sparkle' }); arms(c, a + 1.6, { R: -90 }); hop(c, a + 2.0, 4);
    const arrow = P(g, 'M540,1560 L540,1740 M470,1670 L540,1740 L610,1670', { color: BK, w: 16 });
    draw(arrow, a + 2.2, 0.3, { tool: null, sound: 'whoosh' });
    tl.to(arrow, { y: 30, duration: S(0.25), yoyo: true, repeat: 7, ease: 'sine.inOut' }, S(a + 2.5));
    t = a + len(8, 2.6);
  }
  return t;
}, { speed: 0.95, palette: { orange: '#FF4B0B', ink: '#090909', cream: '#F7F7F5' } });
