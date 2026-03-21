import { useState } from 'react';

export function useHoneypot() {
  const [honeypotValue, setHoneypotValue] = useState('');
  const isBot = honeypotValue !== '';
  return { honeypotValue, setHoneypotValue, isBot };
}
