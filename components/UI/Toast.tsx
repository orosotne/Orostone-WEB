import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCartActions, useCartState, useCartUI } from '../../context/CartContext';
import { SPRING } from '../../lib/motion';

interface ToastProps {
  /** null hides the toast */
  message: string | null;
  onClose: () => void;
  /** Hides itself after this many ms (0 = stays until closed) */
  autoHideMs?: number;
}

/**
 * Error message that drops in under the header, where it is seen without covering the page's own buttons.
 * Same surface as the cart drawer's error banner.
 */
export const Toast: React.FC<ToastProps> = ({ message, onClose, autoHideMs = 7000 }) => {
  useEffect(() => {
    if (!message || !autoHideMs) return;
    const t = window.setTimeout(onClose, autoHideMs);
    return () => window.clearTimeout(t);
  }, [message, autoHideMs, onClose]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(64px+env(safe-area-inset-top,0px)+12px)] z-[90] flex justify-center px-4 lg:top-[92px]">
      <AnimatePresence>
        {message && (
          <m.div
            key={message}
            role="alert"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={SPRING}
            className="pointer-events-auto flex w-full max-w-md items-start gap-2 rounded-[10px] border border-[#B42318]/25 bg-[#FEF3F2] py-2 pl-4 pr-1 text-[#B42318] shadow-[0_18px_40px_-20px_rgba(26,26,26,0.35)]"
          >
            <p className="flex-1 py-2 text-[0.88rem] font-normal leading-snug">{message}</p>
            <button
              type="button"
              onClick={onClose}
              className="os-press grid h-10 w-10 flex-none place-items-center rounded-full text-[#B42318]/70 hover:text-[#B42318]"
              aria-label="Zavrieť správu"
            >
              <X size={16} />
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** A failed cart action shows here while the drawer is closed (e.g. „Do košíka" on the catalog); in the open drawer it is a banner. */
export const CartErrorToast: React.FC = () => {
  const { error } = useCartState();
  const { clearError } = useCartActions();
  const { isOpen } = useCartUI();
  return <Toast message={isOpen ? null : error} onClose={clearError} />;
};
