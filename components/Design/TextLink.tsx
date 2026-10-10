import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from './ArrowIcon';
import { isPlainHref, newTabProps } from './href';

interface TextLinkProps {
  /** Internal path ("/vzorky"), #anchor, or absolute URL / tel: / mailto:. */
  to: string;
  children: React.ReactNode;
  arrow?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/** CTA level 3: underlined text link with an arrow. On touch screens the hit area grows to 44 px. */
export const TextLink: React.FC<TextLinkProps> = ({ to, children, arrow = true, className = '', onClick }) => {
  const cls = `inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-70 active:opacity-50 active:duration-75 [@media(pointer:coarse)]:-my-2.5 [@media(pointer:coarse)]:py-2.5 ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );
  if (isPlainHref(to)) {
    return <a href={to} className={cls} onClick={onClick} {...newTabProps(to)}>{content}</a>;
  }
  return <Link to={to} className={cls} onClick={onClick}>{content}</Link>;
};
