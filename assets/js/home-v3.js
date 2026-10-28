        function owlnestTrack(eventName, params = {}) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: eventName,
                event_source: 'owlnest_site',
                ...params
            });
        }


/* Approved V3 homepage UI. Shared navigation, animation and Shopify logic are unchanged. */
(() => {
 'use strict';
 const drawer=document.getElementById('mobile-menu');
 const toggle=document.querySelector('[data-mobile-menu-toggle]');
 const main=document.getElementById('main');
 window.toggleMobileMenu=()=>{
  const open=drawer.hidden;
  drawer.hidden=!open; drawer.classList.toggle('open',open); drawer.setAttribute('aria-hidden',String(!open));
  toggle.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);main.inert=open;
  if(open) drawer.querySelector('a').focus(); else toggle.focus();
 };
 drawer.addEventListener('click',e=>{if(e.target.closest('a')&&!drawer.hidden)window.toggleMobileMenu();});
 document.addEventListener('keydown',e=>{
  if(drawer.hidden)return;
  if(e.key==='Escape'){e.preventDefault();window.toggleMobileMenu();}
  if(e.key==='Tab'){
   const items=[toggle,...drawer.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);
   if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus();}
   else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus();}
  }
 });
 const radios=[...document.querySelectorAll('input[name=package]')];
 function selection(){
  const value=radios.find(r=>r.checked).value;
  document.querySelectorAll('[data-shopify-checkout-package]').forEach(b=>{b.hidden=b.dataset.shopifyCheckoutPackage!==value;});
  const zh=document.documentElement.lang.startsWith('zh');
  document.querySelector('.selection-status').textContent=zh?`${value==='single'?'已選擇單盞':'已選擇雙盞'} · US$${value==='single'?'119':'219'}`:`${value==='single'?'Single':'Duo'} selected · US$${value==='single'?'119':'219'}`;
 }
 radios.forEach(r=>r.addEventListener('change',selection));window.addEventListener('pageshow',selection);selection();
})();
