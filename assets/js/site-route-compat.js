// Preserve legacy purchase intent without redirecting the Products overview itself.
(() => {
 const prefix=location.pathname.startsWith('/zh-tw/')?'/zh-tw':'';
 if(location.pathname===prefix+'/products/'&&['#buy','#buy-options','#purchase','#creator-code-form'].includes(location.hash))
   location.replace(prefix+'/products/lume/'+location.search+location.hash.replace('#purchase','#buy'));
 // Carry acquisition query parameters across the overview → product boundary.
 if(location.pathname===prefix+'/products/'&&location.search)
   document.querySelectorAll('a[href^="'+prefix+'/products/lume/"]').forEach(a=>{const u=new URL(a.href);u.search=location.search;a.href=u.pathname+u.search+u.hash});
})();
