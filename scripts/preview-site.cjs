// Loopback-only, read-only QA server. No API, participant submissions, email,
// credentials or production configuration. Not an Internet-facing backend.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const output=path.resolve(process.argv[2]||''),port=Number(process.argv[3]||59431),site=path.join(output,'site');
const manifest=JSON.parse(fs.readFileSync(path.join(output,'build-manifest.json'))),allowed=new Set(manifest.files.map(x=>x.path));
const {redirects}=JSON.parse(fs.readFileSync(path.join(output,'routes.json')));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.pdf':'application/pdf'};
http.createServer((req,res)=>{res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-OWLNEST-Source',manifest.revision);res.setHeader('Cache-Control','no-store');
 if(!['GET','HEAD'].includes(req.method))return res.writeHead(405).end();let u;try{u=new URL(req.url,'http://localhost');u.pathname=decodeURIComponent(u.pathname)}catch{return res.writeHead(400).end()}
 if(u.pathname.includes('..')||u.pathname.includes('\\'))return res.writeHead(400).end();
 if(redirects[u.pathname])return res.writeHead(301,{Location:redirects[u.pathname]+u.search}).end();
 const rel=u.pathname.replace(/^\//,'');let file=[rel,!rel?'index.html':rel.endsWith('/')?rel+'index.html':rel+'/index.html',rel+'.html'].find(f=>allowed.has(f));if(!file)return res.writeHead(404).end();
 res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream'});if(req.method==='HEAD')return res.end();fs.createReadStream(path.join(site,file)).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${port}/ ${manifest.revision}`));
