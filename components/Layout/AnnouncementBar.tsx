import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnnouncementBarProps {
  message?: string;
  highlightText?: string;
  linkText?: string;
  linkTo?: string;
  dismissible?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = "Objavte našu kolekciu luxusných povrchov",
  highlightText = "Elegancia a kvalita v každom detaile",
  linkText,
  linkTo,
  dismissible = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-gold text-brand-dark relative z-[60]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center py-2.5 text-sm">
          <p className="text-center">
            {message}
            {highlightText && (
              <>
                {' – '}
                <strong className="font-semibold">{highlightText}</strong>
              </>
            )}
            {linkText && linkTo && (
              <Link 
                to={linkTo} 
                className="ml-2 underline underline-offset-2 hover:no-underline font-medium"
              >
                {linkText} →
              </Link>
            )}
          </p>
          
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Zavrieť oznámenie"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
