/* V7: native scroll is the only timeline. Coarse anchors use the unmodified small WebPs. */
(() => {
 'use strict';
 const hero=document.querySelector('.hero-scroll'),pin=hero?.querySelector('.hero-pin'),canvas=document.querySelector('#brand-sequence'),button=document.querySelector('#sequence-toggle'),poster=document.querySelector('#sequence-poster');
 if(!pin||!canvas||!button||!poster)return;
 const zh=document.documentElement.lang.startsWith('zh'),reduce=matchMedia('(prefers-reduced-motion: reduce)'),low=navigator.deviceMemory>0&&navigator.deviceMemory<=2,limit=low?5:8,net=navigator.connection;
 const light=()=>!!(net?.saveData||/2g/.test(net?.effectiveType||'')),staticMode=()=>reduce.matches||still;
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
 const ready=new Map(),anchors=new Map(),inflight=new Map(),failed=new Map(),blobs=new Map();
 let start=0,range=1,tier=480,raf=0,target=1,shown=1,direction=1,epoch=0,drawKey='',still=false,suspended=false,visible=true,pack=null,packTried=false,prewarm=false,blobBytes=0,lastP=-1,coverWidth=0,canW=0,canH=0,lastTargetAt=0,lastAbortAt=0,fast=false,settleTimer=0;
 const stats={requests:0,errors:0,draws:0,aborted:0,networkBytes:0,decodedPeak:0};
 function layout(){const hdr=document.querySelector('#v7-header'),hh=hdr.offsetHeight;hero.style.setProperty('--scrub-header',hh+'px');start=scrollY+hero.getBoundingClientRect().top-hh;const sticky=getComputedStyle(pin).position==='sticky';range=Math.max(1,sticky?hero.offsetHeight-pin.offsetHeight:pin.offsetHeight-hh);const t=innerWidth<=600?480:innerWidth<=900?800:1280;if(t!==tier){release();tier=t}coverWidth=Math.max(pin.clientWidth,pin.clientHeight*16/9);canW=Math.min(tier,Math.round(coverWidth*(devicePixelRatio||1)));canH=Math.max(1,Math.round(canW*9/16));Object.assign(canvas.dataset,{start,range,pinned:sticky,resolution:tier});schedule()}
 function controls(){button.hidden=false;button.disabled=reduce.matches;button.setAttribute('aria-pressed',String(staticMode()));button.textContent=staticMode()?(zh?'靜態畫面':'Still image'):(zh?'靜態畫面':'Still image');button.setAttribute('aria-label',reduce.matches?(zh?'依減少動態設定顯示靜態畫面':'Static image per system preference'):still?(zh?'恢復捲動動畫':'Restore scroll motion'):(zh?'改用靜態畫面':'Use a still image'));canvas.dataset.state=staticMode()?'static':'scrubbing'}
 function story(p){if(lastP===p)return;lastP=p;const s=Math.min(1,Math.max(0,(p-.12)/.65));pin.style.setProperty('--brand-shift',-Math.round(s*(innerWidth<700?12:22))+'px');pin.style.setProperty('--brand-visibility',(1-s*.16).toFixed(3));pin.style.setProperty('--foot-visibility',(.9+s*.1).toFixed(3));pin.style.setProperty('--hint-visibility',String(Math.max(0,1-p*5)))}
 function release(){epoch++;clearTimeout(settleTimer);for(const c of inflight.values())c.abort();inflight.clear();pack?.abort();pack=null;packTried=false;for(const map of [ready,anchors]){map.forEach(x=>x.close?.());map.clear()}blobs.clear();blobBytes=0;failed.clear();drawKey=''}
 async function decode(blob){if(typeof createImageBitmap==='function'){try{return await createImageBitmap(blob)}catch{}}const u=URL.createObjectURL(blob);try{const im=new Image();im.src=u;await im.decode();return im}finally{URL.revokeObjectURL(u)}}
 function schedule(){if(!raf&&!suspended)raf=requestAnimationFrame(update)}
 function getBest(){if(target===1)return [1,null,'poster'];let n=1,best=Math.abs(target-1);for(const m of [ready,anchors])for(const k of m.keys()){const d=Math.abs(k-target);if(d<best||(d===best&&k===shown)){n=k;best=d}}return [n,ready.get(n)||anchors.get(n),n===1?'poster':ready.has(n)?'full':'anchor']}
 function draw(){const [n,img,kind]=getBest(),key=n+'/'+kind+'/'+canW;if(key===drawKey)return;drawKey=key;if(img){if(canvas.width!==canW||canvas.height!==canH){canvas.width=canW;canvas.height=canH}ctx.drawImage(img,0,0,canW,canH);canvas.style.opacity='1'}else canvas.style.opacity='0';shown=n;canvas.dataset.frame=String(n);stats.draws++}
 async function warm(){if(packTried||!prewarm||staticMode()||suspended||!visible||document.hidden||light())return;packTried=true;const ctl=new AbortController(),stamp=epoch;pack=ctl;try{stats.requests++;const res=await fetch('/assets/v7/anchors.json',{priority:'low',signal:ctl.signal});if(!res.ok)throw Error();const rows=await res.json();for(const [n,src] of rows){if(epoch!==stamp)return;if(low&&![24,48,72,96].includes(n))continue;const data=Uint8Array.from(atob(src),c=>c.charCodeAt(0)),im=await decode(new Blob([data],{type:'image/webp'}));if(epoch!==stamp){im.close?.();return}anchors.set(n,im);stats.networkBytes+=data.length;stats.decodedPeak=Math.max(stats.decodedPeak,anchors.size+ready.size);if(n===target)schedule()}}catch(e){if(e.name!=='AbortError')stats.errors++}finally{if(pack===ctl)pack=null}}
 function fetchOne(n){if(n<2||n>96||ready.has(n)||inflight.has(n)||(tier===480&&anchors.has(n))||(failed.get(n)||0)>performance.now())return;
 const ctl=new AbortController(),stamp=epoch;inflight.set(n,ctl);(async()=>{
 let blob=blobs.get(n);if(!blob){stats.requests++;const r=await fetch('/assets/brand-opening/sequence/'+tier+'/'+String(n).padStart(3,'0')+'.webp',{signal:ctl.signal,priority:n===target?'auto':'low'});if(!r.ok)throw Error();blob=await r.blob();if(epoch!==stamp||ctl.signal.aborted)return;stats.networkBytes+=blob.size;blobs.set(n,blob);blobBytes+=blob.size;while(blobBytes>(low?2:4)*1e6&&blobs.size>1){const k=blobs.keys().next().value;blobBytes-=blobs.get(k).size;blobs.delete(k)}}
 if(Math.abs(n-target)>8)return;const im=await decode(blob);if(epoch!==stamp||ctl.signal.aborted||Math.abs(n-target)>8){im.close?.();return}
 ready.set(n,im);while(ready.size>limit){const k=[...ready.keys()].filter(k=>k!==target&&k!==shown).sort((a,b)=>Math.abs(b-target)-Math.abs(a-target))[0];ready.get(k)?.close?.();ready.delete(k)}stats.decodedPeak=Math.max(stats.decodedPeak,ready.size+anchors.size);if(target===n||performance.now()-lastTargetAt<45)schedule();
 })().catch(e=>{if(e.name==='AbortError'){stats.aborted++;return}if(epoch===stamp){stats.errors++;failed.set(n,performance.now()+3000)}}).finally(()=>{if(inflight.get(n)===ctl)inflight.delete(n);if(epoch===stamp)fill()})}
 function fill(){if(staticMode()||suspended||!visible||document.hidden)return;
 const movingFast=fast&&performance.now()-lastTargetAt<90;
 const list=target===1?(prewarm&&!light()?[2,3,4]:[]):light()||movingFast?[target]:[target,target+direction,target+2*direction,target+3*direction,target-direction];
 for(const n of list){if(inflight.size>=(movingFast?1:3))break;fetchOne(n)}}
 function update(){raf=0;if(suspended)return;visible=scrollY>=start-pin.offsetHeight&&scrollY<start+range+pin.offsetHeight;const p=staticMode()?0:Math.max(0,Math.min(1,(scrollY-start)/range)),next=1+Math.round(p*95);
 if(next!==target){const now=performance.now();fast=Math.abs(next-target)/Math.max(1,now-lastTargetAt)>.06;lastTargetAt=now;direction=Math.sign(next-target);target=next;canvas.dataset.target=String(target);
 // This timer schedules only the final-position network request, never timed frame playback.
 clearTimeout(settleTimer);settleTimer=setTimeout(fill,95);
 // Reserve a lane for the new position on a fling. Aborted callbacks cannot mutate the new target.
 if(inflight.size>=3&&!inflight.has(target)&&!ready.has(target)&&now-lastAbortAt>150){const stale=[...inflight.keys()].filter(n=>Math.abs(n-target)>12).sort((a,b)=>Math.abs(b-target)-Math.abs(a-target))[0];if(stale){lastAbortAt=now;const old=inflight.get(stale);inflight.delete(stale);old.abort()}}}
 story(p);if(visible||target===1)draw();fill();warm()}
 function mode(){release();controls();hero.classList.toggle('v7-static',staticMode());layout()}
 button.addEventListener('click',()=>{still=!still;mode()});reduce.addEventListener('change',mode);
 addEventListener('scroll',schedule,{passive:true});new ResizeObserver(layout).observe(pin);addEventListener('resize',layout,{passive:true});addEventListener('orientationchange',layout,{passive:true});
 addEventListener('pagehide',()=>{suspended=true;cancelAnimationFrame(raf);raf=0;release()});addEventListener('pageshow',()=>{suspended=false;layout()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)layout()});
 const idle=()=>setTimeout(()=>{prewarm=true;warm();fill()},50);if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true});
 window.OWLNEST_SCROLL_DIAGNOSTICS=()=>({target,shown,start,range,tier,decoded:ready.size+anchors.size,pending:inflight.size,compressed:blobs.size,compressedBytes:blobBytes,limit:limit+(low?4:16),static:staticMode(),pinned:getComputedStyle(pin).position==='sticky',...stats});
 canvas.dataset.samples='96';canvas.dataset.target='1';mode();
})();
