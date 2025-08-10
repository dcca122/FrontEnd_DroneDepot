"use client";

import { useEffect, useRef, useState } from "react";

interface SectionReelProps {
  bgImage?: string;
  heading?: string;
  subheading?: string;
}

export default function SectionReel({ bgImage, heading, subheading }: SectionReelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handleScroll = () => {
      if (!prefersReduced) {
        const offset = window.scrollY * 0.3;
        node.style.backgroundPositionY = `${-offset}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section
      ref={ref}
      className={`relative flex h-screen items-end justify-start bg-cover bg-center text-white transition-opacity ${
        prefersReduced ? "" : "duration-700"
      } ${visible ? "opacity-100" : "opacity-0"}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {!bgImage && <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />}
      <div className="relative z-10 p-8">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        {subheading && <p className="mt-2 text-lg">{subheading}</p>}
      </div>
    </section>
  );
}
