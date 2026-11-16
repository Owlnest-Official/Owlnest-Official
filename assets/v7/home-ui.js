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
 const radios=[...document.querySelectorAll('input[name=package]')];
 function selection(){
  const value=radios.find(r=>r.checked).value;
  document.querySelectorAll('[data-shopify-checkout-package]').forEach(b=>{b.hidden=b.dataset.shopifyCheckoutPackage!==value;});
  const zh=document.documentElement.lang.startsWith('zh');
  document.querySelector('.selection-status').textContent=zh?`${value==='single'?'已選擇單盞':'已選擇雙盞'} · US$${value==='single'?'49':'219'}`:`${value==='single'?'Single':'Duo'} selected · US$${value==='single'?'49':'219'}`;
 }
 radios.forEach(r=>r.addEventListener('change',selection));window.addEventListener('pageshow',selection);selection();
})();
