import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),PORT=Number(process.env.PORT||4173);
const types={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".md":"text/markdown; charset=utf-8"};
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,"http://localhost");
  if(req.method==="POST"&&url.pathname==="/api/run")return runLoop(res);
  if(url.pathname==="/api/state")return send(res,path.join(ROOT,"content-os/state/state.json"));
  let target=url.pathname==="/"?path.join(ROOT,"content-os/app/index.html"):path.join(ROOT,decodeURIComponent(url.pathname.slice(1)));
  if(!target.startsWith(ROOT))return end(res,403,"Forbidden");
  send(res,target);
});
server.listen(PORT,"127.0.0.1",()=>console.log(`Content OS: http://127.0.0.1:${PORT}`));
function runLoop(res){const child=spawn(process.execPath,[path.join(ROOT,"content-os/cli.mjs"),"run"],{cwd:ROOT});let out="",err="";child.stdout.on("data",d=>out+=d);child.stderr.on("data",d=>err+=d);child.on("close",code=>{res.writeHead(code?422:200,{"content-type":"application/json"});res.end(code?err:out)})}
function send(res,file){if(!fs.existsSync(file)||fs.statSync(file).isDirectory())return end(res,404,"Not found");res.writeHead(200,{"content-type":types[path.extname(file)]||"application/octet-stream","cache-control":"no-store"});fs.createReadStream(file).pipe(res)}
function end(res,status,text){res.writeHead(status,{"content-type":"text/plain; charset=utf-8"});res.end(text)}
