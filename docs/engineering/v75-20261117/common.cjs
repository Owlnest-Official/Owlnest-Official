const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../..'),evidence=path.join(__dirname,'evidence');
const sshArgs=['-o','BatchMode=yes','-o','ConnectTimeout=15','-o','StrictHostKeyChecking=yes','-o','IdentitiesOnly=yes','-i',path.join(process.env.USERPROFILE,'.ssh/id_ed25519'),'owlnest@95.216.162.11'];
const remote=script=>cp.execFileSync('ssh',[...sshArgs,'sh','-s'],{input:script.replace(/\r/g,'')+'\n',encoding:'utf8',timeout:300000,maxBuffer:16e6});
const save=(name,value)=>{const file=path.join(evidence,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
const git=(...args)=>cp.execFileSync('git',args,{cwd:repo,encoding:'utf8'}).trim();
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(repo,file))).digest('hex');
const pw=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core'));
const viewport=w=>({width:w,height:({320:568,393:852,768:1024,1440:900})[w]});
const chrome=()=>pw.chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
async function isolate(c){await c.route('**/*',r=>{const u=new URL(r.request().url());return /shopify|shop\.owlnestofficial|googletagmanager|google-analytics|\.supabase\.co$/.test(u.hostname)||r.request().method()!=='GET'||/^\/(api|\.netlify\/functions)\//.test(u.pathname)?r.abort('blockedbyclient'):r.continue();});}
async function consent(c){await c.addInitScript(()=>localStorage.setItem('owlnest_consent_v1',JSON.stringify({version:1,analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})));}
module.exports={fs,path,cp,repo,evidence,remote,save,git,hash,pw,viewport,chrome,isolate,consent,sshArgs};
