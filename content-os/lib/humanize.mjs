const BANNED=[
  /\b(?:crucial|pivotal|vibrante|revolucionario|disruptivo|transformador|potenciar|impulsar)\b/giu,
  /(?:no (?:es|se trata) solo .{0,80}(?:es|sino))/giu,
  /(?:en el panorama actual|en el mundo actual|cabe destacar|es importante señalar)/giu,
  /—/gu
];

export function humanizeCopies(copies){
  const output={};
  const changes=[];
  for(const [channel,raw] of Object.entries(copies)){
    let text=String(raw).replace(/[“”]/g,'"').replace(/—/g,',');
    text=text.replace(/\bLa pregunta útil no es qué herramienta comprar\. Es /u,'Antes de comprar una herramienta, mira ');
    text=text.replace(/\bNo es una promesa basada en clientes de Globalizame\. Es /u,'Globalizame sigue en fase inicial. Esto es ');
    text=text.replace(/\n{3,}/g,'\n\n').trim();
    for(const pattern of BANNED){if(pattern.test(text))changes.push({channel,pattern:String(pattern)});pattern.lastIndex=0}
    output[channel]=text;
  }
  const remaining=Object.entries(output).flatMap(([channel,text])=>BANNED.flatMap(pattern=>{pattern.lastIndex=0;return pattern.test(text)?[{channel,pattern:String(pattern)}]:[]}));
  return {copies:output,report:{skill:"humanizer",version:"2.5.1",passed:remaining.length===0,changes,remaining,checked_at:new Date().toISOString()}};
}
