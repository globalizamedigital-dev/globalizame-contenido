import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readResources, extractPosts, selectPost, extractEvidence } from "./lib/resources.mjs";
import { buildSpec, buildCopies } from "./lib/spec.mjs";
import { renderAll } from "./lib/render.mjs";
import { buildImagegenPrompts } from "./lib/imagegen-prompts.mjs";
import { validateRun } from "./lib/qa.mjs";
import { buildLeadMagnet } from "./lib/lead-magnet.mjs";
import { applyMechanicalFilter } from "./lib/humanize.mjs";
import { planRemainingStages, existingPostsBefore } from "./lib/calendar-plan.mjs";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const command=process.argv[2]||"run";
const dateArg=process.argv.find(a=>/^\d{4}-\d{2}-\d{2}$/.test(a));
const date=dateArg?new Date(`${dateArg}T12:00:00`):new Date();

try{
  if(command==="plan")console.log(JSON.stringify(plan(date),null,2));
  else if(command==="plan-calendar")console.log(JSON.stringify(planCalendar(date),null,2));
  else if(command==="run")console.log(JSON.stringify(run(date),null,2));
  else if(command==="validate")console.log(JSON.stringify(validateLatest(),null,2));
  else if(command==="status")console.log(fs.readFileSync(path.join(ROOT,"content-os/state/state.json"),"utf8"));
  else throw new Error(`Comando desconocido: ${command}`);
}catch(error){console.error(JSON.stringify({status:"BLOCKED",error:error.message,code:error.code,violations:error.violations},null,2));process.exit(1)}

// Calcula, desde `date` (por defecto hoy), qué etapa TOFU/MOFU/BOFU corresponde a
// cada lunes/miércoles/viernes restante del mes. Si recursos/estrategia_mes.html
// ya existe, lee los posts anteriores a `date` para no repetir la progresión desde
// cero al planificar a mitad de mes. Si no existe (mes sin calendario todavía),
// planifica el mes completo desde `date` como si todo estuviera por escribir.
// Esto es lo que la skill `investigador` debe ejecutar y respetar al escribir
// recursos/estrategia_mes.html -- no debe inventar la distribución de etapas a mano.
function planCalendar(target){
  const strategyFile=path.join(ROOT,"recursos/estrategia_mes.html");
  let existingPosts=[];
  if(fs.existsSync(strategyFile)){
    const strategy=fs.readFileSync(strategyFile,"utf8");
    const allPosts=extractPosts(strategy,target.getFullYear());
    existingPosts=existingPostsBefore(allPosts,target);
  }
  const plan=planRemainingStages(target,existingPosts);
  return {
    from_date:`${target.getFullYear()}-${String(target.getMonth()+1).padStart(2,"0")}-${String(target.getDate()).padStart(2,"0")}`,
    existing_posts_this_month:existingPosts.length,
    remaining_slots:plan.length,
    plan,
  };
}

