import type { Metadata } from "next";
import { copy } from "@/copy";

export const metadata: Metadata = {
  title: `${copy.pricing.title} - Drone Depot`,
  description: copy.pricing.description,
};

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{copy.pricing.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.pricing.description}</p>
    </main>
  );
}
