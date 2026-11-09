import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function hookHost() {
  const calls: unknown[][] = [];
  const scripts: Array<{ src?: string; onload?: () => void }> = [];
  const refs: Array<{ current: any }> = [];
  const effects: Array<{ run: () => void; deps: unknown[] }> = [];
  let cursor = 0, effectCursor = 0;
  const choice = { hasConsented: false, preferences: { analytics: true, marketing: true } };
  let interacted = true;
  let pathname = '/';
  const host: any = {
    _GA_ESHOP_ID: 'G-TEST', _GTM_ESHOP_ID: 'GTM-TEST',
    location: new URL('https://orostone.sk/'), dataLayer: [],
    gtag: (...args: unknown[]) => calls.push(args),
  };
  const document = {
    cookie: '', title: 'Orostone', referrer: 'https://www.google.com/search?q=private',
    createElement: () => ({}),
    head: { appendChild: (script: { src?: string; onload?: () => void }) => scripts.push(script) },
  };
  const componentModule = { exports: {} as { useAnalytics: () => void } };
  const source = readFileSync('hooks/useAnalytics.ts', 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const pending: Array<() => void> = [];
  vm.runInNewContext(code, {
    module: componentModule, exports: componentModule.exports, window: host, document, URL, URLSearchParams,
    require: (name: string) => ({
      react: {
        useRef: (value: unknown) => refs[cursor++] ??= { current: value },
        useEffect: (run: () => void, deps: unknown[]) => {
          const index = effectCursor++;
          if (!effects[index] || deps.some((v, i) => !Object.is(v, effects[index].deps[i]))) {
            effects[index] = { run, deps };
            pending.push(run);
          }
        },
      },
      'react-router-dom': { useLocation: () => ({ pathname }) },
      '../context/CookieContext': { useCookies: () => choice },
      './useFirstInteraction': { useFirstInteraction: () => interacted },
    }[name]),
  });
  return {
    calls, scripts, choice, host,
    render(path = pathname, firstInteraction = interacted) {
      pathname = path; interacted = firstInteraction;
      host.location = new URL(path, 'https://orostone.sk');
      cursor = 0; effectCursor = 0;
      componentModule.exports.useAnalytics();
      pending.splice(0).forEach(run => run());
    },
    replayEffects() { effects.forEach(effect => effect.run()); },
    pageviews() { return calls.filter(call => call[0] === 'event' && call[1] === 'page_view'); },
  };
}

test('defaults and a saved rejection do not load GTM or send pageviews', () => {
  const h = hookHost();
  h.render();
  h.render('/produkt/taj-mahal');
  assert.equal(h.scripts.length, 0);
  h.choice.hasConsented = true;
  h.choice.preferences.analytics = false;
  h.render('/');
  assert.equal(h.scripts.length, 0);
  assert.equal(h.pageviews().length, 0);
  assert.equal(h.host['ga-disable-G-TEST'], true);
});

test('one consent-owned GTM script configures manual pageviews, once per displayed route', () => {
  const h = hookHost();
  h.choice.hasConsented = true;
  h.render('/', false);
  assert.equal(h.scripts.length, 0, 'first interaction deferral remains');
  h.render('/', true);
  h.replayEffects();
  assert.equal(h.scripts.length, 1);
  assert.equal(h.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-TEST');
  assert.equal(h.pageviews().length, 0, 'wait for the tag loader');
  h.scripts[0].onload!();
  h.replayEffects();
  h.render('/produkt/taj-mahal');
  h.render('/produkt/taj-mahal');
  h.choice.preferences.marketing = false;
  h.render('/produkt/taj-mahal');
  h.render('/');
  assert.deepEqual(h.pageviews().map(call => (call[2] as any).page_path), ['/', '/produkt/taj-mahal', '/']);
  const configs = h.calls.filter(call => call[0] === 'config');
  assert.equal(configs.length, 1);
  assert.equal((configs[0][2] as any).send_page_view, false);
  assert.ok(h.calls.some(call => call[0] === 'set' && call[1] === 'send_page_view' && call[2] === false));
  assert.equal((h.pageviews()[0][2] as any).page_referrer, 'https://www.google.com/search');
  assert.equal((h.pageviews()[1][2] as any).page_referrer, 'https://orostone.sk/');
});

test('an outgoing first click starts the same loader synchronously with consent before its event', () => {
  const h = hookHost();
  h.render('/', false);
  assert.equal(h.host._startOrostoneAnalytics(), false, 'default preferences are not consent');
  assert.equal(h.scripts.length, 0);
  h.choice.hasConsented = true;
  h.choice.preferences.marketing = false;
  h.render('/', false);
  assert.equal(h.scripts.length, 0, 'ordinary initial loading stays deferred');
  assert.equal(h.host._startOrostoneAnalytics(), true);
  assert.equal(h.scripts.length, 1, 'loader starts in the click, before React interaction effects');
  h.host.gtag('event', 'dining_tables_click', {});
  const consentIndex = h.calls.findIndex(call => call[0] === 'consent' && call[1] === 'update');
  const clickIndex = h.calls.findIndex(call => call[1] === 'dining_tables_click');
  assert.ok(consentIndex >= 0 && consentIndex < clickIndex);
  assert.equal((h.calls[consentIndex][2] as any).analytics_storage, 'granted');
  assert.equal((h.calls[consentIndex][2] as any).ad_storage, 'denied');
  h.render('/', true);
  h.host._startOrostoneAnalytics();
  h.replayEffects();
  assert.equal(h.scripts.length, 1, 'interaction and repeated clicks never inject another tag');
  h.scripts[0].onload!();
  assert.equal(h.pageviews().length, 1);
});

test('late loader uses current route and respects withdrawal before load or after reload', () => {
  const h = hookHost();
  h.choice.hasConsented = true;
  h.render('/');
  h.render('/produkt/taj-mahal');
  h.choice.preferences.analytics = false;
  h.render('/kosik');
  h.scripts[0].onload!();
  assert.equal(h.pageviews().length, 0);
  h.choice.preferences.analytics = true;
  h.render('/kosik');
  assert.deepEqual(h.pageviews().map(call => (call[2] as any).page_path), ['/kosik']);
  h.choice.preferences.analytics = false;
  h.render('/produkt/calacatta-top');
  assert.equal(h.pageviews().length, 1);
  h.choice.preferences.analytics = true;
  h.render('/produkt/calacatta-top');
  assert.equal(h.pageviews().length, 2);
  assert.equal(h.scripts.length, 1);
});

test('HTML owns a denied stub, never an unconditional or second Google loader', () => {
  const html = readFileSync('index.html', 'utf8');
  assert.match(html, /analytics_storage: 'denied'/);
  assert.match(html, /gtag\('set', 'send_page_view', false\)/);
  assert.doesNotMatch(html, /googletagmanager\.com\/(?:gtm\.js|gtag\/js|ns\.html)/);
  const hook = readFileSync('hooks/useAnalytics.ts', 'utf8');
  assert.equal((hook.match(/googletagmanager\.com\/gtm\.js/g) ?? []).length, 1);
  assert.doesNotMatch(hook, /googletagmanager\.com\/gtag\/js/);
});

test('thank-you UI never infers a purchase from a locally pending cart', () => {
  const source = readFileSync('pages/ThankYou.tsx', 'utf8');
  assert.doesNotMatch(source, /popPendingPurchase|trackGA4Purchase|trackMetaEvent/);
  assert.match(source, /Ďakujeme za objednávku!/);
  assert.match(source, /Vaša objednávka bola úspešne prijatá/);
  assert.match(source, /noindex=\{true\}/);
});
