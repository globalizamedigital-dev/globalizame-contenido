/* Instinct AI para dueños de negocio. Fuente única: instinct.com. Ver STORYBOARD.md */
bootVideo(async (V) => {
  const { el, P, T, H, PAL, INK, draw, write, pop, popIn, type, comic, stamp, wobble, mover, bubble, sfx,
          face, emote, arms, wave, hop, wiggle,
          mascot, drawMascot, popMascot,
          newScene, show, BG, TR, finale, setTool, tl, S } = V;
  const OR = '#FF4B0B', BK = '#090909', WH = '#F7F7F5';
  let t = 0;

  /* 1 · HOOK (negro + gis) */
  const s1 = newScene(BG.solid(BK), { filter: 'url(#chalk)' }); show(s1, 0); setTool('chalk');
  let sobres;
  { const g = s1.g, a = 0.1;
    write(T(g, 540, 380, '¿Cuántos correos', { size: 128, color: WH }), a + 0.1, 0.7);
    write(T(g, 540, 520, 'dejaste sin responder', { size: 104, color: WH }), a + 0.8, 0.8);
    write(T(g, 540, 640, 'esta semana?', { size: 128, color: OR }), a + 1.6, 0.7);
    sobres = el('g', {}, g);
    [[240, 1380, -8], [520, 1330, 4], [800, 1390, 9], [380, 1470, 3], [680, 1480, -5]].forEach(([x, y, r], k) => {
      const e = el('g', { transform: `translate(${x},${y}) rotate(${r})` }, sobres);
      draw(P(e, 'M-110,-70 L110,-70 L110,70 L-110,70 Z', { color: WH, w: 7 }), a + 1.2 + k * 0.3, 0.3, { sound: k === 0 });
      draw(P(e, 'M-110,-70 L0,10 L110,-70', { color: OR, w: 7 }), a + 1.4 + k * 0.3, 0.25, { sound: false });
    });
    const m = mover(g, 400, 1050, 1.7), c = mascot(m.g, 0, 0, 1, { theme: null, ink: WH, ground: null, shadow: 'shadowW' });
    popMascot(c, a + 2.7); face(c, a + 3.0, 'wide', { mouth: 'o', emote: 'sweat' });
    t = a + 4.6;
  }
  const s2 = newScene(BG.solid(WH));
  t = TR.whipDown(s1, s2, t, { drop: sobres });

  /* 2 · PROBLEMA (blanco + plumón) */
  setTool('marker');
  { const g = s2.g, a = t;
    write(T(g, 540, 330, 'Eres dueño de negocio', { size: 104, color: BK }), a + 0.2, 0.9);
    write(T(g, 540, 450, 'y todo depende de ti', { size: 104, color: OR }), a + 1.2, 0.9);
    const tareas = ['seguimiento', 'llamadas', 'pendientes'];
    tareas.forEach((w, k) => {
      const y = 800 + k * 170;
      draw(P(g, `M120,${y - 80} L640,${y - 80} L640,${y + 30} L120,${y + 30} Z`, { color: BK, w: 7, fill: H('white') }), a + 2.3 + k * 0.5, 0.3, { sound: false });
      write(T(g, 380, y, w, { size: 84, color: BK, cls: 'kalam' }), a + 2.5 + k * 0.5, 0.4);
    });
    const m = mover(g, 640, 1180, 1.6), c = mascot(m.g, 0, 0, 1);
    popMascot(c, a + 3.6); face(c, a + 4.0, 'wide', { mouth: 'o', emote: 'sweat' });
    arms(c, a + 4.4, { L: 70, R: -70, dur: 0.2 }); wiggle(c, a + 4.6, 4);
    write(T(g, 540, 1580, 'y no da la vida para todo', { size: 76, color: BK, cls: 'kalam' }), a + 5.2, 1.0);
    t = a + 7.4;
  }
  const s3 = newScene(BG.solid(OR));
  t = TR.eraser(s2, s3, t);

  /* 3 · GIRO (naranja, texto estampado) */
  setTool(null);
  { const g = s3.g, a = t;
    pop(T(g, 540, 400, '¿Y si existiera', { size: 120, color: WH }), a + 0.1);
    pop(T(g, 540, 540, 'un asistente que ya sabe', { size: 96, color: BK }), a + 0.9, { rot: 3 });
    pop(T(g, 540, 690, 'qué es importante', { size: 116, color: WH }), a + 1.7, { rot: -3 });
    pop(T(g, 540, 830, 'para ti?', { size: 150, color: BK }), a + 2.5, { rot: 0, sound: 'stamp' });
    const m = mover(g, 340, 1130, 1.8), c = mascot(m.g, 0, 0, 1, { theme: 'cream', ground: null });
    popMascot(c, a + 3.2); face(c, a + 3.6, 'star', { mouth: 'grin', emote: '!' });
    const ph = el('g', {}, c.hand.R);
    ph.innerHTML = `<rect x="-38" y="-118" width="76" height="120" rx="12" fill="#090909" stroke="#090909" stroke-width="6"/><rect x="-30" y="-108" width="60" height="96" rx="6" fill="#F7F7F5"/>`;
    arms(c, a + 3.9, { R: -60 }); hop(c, a + 4.5, 2);
    t = a + 6.3;
  }
  const s4 = newScene('graph');
  t = TR.flash(s3, s4, t);

  /* 4 · QUÉ ES (cuadrícula + lápiz) */
  setTool('pencil');
  { const g = s4.g, a = t;
    write(T(g, 540, 330, 'Instinct', { size: 170, color: OR }), a + 0.2, 0.8);
    write(T(g, 540, 450, 'asistente personal', { size: 84, color: BK, cls: 'kalam' }), a + 1.0, 0.8);
    const apps = [['email', 200, 760], ['mensajes', 540, 700], ['pantalla', 880, 760], ['audio', 330, 1010], ['ubicación', 750, 1010]];
    const cx = 540, cy = 1310;
    const m = mover(g, cx - 110, cy - 90, 1.0), c = mascot(m.g, 0, 0, 1, { ground: null });
    popMascot(c, a + 1.8);
    apps.forEach(([w, x, y], k) => {
      const at = a + 2.3 + k * 0.55;
      draw(P(g, `M${x},${y + 45} L${cx},${cy - 100}`, { color: OR, w: 6 }), at + 0.15, 0.35, { sound: false });
      draw(P(g, `M${x - 140},${y - 45} L${x + 140},${y - 45} L${x + 140},${y + 45} L${x - 140},${y + 45} Z`, { color: BK, w: 6, fill: H('white') }), at, 0.25, { sound: false });
      write(T(g, x, y + 20, w, { size: 60, color: BK, cls: 'kalam' }), at + 0.05, 0.3);
    });
    face(c, a + 5.4, 'happy', { mouth: 'grin', emote: 'sparkle' });
    write(T(g, 540, 1620, 'se conecta a tus apps y más', { size: 62, color: BK, cls: 'kalam' }), a + 5.8, 1.0);
    t = a + 7.8;
  }
  const s5 = newScene(BG.solid(WH));
  t = TR.iris(s4, s5, t, { x: 540, y: 1300 });

  /* 5 · SIN APP NUEVA (blanco + pincel) */
  setTool('brush');
  let tarjeta;
  { const g = s5.g, a = t;
    write(T(g, 540, 330, 'Sin interfaz nueva', { size: 130, color: BK }), a + 0.2, 0.9);
    write(T(g, 540, 460, 'le escribes o le llamas', { size: 90, color: OR }), a + 1.2, 0.9);
    const b = bubble(g, 130, 640, 760, 860, 300, 950); popIn(b, a + 2.2, { origin: '30% 100%' });
    type(T(b, 170, 770, 'Dale seguimiento a', { size: 46, anchor: 'start', cls: 'code' }), a + 2.5, 0.8, OR);
    type(T(b, 170, 830, 'mis pendientes', { size: 46, anchor: 'start', cls: 'code' }), a + 3.2, 0.6, OR);
    const m = mover(g, 560, 1330, 1.5), c = mascot(m.g, 0, 0, 1, { ground: null });
    popMascot(c, a + 3.8); face(c, a + 4.2, 'happy', { mouth: 'smile' });
    const tel = el('g', { transform: 'translate(240,1330)' }, g);
    draw(P(tel, 'M-90,-170 L90,-170 L90,170 L-90,170 Z', { color: BK, w: 8, fill: H('white') }), a + 4.5, 0.4);
    write(T(tel, 0, 30, '📞', { size: 100 }), a + 5.0, 0.3);
    t = a + 6.8;
  }
  const s6 = newScene(BG.solid(BK), { filter: 'url(#chalk)' });
  t = TR.flip(s5, s6, t);

  /* 6 · EJEMPLOS (negro + plumón naranja) */
  setTool('marker');
  { const g = s6.g, a = t;
    write(T(g, 540, 330, 'Instinct puede', { size: 120, color: WH }), a + 0.2, 0.8);
    ['retomar hilos que dejaste', 'escribirte o llamarte primero', 'organizar cosas por ti'].forEach((w, k) => {
      const y = 660 + k * 250, at = a + 1.3 + k * 1.5;
      draw(P(g, `M100,${y - 60} L180,${y - 60} L180,${y + 20} L100,${y + 20} Z`, { color: OR, w: 8 }), at, 0.2, { sound: false });
      write(T(g, 220, y, w, { size: 68, color: WH, anchor: 'start', cls: 'kalam' }), at + 0.1, 0.8);
      const tk = P(g, `M112,${y - 25} L138,${y + 5} L190,${y - 85}`, { color: OR, w: 14 });
      draw(tk, at + 0.9, 0.2, { sound: false }); sfx('tick', at + 0.9);
    });
    const m = mover(g, 620, 1330, 1.5), c = mascot(m.g, 0, 0, 1, { theme: null, ink: WH, ground: null, shadow: 'shadowW' });
    popMascot(c, a + 5.2); face(c, a + 5.6, 'happy', { mouth: 'grin', emote: 'sparkle' });
    t = a + 7.4;
  }
  const s7 = newScene(BG.solid(WH));
  t = TR.expand(s6, s7, t, { x: 540, y: 1000, w: 300, h: 200, color: WH });

  /* 7 · AVISO (blanco + texto tecleado) */
  setTool(null);
  { const g = s7.g, a = t;
    pop(T(g, 540, 460, 'Ojo', { size: 150, color: OR }), a + 0.1);
    type(T(g, 540, 720, 'Es un producto nuevo:', { size: 64, cls: 'code', color: BK }), a + 0.6, 1.0, OR);
    type(T(g, 540, 810, 'revisa qué necesitas', { size: 64, cls: 'code', color: BK }), a + 1.6, 1.0, OR);
    type(T(g, 540, 900, 'antes de confiarle', { size: 64, cls: 'code', color: BK }), a + 2.6, 0.9, OR);
    type(T(g, 540, 990, 'tu negocio', { size: 64, cls: 'code', color: BK }), a + 3.4, 0.7, OR);
    t = a + 4.8;
  }
  const s8 = newScene(BG.solid(OR));
  t = TR.slideUp(s7, s8, t);

  /* 8 · CTA (naranja, estampado) */
  { const g = s8.g, a = t;
    pop(T(g, 540, 400, 'Comenta', { size: 150, color: WH }), a + 0.1);
    stamp(g, 540, 720, 'INSTINCT', a + 0.9, { color: BK, rot: -4, size: 150 });
    pop(T(g, 540, 940, 'y te mando la checklist:', { size: 78, color: WH, cls: 'kalam' }), a + 1.7, { rot: 0 });
    pop(T(g, 540, 1080, '10 tareas de tu negocio', { size: 74, color: BK, cls: 'kalam' }), a + 2.3, { rot: 0 });
    pop(T(g, 540, 1170, 'que puedes delegar a una IA', { size: 74, color: BK, cls: 'kalam' }), a + 2.7, { rot: 0 });
    const m = mover(g, 340, 1350, 1.8), c = mascot(m.g, 0, 0, 1, { theme: 'cream', ground: null });
    popMascot(c, a + 3.2); face(c, a + 3.6, 'star', { mouth: 'grin' }); arms(c, a + 3.8, { R: -80 }); hop(c, a + 4.2, 3);
    t = a + 6.4;
  }
  return t;
}, { speed: 0.8, palette: { orange: '#FF4B0B', ink: '#090909', cream: '#F7F7F5' } });
