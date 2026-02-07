import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  icon,
  ...props
}) => {
  const baseClasses = "relative overflow-hidden px-8 py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3";

  const variants = {
    primary: "bg-brand-dark text-white hover:bg-black border border-transparent hover:border-brand-gold/30",
    outline: "bg-transparent border border-gray-300 text-brand-dark hover:border-brand-gold hover:text-brand-gold",
    ghost: "bg-transparent text-brand-dark hover:text-brand-gold hover:bg-brand-gray/50"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius-button)' }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <span className="text-brand-gold">{icon}</span>}
      </span>
    </motion.button>
  );
};