import { useRef, useState } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { getSupabase } from '@/lib/supabase';

export function useTurnstile() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // Lazy-load Supabase SDK on first verify (not on form mount).
      const supabase = await getSupabase();
      const { data, error } = await supabase.functions.invoke('verify-turnstile', {
        body: { token },
      });
      if (error || !data?.success) return false;
      return true;
    } catch {
      return false;
    }
  };

  const reset = () => {
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  };

  return { turnstileRef, turnstileToken, setTurnstileToken, verifyToken, reset };
}
