import Container from './Container';
import Button from './Button';

export default function Hero({
  eyebrow = 'Drone Depot',
  title,
  subtitle,
  primaryCta,
  secondaryCta
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { text: string; to: string };
  secondaryCta?: { text: string; to: string };
}) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <div className="py-14 sm:py-20">
          <p className="text-sm uppercase tracking-wide text-brand-700">{eyebrow}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{title}</h1>
          {subtitle && <p className="mt-4 text-lg text-slate-600">{subtitle}</p>}
          <div className="mt-6 flex gap-3">
            {primaryCta && <Button as="link" to={primaryCta.to}>{primaryCta.text}</Button>}
            {secondaryCta && (
              <Button as="link" to={secondaryCta.to} className="bg-slate-900 text-white">
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
