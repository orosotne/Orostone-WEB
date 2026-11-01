import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { CookieProvider, useCookies } from '../../context/CookieContext';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Safari with "Block All Cookies", Chrome or Firefox with site data blocked for orostone.sk: reading
// window.localStorage or window.sessionStorage throws a SecurityError. ThemeProvider, the outermost provider in
// EshopApp, read the saved theme while rendering, so React unmounted the whole app and the visitor saw an empty page.
// CartProvider is not rendered here: its imports read import.meta.env, which only Vite provides.

/** Makes every access to localStorage and sessionStorage throw as in such a browser; returns the undo. */
function blockStorage(): () => void {
  const names = ['localStorage', 'sessionStorage'] as const;
  const saved = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  for (const name of names) {
    Object.defineProperty(globalThis, name, {
      configurable: true,
      get() {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      },
    });
  }
  return () =>
    names.forEach((name, i) => {
      const descriptor = saved[i];
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    });
}

function Probe() {
  const { theme } = useTheme();
  const { preferences, hasConsented } = useCookies();
  return h('p', null, `theme=${theme} analytics=${preferences.analytics} marketing=${preferences.marketing} consented=${hasConsented}`);
}

test('the providers render with their defaults when the browser blocks storage', (t) => {
  t.after(blockStorage());
  assert.throws(() => localStorage.getItem('orostone-theme'), { name: 'SecurityError' });

  const html = renderToString(h(ThemeProvider, null, h(CookieProvider, null, h(Probe))));
  // The default theme and the cookie defaults as they are: the bar asks, nothing is chosen yet
  assert.equal(html, '<p>theme=classic analytics=true marketing=true consented=false</p>');
});

test('a rejection reaches the chat widget although the browser cannot store it', (t) => {
  t.after(blockStorage());
  t.mock.method(console, 'error', () => {});
  const captured: { cookies?: ReturnType<typeof useCookies> } = {};
  function Capture() {
    captured.cookies = useCookies();
    return null;
  }
  renderToString(h(CookieProvider, null, h(Capture)));
  assert.ok(captured.cookies);

  // A server render drops later state updates, so the choice applied in memory is seen where CookieContext
  // hands it to the chat widget, in the same step as the preferences and the closed bar
  const calls: unknown[] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { AIPredajca: { setConsent: (consent: unknown) => calls.push(consent) } },
  });
  t.after(() => Reflect.deleteProperty(globalThis, 'window'));

  captured.cookies.rejectAll();
  assert.deepEqual(calls, [{ analytics: false, preferences: false }]);
});
