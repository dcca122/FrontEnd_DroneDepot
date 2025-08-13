import Link from "next/link";
import type { Metadata } from "next";
import { copy } from "@/copy";

export const metadata: Metadata = {
  title: `${copy.services.title} - Drone Depot`,
  description: copy.services.description,
};

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{copy.services.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.services.description}</p>
      <ul className="mt-6 list-disc pl-6">
        <li><Link href="/services/inspections">Inspections</Link></li>
        <li><Link href="/services/mapping">Mapping</Link></li>
        <li><Link href="/services/fpv">FPV</Link></li>
        <li><Link href="/services/construction-progress">Construction Progress</Link></li>
      </ul>
    </main>
  );
}
