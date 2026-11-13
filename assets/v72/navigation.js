/* One controller for mouse, touch and keyboard. Main links always remain native links. */
(() => {
 const h=document.getElementById('v7-header');if(!h)return;
 const toggle=h.querySelector('.v7-menu'),nav=h.querySelector('nav'),buttons=[...h.querySelectorAll('.v7-disclose')];
 const small=matchMedia('(max-width:1060px)'),hover=matchMedia('(hover:hover) and (pointer:fine)');
 const timers=new Map(),suppressed=new Set();let pointerFocusTransfer=false;
 const panel=b=>document.getElementById(b.getAttribute('aria-controls'));
 function clear(b){clearTimeout(timers.get(b));timers.delete(b)}
 function set(b,on){clear(b);b.setAttribute('aria-expanded',String(on));panel(b).hidden=!on}
 function close(except){buttons.filter(b=>b!==except).forEach(b=>set(b,false))}
 function open(b){close(b);set(b,true)}
 function drawer(on,restore=false){close();h.toggleAttribute('data-open',on);toggle.setAttribute('aria-expanded',String(on));if(restore)toggle.focus()}
 toggle.addEventListener('click',()=>drawer(!h.hasAttribute('data-open')));
 for(const b of buttons){const item=b.closest('.v7-item');
  b.addEventListener('click',()=>{if(panel(b).hidden)open(b);else{set(b,false);suppressed.add(b)}});
  item.addEventListener('pointerenter',e=>{clear(b);suppressed.delete(b);if(!small.matches&&hover.matches&&e.pointerType==='mouse')open(b)});
  item.addEventListener('pointerleave',e=>{suppressed.delete(b);if(small.matches||!hover.matches||e.pointerType!=='mouse')return;clear(b);timers.set(b,setTimeout(()=>{if(!panel(b).contains(document.activeElement))set(b,false)},150))});
  item.addEventListener('keydown',e=>{if(e.key==='ArrowDown'&&!panel(b).contains(e.target)){e.preventDefault();suppressed.delete(b);open(b);panel(b).querySelector('a').focus()}});
 }
 document.addEventListener('pointerdown',e=>{pointerFocusTransfer=h.contains(e.target);if(!pointerFocusTransfer)drawer(false);else if(!e.target.closest('.v7-item'))close()},true);
 for(const type of ['pointerup','pointercancel'])document.addEventListener(type,()=>pointerFocusTransfer=false,true);
 // Safari does not focus a clicked button and may blur to null before click.
 // Do not close here and then invert the intended disclosure toggle in that same click.
 h.addEventListener('focusout',e=>{if(!e.relatedTarget&&pointerFocusTransfer)return;if(!h.contains(e.relatedTarget))drawer(false);else if(e.relatedTarget)close(e.relatedTarget.closest('.v7-item')?.querySelector('.v7-disclose'))});
 addEventListener('blur',()=>drawer(false));
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const b=buttons.find(b=>!panel(b).hidden);if(b){set(b,false);if(b.closest('.v7-item').matches(':hover'))suppressed.add(b);else suppressed.delete(b);b.focus()}else if(h.hasAttribute('data-open'))drawer(false,true)});
 small.addEventListener('change',()=>drawer(false));hover.addEventListener('change',()=>close());addEventListener('pageshow',()=>drawer(false));
 nav.addEventListener('click',e=>{if(e.target.closest('a'))drawer(false)});
})();
