"use client";

import { useState } from "react";

interface HeroVideoProps {
  src: string;
  poster?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export default function HeroVideo({ src, poster, overlayClassName, children }: HeroVideoProps) {
  const [error, setError] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {!error ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
      )}
      <div className={"absolute inset-0 " + (overlayClassName ?? "")} />
      <div className="relative z-10 flex h-full w-full items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
