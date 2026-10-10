import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Facebook, Mail, Check } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { SPRING } from '../../lib/motion';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || window.location.href;

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleShare = async () => {
    // Try native Web Share API first (mobile + some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // User cancelled or error — fall through to dropdown
      }
    }
    // Fallback: toggle dropdown
    setIsOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setIsOpen(false);
  };

  const handleX = () => {
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setIsOpen(false);
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Pozrite si: ${shareUrl}`)}`;
    setIsOpen(false);
  };

  const items = [
    {
      label: copied ? 'Skopírované!' : 'Kopírovať odkaz',
      icon: copied ? Check : Link2,
      onClick: handleCopyLink,
    },
    { label: 'Facebook', icon: Facebook, onClick: handleFacebook },
    { label: 'X / Twitter', icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ), onClick: handleX },
    { label: 'Email', icon: Mail, onClick: handleEmail },
  ];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleShare}
        aria-expanded={isOpen}
        className="os-press -my-2 flex min-h-[44px] items-center gap-2 text-xs font-medium uppercase tracking-widest text-brand-muted hover:text-brand-dark"
      >
        <Share2 size={14} aria-hidden="true" /> Zdieľať
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={SPRING}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-[10px] border border-brand-line bg-white py-1.5 shadow-[0_18px_40px_-20px_rgba(26,26,26,0.35)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  type="button"
                  className="flex min-h-[44px] w-full items-center gap-2.5 px-4 text-left text-sm text-brand-muted transition-colors hover:bg-brand-light hover:text-brand-dark active:bg-brand-sand"
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