function plan(target){
  const resources=readResources(ROOT,target), posts=extractPosts(resources.strategy,target.getFullYear()), post=selectPost(posts,target);
  if(!post)throw new Error("No se pudo localizar ninguna publicación en recursos/estrategia_mes.html");
  const evidence=rankEvidence(extractEvidence(resources.research,20),`${post.title} ${post.brief}`);
  return {resources,posts,post,evidence};
}
function run(target){
  const started=new Date().toISOString(), p=plan(target), spec=buildSpec(p.post,p.evidence,p.resources), runDir=path.join(ROOT,"outputs",spec.id);
  fs.mkdirSync(runDir,{recursive:true});
  fs.writeFileSync(path.join(runDir,"spec.json"),JSON.stringify(spec,null,2));
  const leadMagnet=buildLeadMagnet(runDir,spec);
  const copySourceFile=path.join(runDir,"copy-source.json");
  const sourceCopies=fs.existsSync(copySourceFile)?JSON.parse(fs.readFileSync(copySourceFile,"utf8")):buildCopies(spec,{resourceReady:leadMagnet.ready});
  const humanized=applyMechanicalFilter(sourceCopies);
  if(!humanized.report.passed)throw Object.assign(new Error("El copy no superó el filtro mecánico post-Humanizer"),{code:"HUMANIZER_BLOCK",violations:humanized.report.remaining});
  const copies=humanized.copies;
  fs.writeFileSync(path.join(runDir,"copy-instagram.md"),copies.instagram+"\n");
  fs.writeFileSync(path.join(runDir,"copy-linkedin.md"),copies.linkedin+"\n");
  fs.writeFileSync(path.join(runDir,"humanizer.json"),JSON.stringify(humanized.report,null,2));
  fs.writeFileSync(path.join(runDir,"sources.json"),JSON.stringify(spec.evidence,null,2));
  const render=renderAll(runDir,spec);
  const imagegenPromptsFile=path.join(runDir,"imagegen-prompts.json");
  if(!fs.existsSync(imagegenPromptsFile))buildImagegenPrompts(runDir,spec);
  const qa=validateRun(runDir,spec,copies);
  const manifest={id:spec.id,title:spec.title,date:spec.date,status:qa.status,started_at:started,completed_at:new Date().toISOString(),stage:spec.stage,cta:spec.cta,render,lead_magnet:leadMagnet,copy_source:fs.existsSync(copySourceFile)?"agent-authored":"fallback-blocked",artifacts:{contact_sheet:"contact-sheet.svg",instagram:"copy-instagram.md",linkedin:"copy-linkedin.md",qa:"qa.md",imagegen_prompts:"imagegen-prompts.json"}};
  fs.writeFileSync(path.join(runDir,"manifest.json"),JSON.stringify(manifest,null,2));
  saveState(manifest);
  if(qa.status!=="APPROVED"){
    const waitingOnImage=qa.failures.some(f=>["GPT_IMAGE_2_ASSETS","GPT_IMAGE_2_MANIFEST"].includes(f.code));
    const msg=waitingOnImage
      ?`Copy, maqueta y prompts listos. Faltan los PNG finales: pasa content-os/state runDir /outputs/${spec.id}/imagegen-prompts.json a un agente con GPT Image 2.0 (Codex, via suscripción), coloca los PNG en final/ y su imagegen.json, luego re-ejecuta content:validate.`
      :"La ejecución no superó QA";
    throw Object.assign(new Error(msg),{code:waitingOnImage?"WAITING_ON_IMAGE_GENERATION":"QA_BLOCK",violations:qa.failures});
  }
  return manifest;
}
function validateLatest(){const state=JSON.parse(fs.readFileSync(path.join(ROOT,"content-os/state/state.json"),"utf8"));const latest=state.runs.at(-1);if(!latest)throw new Error("No existen ejecuciones");const dir=path.join(ROOT,"outputs",latest.id),spec=JSON.parse(fs.readFileSync(path.join(dir,"spec.json"),"utf8")),copies={instagram:fs.readFileSync(path.join(dir,"copy-instagram.md"),"utf8"),linkedin:fs.readFileSync(path.join(dir,"copy-linkedin.md"),"utf8")};return validateRun(dir,spec,copies)}
function saveState(manifest){const file=path.join(ROOT,"content-os/state/state.json");fs.mkdirSync(path.dirname(file),{recursive:true});let state={version:1,runs:[]};if(fs.existsSync(file))state=JSON.parse(fs.readFileSync(file,"utf8"));state.runs=state.runs.filter(r=>r.id!==manifest.id);state.runs.push(manifest);fs.writeFileSync(file,JSON.stringify(state,null,2))}
function rankEvidence(evidence,query){const stop=new Set(["para","como","este","esta","esto","desde","hasta","tiene","tienes","tiempo","mes","negocio","munición"]);const terms=new Set(query.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>3&&!stop.has(w)));return [...evidence].sort((a,b)=>score(b)-score(a));function score(item){const value=`${item.claim} ${item.business}`.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();return [...terms].reduce((n,t)=>n+(value.includes(t)?1:0),0)}}
