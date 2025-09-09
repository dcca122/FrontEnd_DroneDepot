import Container from './Container';
import { ReactNode } from 'react';

export default function Section({
  title,
  subtitle,
  children
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        {title && <h2 className="text-2xl sm:text-3xl font-semibold mb-2">{title}</h2>}
        {subtitle && <p className="text-slate-600 mb-6">{subtitle}</p>}
        {children}
      </Container>
    </section>
  );
}
