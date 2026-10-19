// Dependency-free regression tests. No network calls, orders, or payment data.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/js/shopify-checkout.js'), 'utf8');
const tick = () => new Promise(resolve => setImmediate(resolve));
const cart = (url = 'https://example.test/checkout') => ({ ok: true, json: async () => ({ data: { cartCreate: { cart: { checkoutUrl: url, cost: { totalAmount: { amount: '119', currencyCode: 'USD' } } } } } }) });
function harness({ zh = false, search = '' } = {}) {
  const events = {}, timers = new Map(), requests = [], redirects = [], tracked = [], errors = [];
  const feedback = { textContent: '', classList: { toggle() {} } };
  const buttons = ['single', 'duo'].map(key => ({
    dataset: { shopifyCheckoutPackage: key, checkoutLabel: zh ? `購買 ${key}` : `Buy ${key}`, checkoutLoadingLabel: 'Loading' },
    disabled: false, textContent: key, attrs: {},
    addEventListener(type, fn) { this[type] = fn; },
    setAttribute(key, value) { this.attrs[key] = value; }
  }));
  const storage = () => { const data = new Map(); return { getItem: k => data.get(k) || null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) }; };
  const localStorage = storage(), sessionStorage = storage();
  let response = async () => cart(), nextTimer = 0;
  const context = {
    document: { readyState: 'complete', querySelectorAll: () => buttons, getElementById: () => feedback },
    window: {
      location: { pathname: zh ? '/zh-tw/products/' : '/products', search, assign: url => redirects.push(url) },
      addEventListener: (event, fn) => events[event] = fn,
      owlnestTrack: (...args) => tracked.push(args)
    },
    fetch: (...args) => { requests.push(args); return response(...args); },
    localStorage, sessionStorage, URL, URLSearchParams, AbortController,
    setTimeout: (fn, delay) => { timers.set(++nextTimer, { fn, delay }); return nextTimer; },
    clearTimeout: id => timers.delete(id), console: { error: (...args) => errors.push(args) }
  };
  vm.runInNewContext(source, context);
  return { buttons, feedback, requests, redirects, tracked, errors, localStorage, sessionStorage,
    respond: fn => response = fn, click: i => buttons[i].click(),
    event: (name, persisted = true) => events[name]({ persisted }),
    timeout: delay => { const t = [...timers.values()].find(t => t.delay === delay); assert.ok(t, `timer ${delay}`); t.fn(); },
    idle: () => buttons.forEach(b => { assert.equal(b.disabled, false); assert.equal(b.textContent, b.dataset.checkoutLabel); assert.equal(b.attrs['aria-busy'], 'false'); })
  };
}
for (const zh of [false, true]) test(`checkout return restores Single and Duo (${zh ? 'ZH' : 'EN'})`, async () => {
  const h = harness({ zh, search: '?ref=creator-one' });
  await h.click(0); assert.ok(h.buttons.every(b => b.disabled)); assert.equal(h.redirects.length, 1);
  h.event('pagehide'); h.event('pageshow'); h.idle();
  await h.click(1); assert.equal(h.redirects.length, 2);
  const inputs = h.requests.map(([, o]) => JSON.parse(o.body).variables.input);
  assert.equal(inputs[0].lines[0].merchandiseId, 'gid://shopify/ProductVariant/53197831405884');
  assert.equal(inputs[1].lines[0].merchandiseId, 'gid://shopify/ProductVariant/53218207236412');
  assert.equal(inputs[1].lines[0].quantity, 1);
  assert.ok(inputs[1].attributes.some(x => x.key === 'creator_ref' && x.value === 'creator-one'));
  assert.equal(h.tracked[1][1].package, 'duo');
  assert.equal(new URL(h.redirects[1]).searchParams.get('locale'), zh ? 'zh-TW' : null);
});
test('failed request and Shopify error allow another selection', async () => {
  const h = harness(); h.respond(async () => { throw new Error('offline'); });
  await h.click(0); h.idle(); assert.match(h.feedback.textContent, /Unable/);
  h.respond(async () => ({ ok: true, json: async () => ({ data: { cartCreate: { userErrors: [{ message: 'Rejected' }] } } }) }));
  await h.click(1); h.idle(); assert.equal(h.redirects.length, 0);
  h.respond(async () => cart()); await h.click(1); assert.equal(h.redirects.length, 1);
});
test('stalled request times out; late response cannot redirect or disable a newer attempt', async () => {
  const h = harness(); let resolveOld;
  h.respond(() => new Promise(r => resolveOld = r));
  const old = h.click(0); await tick(); await h.click(1); assert.equal(h.requests.length, 1);
  h.timeout(20000); h.idle(); assert.equal(h.requests[0][1].signal.aborted, true);
  h.respond(async () => cart('https://example.test/new')); await h.click(1);
  resolveOld(cart('https://example.test/stale')); await old;
  assert.deepEqual(h.redirects, ['https://example.test/new']); assert.ok(h.buttons.every(b => b.disabled));
});
test('leaving during request cancels it; BFCache restoration is ready for retry', async () => {
  const h = harness(); let resolveOld; h.respond(() => new Promise(r => resolveOld = r));
  const old = h.click(0); h.event('pagehide'); h.event('pageshow'); h.idle();
  resolveOld(cart()); await old; assert.equal(h.redirects.length, 0);
  h.respond(async () => cart()); await h.click(1); assert.equal(h.redirects.length, 1);
});
test('cancelled navigation expires the loading state without automatic retry', async () => {
  const h = harness(); await h.click(0); h.timeout(10000); h.idle();
  assert.match(h.feedback.textContent, /Unable/); assert.equal(h.requests.length, 1);
  await h.click(1); assert.equal(h.requests.length, 2);
});
test('invalid discount remains available to correct; no redirect or attribution changes', async () => {
  const h = harness(); const referral = { attribution_source: 'discount_code', discount_code: 'TEST10', discount_type: 'fixed_amount', discount_currency: 'USD', discount_amount: 10, slug: 'creator-one', expires_at: '2099-01-01' };
  h.sessionStorage.setItem('owlnest_checkout_discount', JSON.stringify(referral));
  await h.click(0); h.idle(); assert.match(h.feedback.textContent, /discount code/);
  const input = JSON.parse(h.requests[0][1].body).variables.input;
  assert.deepEqual(input.discountCodes, ['TEST10']);
  assert.ok(input.attributes.some(x => x.key === 'creator_discount_code' && x.value === 'TEST10'));
  assert.equal(h.sessionStorage.getItem('owlnest_checkout_discount'), JSON.stringify(referral));
  assert.equal(h.redirects.length, 0);
});
