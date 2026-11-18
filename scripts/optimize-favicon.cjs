// Derivative of the existing real logo. No artwork replacement or AI editing.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'));
(async()=>{const file='assets/optimized/favicon-64.png';fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});await sharp(path.join(root,'logo.png')).resize(64,64,{fit:'inside',withoutEnlargement:true}).png({compressionLevel:9}).toFile(path.join(root,file));
const mf=path.join(root,'config/site-source-manifest.json'),m=JSON.parse(fs.readFileSync(mf));for(const r of m.routes){const f=path.join(root,r.file),h=fs.readFileSync(f,'utf8'),next=h.replace(/<link\b(?=[^>]*\brel="icon")(?=[^>]*\bhref="\/logo\.png")[^>]*>/g,tag=>tag.replace('href="/logo.png"',`href="/${file}"`));if(h!==next)fs.writeFileSync(f,next);}if(!m.files.includes(file)){m.files.push(file);m.files.sort();fs.writeFileSync(mf,JSON.stringify(m,null,2)+'\n');}console.log({originalBytes:fs.statSync(path.join(root,'logo.png')).size,derivativeBytes:fs.statSync(path.join(root,file)).size});})();
