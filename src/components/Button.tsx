import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = ComponentProps<'button'> & { as?: 'button' | 'a' | 'link'; to?: string; href?: string };

export default function Button({ as = 'button', to, href, className = '', ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90';
  const primary = 'bg-brand-600 text-white';
  const classes = `${base} ${primary} ${className}`;

  if (as === 'a' && href) return <a className={classes} href={href} {...rest} />;
  if (as === 'link' && to) return <Link className={classes} to={to} {...(rest as any)} />;
  return <button className={classes} {...rest} />;
}
