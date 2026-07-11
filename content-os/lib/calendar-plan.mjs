// Distribución determinista de etapas del embudo (TOFU/MOFU/BOFU) para los posts
// que quedan en el mes, calculada desde CUALQUIER día de arranque -- no asume que
// se planifica el 1. Si hoy es sábado 11 y ya se publicó el viernes 10, este módulo
// reparte SOLO los lunes/miércoles/viernes que quedan hasta fin de mes.
//
// Regla de distribución (misma progresión que ya usaba el calendario escrito a mano):
// el mes se divide en 5 tramos iguales por posición del post (no por fecha del
// calendario), y el tramo decide la etapa dominante:
//   tramo 1        -> TOFU
//   tramo 2        -> TOFU/MOFU (alterna, empieza en TOFU)
//   tramo 3        -> MOFU
//   tramo 4        -> MOFU/BOFU (alterna, empieza en MOFU)
//   tramo 5 (cierre)-> BOFU
// Con pocos posts restantes (mes casi terminado) se colapsa a una progresión corta
// pero coherente: nunca se salta directo a BOFU sin al menos un MOFU antes, salvo
// que solo quede 1 post -- ahí se prioriza cerrar con BOFU si el mes ya tuvo TOFU/MOFU
// antes (mirando `existingPosts`), o con MOFU si el mes no tuvo nada anterior.

const PUBLISH_WEEKDAYS = new Set([1, 3, 5]); // lunes, miércoles, viernes (0=domingo)

export function remainingPublishDates(fromDate) {
  const dates = [];
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDay = fromDate.getDate();
  for (let day = startDay; day <= lastDay; day++) {
    const d = new Date(year, month, day, 12, 0, 0);
    if (PUBLISH_WEEKDAYS.has(d.getDay())) dates.push(d);
  }
  return dates;
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Calcula la etapa (TOFU/MOFU/BOFU) para cada fecha restante del mes.
 * @param {Date} fromDate - día desde el que se planifica (hoy, o el primer L/X/V libre).
 * @param {Array<{date:string, stage:string}>} existingPosts - posts YA publicados/planificados
 *   este mes antes de fromDate, para saber si el mes ya tuvo TOFU/MOFU y así no repetir
 *   la progresión desde cero cuando se planifica a mitad de mes.
 * @returns {Array<{date:string, stage:string, slot:number, totalSlots:number}>}
 */
export function planRemainingStages(fromDate, existingPosts = []) {
  const dates = remainingPublishDates(fromDate);
  if (dates.length === 0) return [];

  const stagesSeen = new Set(existingPosts.map(p => p.stage));
  const hadTofu = stagesSeen.has("TOFU");
  const hadMofu = stagesSeen.has("MOFU");

  const total = dates.length;

  // Progresión completa (5 tramos) cuando quedan suficientes posts para expresarla.
  // Con menos posts, se comprime pero conserva el orden TOFU -> MOFU -> BOFU.
  const sequence = buildSequence(total, { hadTofu, hadMofu });

  return dates.map((d, index) => ({
    date: isoDate(d),
    stage: sequence[index],
    slot: index + 1,
    totalSlots: total,
  }));
}

function buildSequence(total, { hadTofu, hadMofu }) {
  if (total <= 0) return [];

  // Caso trivial: 1 solo post restante en el mes -> cierre lógico según lo ya publicado.
  if (total === 1) {
    if (hadMofu) return ["BOFU"];
    if (hadTofu) return ["MOFU"];
    return ["TOFU"]; // no hubo nada antes: al menos abre bien, no cierres en frío.
  }

  // Caso pequeño: 2-3 posts restantes -> progresión corta ajustada a lo ya visto.
  if (total <= 3) {
    if (hadMofu) {
      // Ya hubo TOFU y MOFU antes: lo que queda es rematar en BOFU.
      return Array.from({ length: total }, (_, i) => (i < total - 1 ? "MOFU" : "BOFU"));
    }
    if (hadTofu) {
      // Ya hubo TOFU: avanzar a MOFU y cerrar en BOFU si hay hueco.
      if (total === 2) return ["MOFU", "BOFU"];
      return ["MOFU", "MOFU", "BOFU"];
    }
    // Mes prácticamente sin arrancar y casi sin tiempo: TOFU -> MOFU -> BOFU comprimido.
    if (total === 2) return ["TOFU", "MOFU"];
    return ["TOFU", "MOFU", "BOFU"];
  }

  // Caso normal: 4+ posts restantes -> los 5 tramos de la progresión completa,
  // saltando los tramos ya cubiertos por existingPosts (hadTofu/hadMofu).
  const remainingStagesOrder = [];
  if (!hadTofu) remainingStagesOrder.push("TOFU", "TOFU_MOFU");
  else if (!hadMofu) remainingStagesOrder.push("TOFU_MOFU");
  remainingStagesOrder.push("MOFU", "MOFU_BOFU", "BOFU");

  // Reparte los slots disponibles entre los tramos restantes.
  const tramos = remainingStagesOrder.length;
  const base = Math.floor(total / tramos);
  const extra = total % tramos;
  const counts = remainingStagesOrder.map((_, i) => base + (i < extra ? 1 : 0));

  // Expande cada tramo a una lista CONTIGUA de etapas (sin alternar dentro del tramo,
  // así no oscila TOFU-MOFU-TOFU): los tramos de transición reparten su propio cupo
  // en dos mitades consecutivas -- primera mitad la etapa de salida, segunda la de
  // entrada -- para que la progresión sea monótona de principio a fin.
  const fullPattern = [];
  remainingStagesOrder.forEach((tramo, i) => {
    const count = counts[i];
    if (tramo === "TOFU_MOFU") {
      const half = Math.ceil(count / 2);
      for (let k = 0; k < count; k++) fullPattern.push(k < half ? "TOFU" : "MOFU");
    } else if (tramo === "MOFU_BOFU") {
      const half = Math.ceil(count / 2);
      for (let k = 0; k < count; k++) fullPattern.push(k < half ? "MOFU" : "BOFU");
    } else {
      for (let k = 0; k < count; k++) fullPattern.push(tramo);
    }
  });

  // Garantiza cierre en BOFU si el último tramo no lo era ya (por redondeo con 0 en cola).
  if (fullPattern.length && fullPattern[fullPattern.length - 1] !== "BOFU") {
    fullPattern[fullPattern.length - 1] = "BOFU";
  }
  return fullPattern;
}

/**
 * Construye existingPosts a partir de los posts ya extraídos de estrategia_mes.html
 * (vía resources.extractPosts) que caen ANTES de fromDate. Uso típico: la skill
 * investigador llama a esto para saber si el mes ya tuvo TOFU/MOFU antes de planificar
 * lo que queda, en vez de asumir que siempre se planifica desde el día 1.
 */
export function existingPostsBefore(allPosts, fromDate) {
  const cutoff = isoDate(fromDate);
  return allPosts.filter(p => p.date < cutoff).map(p => ({ date: p.date, stage: p.stage }));
}
