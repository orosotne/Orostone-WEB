import React from 'react';
import { m } from 'framer-motion';
import { useHasFinePointer } from '../../hooks/useIsMobile';

// Omit props whose handler signatures collide with framer-motion's
// own `onAnimation*` / `onDrag*` / `onTransitionEnd` overrides.
type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDrag'
  | 'onTransitionEnd'
>;

interface ButtonProps extends NativeButtonProps {
  variant?: 'primary' | 'outline' | 'ghost';
  /** Size preset (default = standard, lg = larger CTA-style padding/text) */
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  icon,
  ...props
}) => {
  const hasFinePointer = useHasFinePointer();

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'px-5 py-2.5 text-xs',
    default: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-base',
  };

  const baseClasses = `relative overflow-hidden font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 ${sizeClasses[size]}`;

  const variants = {
    primary: "bg-brand-dark text-white hover:bg-black border border-transparent hover:border-brand-gold/30",
    outline: "bg-transparent border border-gray-300 text-brand-dark hover:border-brand-gold hover:text-brand-gold",
    ghost: "bg-transparent text-brand-dark hover:text-brand-gold hover:bg-brand-gray/50"
  };

  return (
    <m.button
      whileHover={hasFinePointer ? { scale: 1.02 } : undefined}
      whileTap={hasFinePointer ? { scale: 0.98 } : undefined}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius-button)' }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <span className="text-brand-gold">{icon}</span>}
      </span>
    </m.button>
  );
};