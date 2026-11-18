const {fs,repo,save,hash,git,remote}=require('./common.cjs');
const m=require(repo+'/config/site-source-manifest.json'),baseline=require('./evidence/baseline-source.json');
const findings=[],signature=/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:sk-proj-|sk_live_|shpat_|ghp_|sb_secret_)[A-Za-z0-9_-]{20,}/g;
for(const file of m.files.filter(f=>/\.(html|js|json|css|txt)$/.test(f))){const s=fs.readFileSync(repo+'/'+file,'utf8'),count=[...s.matchAll(signature)].length;if(count)findings.push({file,count});}
const protectedResults=baseline.protected.map(p=>({file:p.file,unchanged:p.sha256===hash(p.file)}));
const protectedRuntime=['assets/v7/scroll.js','assets/v72/navigation.js','assets/js/consent.js','assets/js/shopify-checkout.js','assets/js/referral.js','server/contact-api/server.js','server/analysis-api/server.js'];
for(const file of protectedRuntime)protectedResults.push({file,unchanged:fs.readFileSync(repo+'/'+file,'utf8').replace(/\r/g,'').trim()===git('show','HEAD:'+file).replace(/\r/g,'').trim()});
const pageParity=m.routes.map(({file,route})=>{const now=fs.readFileSync(repo+'/'+file,'utf8').replace(/\r/g,''),before=git('show','HEAD:'+file).replace(/\r/g,'');return {route,bodyAndBusinessScriptsUnchanged:now.slice(now.indexOf('<body')).trim()===before.slice(before.indexOf('<body')).trim(),canonicalUnchanged:now.match(/<link rel="canonical"[^>]*>/)?.[0]===before.match(/<link rel="canonical"[^>]*>/)?.[0],inlineScriptsUnchanged:JSON.stringify([...now.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(x=>x[0]))===JSON.stringify([...before.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(x=>x[0]))};});
save('source-audit.json',{at:new Date().toISOString(),secretScan:{scope:'Current public build text; signature scan, NOT exhaustive historic credential assurance',files:m.files.length,findings,publicIdentifiers:'Supabase publishable / Shopify Storefront public keys are not private Admin secrets'},protectedResults,pageParity});
if(findings.length||protectedResults.some(x=>!x.unchanged)||pageParity.some(x=>!x.bodyAndBusinessScriptsUnchanged||!x.canonicalUnchanged||!x.inlineScriptsUnchanged))throw Error('Source protection failed; see evidence');
console.log('PASS protected sources, 34 page bodies, inline scripts and canonicals unchanged');
save('origin-timing.txt',remote(String.raw`for p in / /zh-tw/ /products/lume/ /lab/; do
printf 'route=%s ' "$p"
curl -sS --resolve owlnestofficial.com:443:127.0.0.1 -o /dev/null -w 'ttfb=%{time_starttransfer} total=%{time_total} tls=%{time_appconnect}\n' "https://owlnestofficial.com$p"
done`));
