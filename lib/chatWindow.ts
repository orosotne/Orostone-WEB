// Whether the AI predajca chat window (widget.js from index.html) is open. The widget dispatches an event on window
// when it opens and when it closes, and window.AIPredajca.isOpen() tells the state before the first one. The site's
// own pop-ups (newsletter, discount) wait while it is open: on a phone it fills the screen, and a dialog opening
// underneath would take the focus (and the keyboard) from typing in it.
import type { AIPredajcaApi } from './chatConsent';

export const CHAT_OPEN_EVENT = 'aipredajca:open';
export const CHAT_CLOSE_EVENT = 'aipredajca:close';

/** The parts of `window` the watch needs (a fake in tests). */
export interface ChatWindowHost {
  AIPredajca?: AIPredajcaApi;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

/** The chat window is open now; false before widget.js has run and with a widget that cannot tell. */
export function chatOpenNow(host: ChatWindowHost): boolean {
  try {
    return host.AIPredajca?.isOpen?.() === true;
  } catch {
    // A failing third-party widget must never block the site
    return false;
  }
}

/** Calls `onChange` with the chat window's state each time it opens or closes. Returns the function that stops it. */
export function watchChatWindow(host: ChatWindowHost, onChange: (open: boolean) => void): () => void {
  const onOpen = () => onChange(true);
  const onClose = () => onChange(false);
  host.addEventListener(CHAT_OPEN_EVENT, onOpen);
  host.addEventListener(CHAT_CLOSE_EVENT, onClose);
  return () => {
    host.removeEventListener(CHAT_OPEN_EVENT, onOpen);
    host.removeEventListener(CHAT_CLOSE_EVENT, onClose);
  };
}
