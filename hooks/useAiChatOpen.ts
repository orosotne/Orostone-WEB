import { useEffect, useState } from 'react';
import { chatOpenNow, watchChatWindow } from '../lib/chatWindow';

/** The AI predajca chat window is open (lib/chatWindow.ts). False on the server and until widget.js has run. */
export function useAiChatOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(chatOpenNow(window));
    return watchChatWindow(window, setOpen);
  }, []);
  return open;
}
