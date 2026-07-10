const HARD_PATTERNS = [
  /(?:nuestros?|mis) clientes?/iu,
  /cliente (?:nuestro|de globalizame)/iu,
  /casos? de (?:éxito|clientes?) (?:propios?|de globalizame)/iu,
  /hemos (?:ayudado|conseguido|logrado|recuperado|ahorrado|implantado|implementado|automatizado|trabajado)/iu,
  /(?:le|les) (?:ahorramos|recuperamos|conseguimos|implantamos|implementamos|automatizamos)/iu,
  /en globalizame (?:conseguimos|hemos|ayudamos|trabajamos con)/iu
];

const CLAIM_PATTERN = /(?:aumentó|incrementó|redujo|ahorró|recuperó|generó|consiguió|mejoró|liberó|facturó|convirtió)(?:\s|,).{0,80}(?:%|€|euros?|horas?|clientes?|reservas?)/iu;
const ATTRIBUTION_PATTERN = /(?:según|fuente|referencia externa|caso publicado por|datos de|estudio de|informe de|reportado por)/iu;

export function auditHonesty(text, { source = "contenido" } = {}) {
  const value = String(text || "");
  const violations = [];
  for (const pattern of HARD_PATTERNS) {
    const match = value.match(pattern);
    if (match) violations.push({ code: "FALSE_CLIENT_IMPLICATION", source, excerpt: match[0] });
  }
  const sentences = value.split(/(?<=[.!?])\s+/u);
  for (const sentence of sentences) {
    if (CLAIM_PATTERN.test(sentence) && !ATTRIBUTION_PATTERN.test(sentence)) {
      violations.push({ code: "UNATTRIBUTED_RESULT", source, excerpt: sentence.slice(0, 180) });
    }
  }
  return violations;
}

export function assertHonesty(documents) {
  const violations = documents.flatMap(({ source, text }) => auditHonesty(text, { source }));
  if (violations.length) {
    const error = new Error(`Política de honestidad incumplida: ${violations.length} bloqueo(s)`);
    error.code = "HONESTY_BLOCK";
    error.violations = violations;
    throw error;
  }
  return { passed: true, checks: documents.length };
}
