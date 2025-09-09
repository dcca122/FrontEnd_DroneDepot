import Button from './Button';

export default function CtaPanel({
  heading,
  lead,
  ctaText,
  ctaTo
}: {
  heading: string;
  lead?: string;
  ctaText: string;
  ctaTo: string;
}) {
  return (
    <div className="rounded-xl bg-brand-600 text-white p-6 sm:p-8 shadow">
      <h3 className="text-2xl font-semibold">{heading}</h3>
      {lead && <p className="mt-2 opacity-90">{lead}</p>}
      <div className="mt-4">
        <Button as="link" to={ctaTo} className="bg-white text-brand-700 hover:opacity-100">
          {ctaText}
        </Button>
      </div>
    </div>
  );
}
