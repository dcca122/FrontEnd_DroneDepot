import type { Metadata } from "next";
import { copy } from "@/copy";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `${copy.fpv.title} - Drone Depot`,
  description: copy.fpv.description,
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.fpv.title,
    description: copy.fpv.description,
    provider: { '@type': 'Organization', name: 'Drone Depot' },
  };
  return (
    <main className="p-8">
      <JsonLd json={jsonLd} />
      <h1 className="text-4xl font-bold">{copy.fpv.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.fpv.description}</p>
    </main>
  );
}
