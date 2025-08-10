"use client";

import { useState } from "react";

interface Item {
  icon: string;
  title: string;
}

interface ValuePropsProps {
  items: Item[];
}

function ValueCard({ icon, title }: Item) {
  const [missing, setMissing] = useState(false);
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-4 h-12 w-12">
        {!missing ? (
          <img
            src={icon}
            alt=""
            className="h-full w-full"
            onError={() => setMissing(true)}
          />
        ) : (
          <div className="h-full w-full rounded bg-gray-300" />
        )}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}

export default function ValueProps({ items }: ValuePropsProps) {
  return (
    <section className="bg-neutral-bg py-16">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ValueCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
