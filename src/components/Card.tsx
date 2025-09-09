import { ReactNode } from 'react';

export default function Card({
  title,
  children,
  footer
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="prose max-w-none">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
