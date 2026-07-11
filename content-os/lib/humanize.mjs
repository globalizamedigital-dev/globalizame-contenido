// NOTA: esto NO es la skill humanizer real (~/.claude/skills/humanizer, 29 patrones
// de escritura IA con reescritura y auditoría en dos pasadas). Es un filtro determinista
// de 8 patrones mecánicos que actúa como red de seguridad DESPUÉS de que el copy ya pasó
// por la skill real (paso 6 de content-loop/SKILL.md). No declarar "passed" de esto como
// si fuera el veredicto de la skill humanizer — solo confirma ausencia de estos patrones.
const BANNED=[
  /\b(?:crucial|pivotal|vibrante|revolucionario|disruptivo|transformador|potenciar|impulsar)\b/giu,
  /(?:no (?:es|se trata) solo .{0,80}(?:es|sino))/giu,
  /(?:en el panorama actual|en el mundo actual|cabe destacar|es importante señalar)/giu,
  /(?:segun|según) (?:un |el )?informe.{0,60}(?:recogido por|citado por|cita)/giu,
  /—/gu
];

export function applyMechanicalFilter(copies){
  const output={};
  const changes=[];
  for(const [channel,raw] of Object.entries(copies)){
    let text=String(raw).replace(/[“”]/g,'"').replace(/—/g,',');
    text=text.replace(/\bLa pregunta útil no es qué herramienta comprar\. Es /u,'Antes de comprar una herramienta, mira ');
    text=text.replace(/\n{3,}/g,'\n\n').trim();
    for(const pattern of BANNED){if(pattern.test(text))changes.push({channel,pattern:String(pattern)});pattern.lastIndex=0}
    output[channel]=text;
  }
  const remaining=Object.entries(output).flatMap(([channel,text])=>BANNED.flatMap(pattern=>{pattern.lastIndex=0;return pattern.test(text)?[{channel,pattern:String(pattern)}]:[]}));
  return {copies:output,report:{filter:"mechanical-post-check",note:"Red de seguridad determinista, no la skill humanizer. El copy debe haber pasado ya por la skill humanizer real antes de llegar aqui (content-loop/SKILL.md paso 6).",version:"1.0.0",passed:remaining.length===0,changes,remaining,checked_at:new Date().toISOString()}};
}
