// Local static fallback for reviewed route migrations. Nginx 301 activation is a
// separate release step. Preserve acquisition queries and old purchase fragments.
(() => {
  const target = document.querySelector('meta[name="owlnest-route-target"]')?.content;
  if (!target || !target.startsWith('/') || target.startsWith('//')) return;
  if (location.pathname !== target) location.replace(target + location.search + location.hash);
})();
