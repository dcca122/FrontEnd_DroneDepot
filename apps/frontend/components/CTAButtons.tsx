"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface CTAButtonsProps {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export default function CTAButtons({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CTAButtonsProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        } else {
          controls.start("hidden");
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [controls]);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
    >
      <a
        href={primaryHref}
        className="rounded bg-brand-purple px-6 py-3 text-white transition-colors hover:bg-brand-purple/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
      >
        {primaryLabel}
      </a>
      <a
        href={secondaryHref}
        className="rounded border border-white/70 px-6 py-3 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {secondaryLabel}
      </a>
    </motion.div>
  );
}
