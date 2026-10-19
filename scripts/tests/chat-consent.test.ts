import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  CHAT_WIDGET_SCRIPT,
  chatConsentFromPreferences,
  createChatConsentSync,
} from '../../lib/chatConsent';
import type { AIPredajcaApi, ChatConsent, ChatWidgetHost } from '../../lib/chatConsent';

const GRANTED: ChatConsent = { analytics: true, preferences: true };
const DENIED: ChatConsent = { analytics: false, preferences: false };

// A page with the widget's script tag; `load()` runs widget.js (creates window.AIPredajca) and fires the load listeners.
function fakeHost({ withScript = true, apiReady = false } = {}) {
  const calls: unknown[] = [];
  const listeners: Array<() => void> = [];
  const selectors: string[] = [];
  const api: AIPredajcaApi = { setConsent: (consent) => calls.push(consent) };
  const host: ChatWidgetHost = {
    AIPredajca: apiReady ? api : undefined,
    document: {
      querySelector: (selector) => {
        selectors.push(selector);
        return withScript ? { addEventListener: (_type, listener) => listeners.push(listener) } : null;
      },
    },
  };
  const load = (runs = true) => {
    if (runs) host.AIPredajca = api;
    for (const listener of listeners.splice(0)) listener();
  };
  return { host, calls, listeners, selectors, load };
}

test('maps the analytics choice to both chat consents and ignores marketing', () => {
  assert.deepEqual(chatConsentFromPreferences({ analytics: true }), GRANTED);
  assert.deepEqual(chatConsentFromPreferences({ analytics: false }), DENIED);
  const prefs = { necessary: true, analytics: false, marketing: true };
  assert.deepEqual(chatConsentFromPreferences(prefs), DENIED);
});

test('the selector matches the widget script embedded in index.html', () => {
  const html = readFileSync('index.html', 'utf8');
  const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const widget = srcs.filter((src) => src.includes('ai-predajca') && src.endsWith('/widget.js'));
  assert.equal(widget.length, 1, `widget.js not found among ${srcs.join(', ')}`);
  assert.equal(CHAT_WIDGET_SCRIPT, 'script[src*="ai-predajca"][src$="/widget.js"]');
});

test('calls setConsent right away when window.AIPredajca exists', () => {
  const { host, calls, selectors } = fakeHost({ apiReady: true });
  const sync = createChatConsentSync(host);
  sync(GRANTED);
  sync(DENIED);
  assert.deepEqual(calls, [GRANTED, DENIED]);
  assert.deepEqual(selectors, []);
});

test('waits for the widget script to load and then sends only the latest choice', () => {
  const { host, calls, listeners, selectors, load } = fakeHost();
  const sync = createChatConsentSync(host);
  sync(GRANTED);
  sync(DENIED);
  assert.deepEqual(calls, []);
  assert.equal(listeners.length, 1, 'one load listener for several choices');
  assert.deepEqual(selectors, [CHAT_WIDGET_SCRIPT]);
  load();
  assert.deepEqual(calls, [DENIED]);
  sync(GRANTED);
  assert.deepEqual(calls, [DENIED, GRANTED]);
});

test('does nothing without the widget script or when the script loads without its API', () => {
  const missing = fakeHost({ withScript: false });
  assert.doesNotThrow(() => createChatConsentSync(missing.host)(GRANTED));
  assert.deepEqual(missing.calls, []);

  const broken = fakeHost();
  const sync = createChatConsentSync(broken.host);
  sync(GRANTED);
  broken.load(false);
  assert.deepEqual(broken.calls, []);
  // A later choice registers a new listener instead of being lost
  sync(DENIED);
  assert.equal(broken.listeners.length, 1);
  broken.load();
  assert.deepEqual(broken.calls, [DENIED]);
});

test('an error inside the widget does not reach the cookie banner', () => {
  const host: ChatWidgetHost = {
    AIPredajca: { setConsent: () => { throw new Error('widget failed'); } },
    document: { querySelector: () => null },
  };
  assert.doesNotThrow(() => createChatConsentSync(host)(GRANTED));
});
