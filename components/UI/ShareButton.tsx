import React, { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Facebook, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  title: string;
  url?: string;
  variant?: 'dark' | 'gold';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  url,
  variant = 'dark',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const shareUrl = url || window.location.href;

  const hoverColor = variant === 'gold' ? 'hover:text-brand-gold' : 'hover:text-brand-dark';

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
        onClick={handleShare}
        className={`text-xs text-gray-400 ${hoverColor} uppercase tracking-widest flex items-center gap-2 transition-colors`}
      >
        <Share2 size={14} /> Zdieľať
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-50 min-w-[180px]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
