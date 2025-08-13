"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

interface Props {
  video: string;
  headline: string;
  bullets: string[];
  cta: { label: string; href: string };
}

export default function ScrollCinema({ video, headline, bullets, cta }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return (
    <section ref={ref} className="relative h-[200vh]">
      <video
        src={video}
        className="sticky top-0 h-screen w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <motion.div
        style={{ opacity }}
        className="absolute right-0 top-1/2 w-full max-w-md -translate-y-1/2 bg-black/60 p-6 text-white"
      >
        <h2 className="text-2xl font-bold">{headline}</h2>
        <ul className="mt-2 list-disc pl-4">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <Link href={cta.href} className="mt-4 inline-block rounded bg-white px-4 py-2 text-black">
          {cta.label}
        </Link>
      </motion.div>
    </section>
  );
}
