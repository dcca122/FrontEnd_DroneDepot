"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const crossDomain = process.env.NEXT_PUBLIC_DRONEREGION_URL
  ? new URL(process.env.NEXT_PUBLIC_DRONEREGION_URL).hostname
  : null;

export default function Analytics() {
  const [consent, setConsent] = useState(false);
  useEffect(() => {
    setConsent(localStorage.getItem("dd-consent") === "true");
  }, []);
  const accept = () => {
    localStorage.setItem("dd-consent", "true");
    setConsent(true);
  };
  if (!gaId) return null;
  return (
    <>
      {!consent && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-black p-4 text-white">
          <span>We use cookies for analytics.</span>
          <button className="underline" onClick={accept}>
            Accept
          </button>
        </div>
      )}
      {consent && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <Script id="ga-init">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                ${crossDomain ? `linker: { domains: ['${crossDomain}'] },` : ""}
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
