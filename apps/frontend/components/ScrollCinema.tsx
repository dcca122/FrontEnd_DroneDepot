"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";

interface Props {
  video: string;
  poster: string;
  headline: string;
  bullets: string[];
  cta: { label: string; href: string };
}

export default function ScrollCinema({ video, poster, headline, bullets, cta }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlay, setShowPlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (inView) setShouldLoad(true);
  }, [inView]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (shouldLoad && !prefersReducedMotion) {
      const v = videoRef.current;
      if (v) {
        const p = v.play();
        if (p !== undefined) {
          p.catch(() => setShowPlay(true));
        }
      }
    } else if (prefersReducedMotion) {
      setShowPlay(true);
    }
  }, [shouldLoad, prefersReducedMotion]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const shouldAnimateCTA = !prefersReducedMotion && !isMobile;
  const posterSrc = poster || "/video/hero-poster.jpg";

  const handlePlay = async () => {
    const v = videoRef.current;
    if (v) {
      await v.play();
      setShowPlay(false);
    }
  };

  return (
    <section ref={ref} className="relative max-md:space-y-4 md:h-[200vh]">
      <div
        data-testid="video-wrapper"
        aria-label={headline}
        className="md:sticky md:top-0"
      >
        {shouldLoad ? (
          <video
            ref={videoRef}
            poster={posterSrc}
            preload="none"
            playsInline
            muted
            loop
            autoPlay={!prefersReducedMotion}
            className={`h-screen w-full object-cover ${
              !prefersReducedMotion
                ? isLoaded
                  ? "opacity-100"
                  : "opacity-0 transition-opacity duration-500"
                : ""
            }`}
            onLoadedData={() => setIsLoaded(true)}
          >
            <source src={video} />
          </video>
        ) : (
          <img src={posterSrc} alt="" className="h-screen w-full object-cover" />
        )}
        {showPlay && (
          <button
            onClick={handlePlay}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-black/70 px-4 py-2 text-white"
          >
            Tap to play
          </button>
        )}
      </div>
      <motion.div
        data-testid="cta-panel"
        style={shouldAnimateCTA ? { opacity } : undefined}
        initial={shouldAnimateCTA ? undefined : { opacity: 1 }}
        animate={shouldAnimateCTA ? undefined : { opacity: 1 }}
        className="bg-black/60 p-6 text-white md:absolute md:right-0 md:top-1/2 md:w-full md:max-w-md md:-translate-y-1/2"
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
