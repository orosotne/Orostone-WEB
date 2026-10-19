// Passes the cookie choice to the AI predajca chat widget (the "AI asistent" window that
// index.html loads from ai-predajca…/widget.js). Without a call the widget runs without consent:
// no analytics events before the first message and no long-lived visitor id.

/** What the widget's `setConsent` accepts as an object. */
export interface ChatConsent {
  /** Analytics events about the visit before the first message (greeting shown, page view). */
  analytics: boolean;
  /** Recognising a returning visitor across conversations (long-lived visitor id). */
  preferences: boolean;
}

/** The public API of widget.js; it exists as soon as the script has run and replays early calls. */
export interface AIPredajcaApi {
  setConsent(consent: boolean | Partial<ChatConsent>): void;
  /** The chat window is open (lib/chatWindow.ts); missing in widget versions before October 2026. */
  isOpen?(): boolean;
}

declare global {
  interface Window {
    AIPredajca?: AIPredajcaApi;
  }
}

/** The widget's script tag in index.html. */
export const CHAT_WIDGET_SCRIPT = 'script[src*="ai-predajca"][src$="/widget.js"]';

/**
 * The web has no "functional" cookie category, so recognising a returning visitor in the chat
 * follows the analytics choice, the same as the chat's analytics events.
 */
export function chatConsentFromPreferences(preferences: { analytics: boolean }): ChatConsent {
  return { analytics: preferences.analytics, preferences: preferences.analytics };
}

interface ScriptLike {
  addEventListener(type: 'load', listener: () => void, options?: { once?: boolean }): void;
}

/** The parts of `window` the sync needs (a fake in tests). */
export interface ChatWidgetHost {
  AIPredajca?: AIPredajcaApi;
  document: { querySelector(selectors: string): ScriptLike | null };
}

function send(api: AIPredajcaApi, consent: ChatConsent): void {
  try {
    api.setConsent(consent);
  } catch {
    // A failing third-party widget must never break saving the cookie choice
  }
}

/**
 * Returns a function that hands a consent to the widget: right away once `window.AIPredajca`
 * exists, otherwise when the widget's script has loaded (it is `async`). While waiting, only the
 * latest choice is kept, and a single load listener is registered.
 */
export function createChatConsentSync(host: ChatWidgetHost): (consent: ChatConsent) => void {
  let pending: ChatConsent | null = null;
  let waiting = false;
  return (consent) => {
    if (host.AIPredajca) {
      pending = null;
      send(host.AIPredajca, consent);
      return;
    }
    pending = consent;
    if (waiting) return;
    const script = host.document.querySelector(CHAT_WIDGET_SCRIPT);
    if (!script) return;
    waiting = true;
    script.addEventListener(
      'load',
      () => {
        waiting = false;
        const latest = pending;
        pending = null;
        if (latest && host.AIPredajca) send(host.AIPredajca, latest);
      },
      { once: true },
    );
  };
}

let browserSync: ((consent: ChatConsent) => void) | null = null;

/** Hands the visitor's saved cookie choice to the chat widget in the browser. */
export function syncChatConsent(preferences: { analytics: boolean }): void {
  if (typeof window === 'undefined') return;
  browserSync ??= createChatConsentSync(window);
  browserSync(chatConsentFromPreferences(preferences));
}
