import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CHAT_CLOSE_EVENT, CHAT_OPEN_EVENT, chatOpenNow, watchChatWindow } from '../../lib/chatWindow';
import type { ChatWindowHost } from '../../lib/chatWindow';

// A window with the widget's events; `api` stands in for window.AIPredajca once widget.js has run.
function fakeHost(api?: ChatWindowHost['AIPredajca']) {
  const target = new EventTarget();
  const host: ChatWindowHost = {
    AIPredajca: api,
    addEventListener: (type, listener) => target.addEventListener(type, listener),
    removeEventListener: (type, listener) => target.removeEventListener(type, listener),
  };
  return { host, fire: (type: string) => target.dispatchEvent(new Event(type)) };
}

test('the widget names the same events (WIDGET_PAGE_EVENTS in the widget contract)', () => {
  assert.equal(CHAT_OPEN_EVENT, 'aipredajca:open');
  assert.equal(CHAT_CLOSE_EVENT, 'aipredajca:close');
});

test('reads the state: closed before widget.js, with an older widget or a failing one', () => {
  assert.equal(chatOpenNow(fakeHost().host), false);
  assert.equal(chatOpenNow(fakeHost({ setConsent: () => undefined }).host), false);
  assert.equal(chatOpenNow(fakeHost({ setConsent: () => undefined, isOpen: () => true }).host), true);
  const broken = {
    setConsent: () => undefined,
    isOpen: (): boolean => {
      throw new Error('widget');
    },
  };
  assert.equal(chatOpenNow(fakeHost(broken).host), false);
});

test('follows the open and close events until stopped', () => {
  const { host, fire } = fakeHost();
  const seen: boolean[] = [];
  const stop = watchChatWindow(host, (open) => seen.push(open));
  fire(CHAT_OPEN_EVENT);
  fire(CHAT_CLOSE_EVENT);
  stop();
  fire(CHAT_OPEN_EVENT);
  assert.deepEqual(seen, [true, false]);
});

test('the newsletter and discount pop-ups wait while the chat window is open', () => {
  for (const file of ['components/UI/NewsletterPopup.tsx', 'components/UI/DiscountPopup.tsx']) {
    const source = readFileSync(file, 'utf8');
    assert.match(source, /const isChatOpen = useAiChatOpen\(\);/, `${file}: useAiChatOpen`);
    assert.match(source, /const blocked = [^;]*\|\| isChatOpen\b/, `${file}: the open chat blocks the pop-up`);
  }
});
