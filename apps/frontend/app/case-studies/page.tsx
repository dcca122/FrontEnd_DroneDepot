import type { Metadata } from "next";
import { copy } from "@/copy";

export const metadata: Metadata = {
  title: `${copy.caseStudies.title} - Drone Depot`,
  description: copy.caseStudies.description,
};

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{copy.caseStudies.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.caseStudies.description}</p>
    </main>
  );
}
