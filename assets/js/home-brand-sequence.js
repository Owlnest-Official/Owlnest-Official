/* Homepage player. Original 001–096 content/order; bounded progressive queue. */
(() => {
  'use strict';
  const canvas = document.getElementById('brand-sequence');
  const poster = document.getElementById('sequence-poster');
  const button = document.getElementById('sequence-toggle');
  if (!canvas || !poster || !button) return;
  // Do not allocate a drawing surface until the first animated frame is ready.
  let context;
  const zh = document.documentElement.lang.startsWith('zh');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const limited = () => reduced.matches || connection?.saveData || /(^|-)2g/.test(connection?.effectiveType || '') || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  const width = innerWidth <= 600 ? 480 : innerWidth <= 900 ? 800 : 1280;
  const base = new URL(`../brand-opening/sequence/${width}/`, document.currentScript.src);
  const count = 96;
  const frames = Array.from({ length:count }, (_, i) => Math.round(i * 95 / (count - 1)) + 1);
  const interval = 135 * 95 / (count - 1); // Same start/end and total duration.
  const nextFrame = () => frames[frames.indexOf(frame) + 1];
  canvas.dataset.samples = String(count);
  const cache = new Map();
  const failed = new Set();
  let frame = 1, wanted = false, visible = true, pending = 0, raf = 0, last = 0, errors = 0, interacted = false;
  const labels = zh ? { play:'播放', pause:'暫停', replay:'重播', error:'重試播放' } : { play:'Play', pause:'Pause', replay:'Replay', error:'Retry' };
  canvas.width = width; canvas.height = width * 9 / 16;
  button.hidden = false;
  function state() {
    button.textContent = wanted ? labels.pause : frame === 96 ? labels.replay : errors >= 3 ? labels.error : labels.play;
    button.setAttribute('aria-label', (wanted ? (zh?'暫停日夜序列':'Pause day-to-night sequence') : (zh?'播放日夜序列':'Play day-to-night sequence')));
    canvas.dataset.frame = String(frame);
    canvas.dataset.state = wanted && visible && !document.hidden ? 'playing' : 'paused';
    canvas.dataset.buffer = String(cache.size);
  }
  function draw(image) {
    context ||= canvas.getContext('2d', { alpha: false });
    if (!context) { pause(); return; }
    context.drawImage(image, 0, 0, width, width * 9 / 16);
    canvas.style.opacity = '1';
  }
  // Start with an immediately renderable HTML image (also the no-JS fallback).
  canvas.style.opacity = '0';
  function request(n) {
    if (cache.has(n) || failed.has(n) || n > 96) return;
    pending++;
    const image = new Image(); image.decoding = 'async'; image.fetchPriority = 'low';
    cache.set(n, { image, ready:false });
    image.onload = async () => {
      try { await image.decode(); } catch (_) { /* decoded browser image remains usable */ }
      pending--;
      const entry = cache.get(n); if (entry) entry.ready = true;
      state();
      if (wanted && visible && !document.hidden) { fill(); schedule(); }
    };
    image.onerror = () => {
      pending--; errors++; failed.add(n); cache.delete(n);
      if (errors >= 3 || n === nextFrame()) { wanted = false; cancelAnimationFrame(raf); raf = 0; }
      state();
    };
    image.src = new URL(String(n).padStart(3, '0') + '.webp', base).href;
  }
  function fill() {
    if (!wanted || !visible || document.hidden) return;
    // At most 2 requests in flight and 8 frames ahead. Release earlier decoded frames.
    for (const [n] of cache) if (n < frame - 1) cache.delete(n);
    for (const n of frames.slice(frames.indexOf(frame) + 1, frames.indexOf(frame) + 9)) {
      if (pending >= 2) break;
      request(n);
    }
  }
  function tick(time) {
    raf = 0;
    if (!wanted || !visible || document.hidden) { last = 0; return; }
    if (!last) last = time;
    if (time - last >= interval) {
      const next = cache.get(nextFrame());
      if (next?.ready) { frame = nextFrame(); draw(next.image); last = time; fill(); state(); }
    }
    if (frame >= 96) { wanted = false; state(); return; }
    schedule();
  }
  function schedule() { if (!raf && wanted && visible && !document.hidden) raf = requestAnimationFrame(tick); }
  function start() {
    if (frame === 96 || errors >= 3) { frame = 1; cache.clear(); failed.clear(); errors = 0; canvas.style.opacity = '0'; }
    // Any single-frame failure can be retried via the same control.
    failed.clear(); errors = 0; wanted = true; last = 0; fill(); state(); schedule();
  }
  function pause() { wanted = false; cancelAnimationFrame(raf); raf = 0; last = 0; state(); }
  button.addEventListener('click', () => { interacted = true; wanted ? pause() : start(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    else { fill(); schedule(); }
    state();
  }, { threshold:0.15 }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; } else { fill(); schedule(); } state(); });
  reduced.addEventListener('change', () => { if (reduced.matches) pause(); });
  connection?.addEventListener('change', () => { if (limited()) pause(); });
  window.addEventListener('pagehide', pause);
  const ready = () => { setTimeout(() => { if (!limited() && visible && !document.hidden && !interacted && !wanted && frame === 1) start(); }, 2200); };
  if (document.readyState === 'complete') ready(); else window.addEventListener('load', ready, { once:true });
  state();
})();
