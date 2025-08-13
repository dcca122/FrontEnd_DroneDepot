import type { Metadata } from "next";
import { copy } from "@/copy";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `${copy.inspections.title} - Drone Depot`,
  description: copy.inspections.description,
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.inspections.title,
    description: copy.inspections.description,
    provider: { '@type': 'Organization', name: 'Drone Depot' }
  };
  return (
    <main className="p-8">
      <JsonLd json={jsonLd} />
      <h1 className="text-4xl font-bold">{copy.inspections.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.inspections.description}</p>
    </main>
  );
}
