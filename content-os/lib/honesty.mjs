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

export function auditPublicCopy(text, { sourceNames = [] } = {}) {
  const value = String(text || "");
  const violations = [];
  const brandMatch = value.match(/.{0,50}(?:globalizame|fase inicial|casos? propios?|no (?:tengo|tenemos) clientes?).{0,90}/iu);
  if (brandMatch) violations.push({ code: "PUBLIC_BRAND_SELF_REFERENCE", excerpt: brandMatch[0] });
  for (const name of sourceNames.filter(name => String(name).trim().length >= 4)) {
    const escaped = String(name).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = value.match(new RegExp(`\\b${escaped}\\b`, "iu"));
    if (match) violations.push({ code: "PUBLIC_SOURCE_NAME", excerpt: match[0] });
  }
  const metaMatch = value.match(/.{0,40}(?:referencia externa|fuente:\s|(?:publicó|publicado) (?:este año )?un informe).{0,90}/iu);
  if (metaMatch) violations.push({ code: "PUBLIC_SOURCE_META_LANGUAGE", excerpt: metaMatch[0] });
  return violations;
}
