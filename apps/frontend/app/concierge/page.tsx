import type { Metadata } from "next";
import { copy } from "@/copy";

export const metadata: Metadata = {
  title: `${copy.concierge.title} - Drone Depot`,
  description: copy.concierge.description,
};

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">{copy.concierge.title}</h1>
      <p className="mt-4 max-w-2xl">{copy.concierge.description}</p>
    </main>
  );
}
