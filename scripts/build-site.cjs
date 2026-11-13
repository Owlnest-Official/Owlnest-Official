// Offline, dependency-free build for the repository's static website sources.
// Never publishes, runs checkout scripts, reads secrets, or changes source files.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),manifest=require('../config/site-source-manifest.json');
const out=process.argv[2]&&path.resolve(process.argv[2]);
if(!out)throw Error('Usage: node scripts/build-site.cjs <new empty output directory>');
if(out===root||root.startsWith(out+path.sep)||out.startsWith(root+path.sep))throw Error('Use an output directory outside the source checkout');
if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Output must be new or empty; nothing is deleted');
function exact(file){let current=root;for(const part of file.split('/')){if(!part||part==='.'||part==='..'||!fs.readdirSync(current).includes(part))throw Error('Missing or case-mismatched source: '+file);current=path.join(current,part)}return current}
const records=manifest.files.map(file=>{if(/^(docs\/|server\/|netlify\/|_incoming\/)|(^|\/)\./.test(file))throw Error('Private path in public manifest: '+file);const source=exact(file);return{path:file,bytes:fs.statSync(source).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex')}});
fs.mkdirSync(out,{recursive:true});const site=path.join(out,'site');fs.mkdirSync(site);
for(const row of records){const dest=path.join(site,row.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,row.path),dest)}
fs.writeFileSync(path.join(out,'build-manifest.json'),JSON.stringify({revision:manifest.revision,approvedCandidate:manifest.approvedCandidate,files:records},null,2)+'\n');
fs.copyFileSync(path.join(root,'config/site-routes.json'),path.join(out,'routes.json'));
console.log(JSON.stringify({revision:manifest.revision,output:out,files:records.length,bytes:records.reduce((n,r)=>n+r.bytes,0)}));
