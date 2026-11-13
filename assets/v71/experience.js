/* Presentation adapter; the approved V7 scroll controller is not altered. */
(()=>{
'use strict';
const zh=document.documentElement.lang.startsWith('zh'),btn=document.querySelector('#sequence-toggle'),wrap=document.querySelector('.v71-motion'),note=document.querySelector('#v71-motion-note');
if(btn&&wrap&&note){
const update=()=>{const still=btn.getAttribute('aria-pressed')==='true';wrap.hidden=btn.hidden;
btn.textContent=zh?(still?'已減少動態':'減少動態'):(still?'Motion reduced':'Reduce motion');
btn.setAttribute('aria-label',btn.disabled?(zh?'依裝置設定減少動態':'Reduced motion follows your device setting'):(still?(zh?'恢復隨捲動變化的畫面':'Restore scroll-controlled motion'):(zh?'改為靜態畫面，減少動態':'Reduce motion: use a still scene')));
note.textContent=btn.disabled?(zh?'依裝置的減少動態設定':'Following your device setting'):(still?(zh?'繼續向下探索':'Scroll to continue'):(zh?'向下捲動探索':'Scroll to explore'));
};
new MutationObserver(update).observe(btn,{attributes:true,attributeFilter:['aria-pressed','disabled','hidden']});update();
}
const nav=document.querySelector('.v71-chapters'),details=nav?.querySelector('details');
if(details){
nav.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;details.open=false;document.getElementById(a.hash.slice(1))?.focus({preventScroll:true})});
nav.addEventListener('keydown',e=>{if(e.key==='Escape'&&details.open){details.open=false;nav.querySelector('summary').focus();e.stopPropagation()}});
document.addEventListener('click',e=>{if(details.open&&!nav.contains(e.target))details.open=false});
}
})();
