const {fs,path,repo,evidence,save,pw,chrome,viewport,isolate,consent,git}=require('./common.cjs');
const assert=require('node:assert/strict'),base=process.env.QA_BASE||'http://127.0.0.1:59476',stage=process.argv[2]||'local';
const manifest=require(repo+'/config/site-source-manifest.json'),engines=(process.env.QA_ENGINES||'chromium,firefox,webkit').split(','),results=[];
const record=(id,status,detail)=>{results.push({id,status,...detail});save('qa-'+stage+'.json',{base,at:new Date().toISOString(),device:'Browser simulation; NOT physical iPhone Safari',results});console.log(status,id,detail.error||'');};
async function home(p,width){
 const frames=[];for(const ratio of [.12,.8,.28]){await p.evaluate(r=>{const d=OWLNEST_SCROLL_DIAGNOSTICS();scrollTo(0,d.start+d.range*r);},ratio);await p.waitForTimeout(750);frames.push(await p.evaluate(()=>OWLNEST_SCROLL_DIAGNOSTICS()));}
 assert.ok(frames[1].target>frames[0].target&&frames[2].target<frames[1].target,'reversible scroll');
 const last=frames[2].target;await p.waitForTimeout(350);assert.equal((await p.evaluate(()=>OWLNEST_SCROLL_DIAGNOSTICS())).target,last,'no timed playback');
 assert.ok(frames.every(x=>x.decoded<=x.limit),'bounded decoded cache');
 await p.locator('#sequence-toggle').click();assert.ok((await p.evaluate(()=>OWLNEST_SCROLL_DIAGNOSTICS())).static);
 await p.locator('#sequence-toggle').click();assert.ok(!(await p.evaluate(()=>OWLNEST_SCROLL_DIAGNOSTICS())).static);
 await p.locator('input[name=package][value=duo]').check();assert.match(await p.locator('.selection-status').innerText(),/89/);
 await p.locator('input[name=package][value=single]').check();assert.match(await p.locator('.selection-status').innerText(),/49/);
 assert.equal(await p.locator('[data-shopify-checkout-package=single]').isVisible(),true);
 await p.evaluate(()=>scrollTo(0,0));
 if(width<1060)await p.locator('.v7-menu').click();
 for(const id of [1,2]){const b=p.locator(`button[aria-controls="v7-sub-${id}"]`);if(width<1060)await b.click();else await b.hover();assert.equal(await b.getAttribute('aria-expanded'),'true');assert.ok(await p.locator(`#v7-sub-${id} a`).first().isVisible());await p.keyboard.press('Escape');assert.equal(await b.getAttribute('aria-expanded'),'false');}
 if(width<1060&&await p.locator('.v7-menu').getAttribute('aria-expanded')!=='true')await p.locator('.v7-menu').click();
 const before=new URL(p.url()).pathname,lang=p.locator(width<1060?'.v7-drawer-tools .v7-lang':'.v7-desktop-tools .v7-lang');await lang.click();await p.waitForLoadState('load');assert.notEqual(new URL(p.url()).pathname.startsWith('/zh-tw/'),before.startsWith('/zh-tw/'));
 return {frames:frames.map(x=>({target:x.target,shown:x.shown,decoded:x.decoded,limit:x.limit,errors:x.errors})),prices:'49/89 selectors; checkout handlers preserved, no cart/order submitted',navigation:'products/lab disclosure, Escape and actual language click'};
}
(async()=>{for(const engine of engines){let b;try{b=engine==='chromium'?await chrome():await pw[engine].launch({headless:true});}catch(e){record(engine,'NOT TESTED',{error:e.message});continue;}
try{for(const width of [320,393,768,1440]){const c=await b.newContext({viewport:viewport(width),hasTouch:width<768});await isolate(c);await consent(c);const p=await c.newPage();p.setDefaultTimeout(15000);
for(const {route,file}of manifest.routes.filter(r=>!process.env.QA_ROUTE_FILTER||r.route.includes(process.env.QA_ROUTE_FILTER))){const id=engine+' '+width+' '+route,errors=[];const listener=e=>errors.push(e.message);p.on('pageerror',listener);try{const response=await p.goto(base+route,{waitUntil:'load',timeout:60000});assert.equal(response.status(),200);await p.evaluate(()=>document.fonts.ready);
 const info=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,headings:document.querySelectorAll('h1').length,nav:[...document.querySelectorAll('.v7-list>.v7-item>.v7-row>a')].map(a=>({label:a.textContent.trim(),href:a.getAttribute('href')})),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.currentSrc).map(i=>new URL(i.currentSrc).pathname),canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content,gtm:document.documentElement.innerHTML.includes('GTM-PC4ZNPWQ'),consent:!!document.querySelector('script[src*="consent.js"]')}));
 assert.ok(info.overflow<=1,'horizontal overflow '+info.overflow);assert.equal(info.nav.length,5);assert.deepEqual(info.broken,[]);assert.ok(info.canonical?.startsWith('https://owlnestofficial.com'));assert.ok(!info.robots?.includes('noindex'));assert.equal(info.gtm,git('show','4f25a0670a1924694c08a34c027f56750ecd77eb:'+file).includes('GTM-PC4ZNPWQ'),'tracking presence preserved');assert.ok(info.consent);assert.deepEqual(errors,[]);
 const isHome=['/','/zh-tw/'].includes(route),body=await p.locator('body').innerText();if(isHome||route.endsWith('/products/lume/')){assert.ok(body.includes('US$49')&&body.includes('US$89'));assert.ok(!/US\$119|US\$219/.test(body));}
 const interaction=isHome?await home(p,width):undefined;
 if(/21-day-program\/$/.test(route)){const apply=p.locator('a[href="#application"]').first();await apply.click();assert.equal(new URL(p.url()).hash,'#application');assert.ok(await p.locator('[data-enrollment-form] fieldset').evaluate(e=>e.disabled));assert.ok(await p.locator('[data-enrollment-form] input').first().isDisabled());assert.ok(await p.locator('[data-enrollment-form] button[type=submit]').isDisabled());info.research='Existing application section reachable; data collection disabled; no submission';}
 record(id,'PASS',{...info,interaction,errors});
}catch(e){record(id,'FAIL',{error:e.message,errors});await p.screenshot({path:path.join(evidence,stage+'-failure-'+engine+'-'+width+'-'+route.replaceAll('/','_')+'.png'),fullPage:true}).catch(()=>{});}finally{p.off('pageerror',listener);}}
await c.close();}
const c=await b.newContext({viewport:viewport(393),reducedMotion:'reduce'});await isolate(c);await consent(c);const p=await c.newPage();await p.goto(base+'/',{waitUntil:'load'});await p.waitForTimeout(250);assert.ok((await p.evaluate(()=>OWLNEST_SCROLL_DIAGNOSTICS())).static);record(engine+' reduced-motion','PASS',{});await c.close();
const fail=await b.newContext({viewport:viewport(393)});await isolate(fail);await consent(fail);await fail.route('**/assets/brand-opening/sequence/**',r=>r.request().url().endsWith('/001.webp')?r.continue():r.abort());await fail.route('**/assets/v7/anchors.json',r=>r.abort());const f=await fail.newPage();await f.goto(base+'/',{waitUntil:'load'});await f.evaluate(()=>{const d=OWLNEST_SCROLL_DIAGNOSTICS();scrollTo(0,d.start+d.range*.6)});await f.waitForTimeout(500);assert.ok(await f.locator('#sequence-poster').evaluate(i=>i.complete&&i.naturalWidth>0));record(engine+' frame-failure-static-fallback','PASS',{});await fail.close();
}catch(e){record(engine+' suite','FAIL',{error:e.message});}finally{await b.close();}}
console.log(JSON.stringify(results.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{})));
})().catch(e=>{console.error(e);process.exitCode=1;});
