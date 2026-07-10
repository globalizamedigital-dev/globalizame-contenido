import fs from "node:fs";
import path from "node:path";
import { assertHonesty } from "./honesty.mjs";

export function validateRun(runDir, spec, copies) {
  const failures=[];
  const copySourceFile=path.join(runDir,"copy-source.json");
  if(!fs.existsSync(copySourceFile))failures.push({code:"AGENT_COPY_SOURCE_MISSING"});
  const instagramWords=String(copies.instagram||"").split(/\s+/).filter(Boolean).length;
  const linkedinWords=String(copies.linkedin||"").split(/\s+/).filter(Boolean).length;
  if(instagramWords<180)failures.push({code:"INSTAGRAM_COPY_TOO_SHORT",detail:instagramWords});
  if(linkedinWords<250)failures.push({code:"LINKEDIN_COPY_TOO_SHORT",detail:linkedinWords});
  if(!/(?:según|informe|publicó|fuente)/iu.test(copies.instagram))failures.push({code:"INSTAGRAM_SOURCE_CONTEXT_MISSING"});
  if(!/(?:según|informe|publicó|fuente)/iu.test(copies.linkedin))failures.push({code:"LINKEDIN_SOURCE_CONTEXT_MISSING"});
  if(!/(?:comenta|guárdalo|cuéntame|reserva|escríbeme)/iu.test(copies.instagram))failures.push({code:"INSTAGRAM_CTA_MISSING"});
  if(!/(?:comenta|guárdalo|cuéntame|reserva|escríbeme)/iu.test(copies.linkedin))failures.push({code:"LINKEDIN_CTA_MISSING"});
  if(spec.slides.length<6||spec.slides.length>10)failures.push({code:"SLIDE_COUNT",detail:spec.slides.length});
  const nums=spec.slides.map(s=>s.number);
  if(nums.some((n,i)=>n!==i+1))failures.push({code:"SLIDE_SEQUENCE"});
  for(const slide of spec.slides){
    const words=`${slide.headline} ${slide.support||""}`.trim().split(/\s+/).length;
    if(words>26)failures.push({code:"TEXT_DENSITY",slide:slide.number,detail:words});
    if(String(slide.headline).length>72)failures.push({code:"HEADLINE_LENGTH",slide:slide.number,detail:String(slide.headline).length});
    if(String(slide.support||"").length>110)failures.push({code:"SUPPORT_LENGTH",slide:slide.number,detail:String(slide.support).length});
    const svg=path.join(runDir,"slides",`slide-${String(slide.number).padStart(2,"0")}.svg`);
    if(!fs.existsSync(svg))failures.push({code:"MISSING_SVG",slide:slide.number});
    else{
      const raw=fs.readFileSync(svg,"utf8");
      if(!/width="1080" height="1350"/.test(raw))failures.push({code:"DIMENSIONS",slide:slide.number});
      if(!raw.includes("#FF4B0B"))failures.push({code:"BRAND_ACCENT",slide:slide.number});
    }
  }
  let honesty={passed:false};
  try{honesty=assertHonesty([
    {source:"spec.json",text:JSON.stringify(spec)},
    {source:"copy-instagram.md",text:copies.instagram},
    {source:"copy-linkedin.md",text:copies.linkedin}
  ])}catch(error){failures.push(...error.violations);honesty={passed:false,violations:error.violations}}
  const pngCount=fs.existsSync(path.join(runDir,"exports"))?fs.readdirSync(path.join(runDir,"exports")).filter(f=>f.endsWith(".png")).length:0;
  if(pngCount!==spec.slides.length)failures.push({code:"PNG_EXPORT",detail:`${pngCount}/${spec.slides.length}`});
  const finalDir=path.join(runDir,"final");
  const finalCount=fs.existsSync(finalDir)?fs.readdirSync(finalDir).filter(f=>/^slide-\d{2}\.png$/.test(f)).length:0;
  const imagegenManifest=path.join(runDir,"imagegen.json");
  if(finalCount!==spec.slides.length)failures.push({code:"GPT_IMAGE_2_ASSETS",detail:`${finalCount}/${spec.slides.length}`});
  if(!fs.existsSync(imagegenManifest))failures.push({code:"GPT_IMAGE_2_MANIFEST"});
  const humanizerFile=path.join(runDir,"humanizer.json");
  if(!fs.existsSync(humanizerFile))failures.push({code:"HUMANIZER_MISSING"});
  else if(!JSON.parse(fs.readFileSync(humanizerFile,"utf8")).passed)failures.push({code:"HUMANIZER_BLOCK"});
  const report={status:failures.length?"BLOCKED":"APPROVED",checked_at:new Date().toISOString(),honesty,checks:{slides:spec.slides.length,wireframe_pngs:pngCount,final_gpt_image_2_pngs:finalCount,format:"1080x1350",references:spec.visual_reference.length,humanizer:fs.existsSync(humanizerFile),instagram_words:instagramWords,linkedin_words:linkedinWords,agent_copy_source:fs.existsSync(copySourceFile)},failures};
  fs.writeFileSync(path.join(runDir,"qa.json"),JSON.stringify(report,null,2));
  fs.writeFileSync(path.join(runDir,"qa.md"),`# QA · ${spec.title}\n\n**${report.status}**\n\n- Honestidad comercial: ${honesty.passed?"PASS":"FAIL"}\n- Slides SVG: ${spec.slides.length}\n- PNG: ${pngCount}\n- Formato: 1080×1350\n- Referencias visuales: ${spec.visual_reference.length}\n\n${failures.length?failures.map(f=>`- ${f.code}${f.slide?` · slide ${f.slide}`:""}: ${f.detail||f.excerpt||"revisar"}`).join("\n"):"Sin fallos bloqueantes."}\n`);
  return report;
}
