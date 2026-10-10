import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from './ArrowIcon';
import { isPlainHref, newTabProps } from './href';

export type ActionButtonVariant = 'gold' | 'dark' | 'outline' | 'light-outline';

// CTA levels: 1 gold (only header, gold band, mobile bar) · 2 dark · 3 TextLink
const VARIANT_CLASSES: Record<ActionButtonVariant, string> = {
  gold: 'bg-brand-gold text-brand-dark hover:bg-brand-gold-hover',
  dark: 'bg-brand-dark text-brand-light hover:bg-[#333331]',
  outline: 'border border-brand-dark text-brand-dark hover:bg-brand-dark/5',
  'light-outline': 'border border-brand-light/70 text-brand-light hover:bg-brand-light/15',
};

const SIZE_CLASSES = {
  md: 'min-h-[54px] px-[26px] text-[0.78rem]',
  sm: 'min-h-[42px] px-[18px] text-[0.7rem]',
} as const;

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: ActionButtonVariant;
  size?: keyof typeof SIZE_CLASSES;
  /** Internal path, #anchor, or absolute URL / tel: / mailto:. Without it the component renders a <button>. */
  to?: string;
  arrow?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'dark',
  size = 'md',
  to,
  arrow = false,
  type = 'button',
  disabled,
  onClick,
  className = '',
}) => {
  const cls = `os-press inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-[10px] font-bold uppercase leading-none tracking-[0.12em] no-underline disabled:cursor-not-allowed disabled:opacity-50 ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon className="h-4 w-4" />}
    </>
  );
  if (to && isPlainHref(to)) {
    return <a href={to} className={cls} onClick={onClick} {...newTabProps(to)}>{content}</a>;
  }
  if (to) return <Link to={to} className={cls} onClick={onClick}>{content}</Link>;
  return <button type={type} disabled={disabled} className={cls} onClick={onClick}>{content}</button>;
};
