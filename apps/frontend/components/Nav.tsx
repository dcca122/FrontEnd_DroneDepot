"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const buyerEnv = process.env.NEXT_PUBLIC_DRONEREGION_URL;

export default function Nav() {
  const params = useSearchParams();
  const utms = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => params.get(k) ? `${k}=${params.get(k)}` : null)
    .filter(Boolean)
    .join("&");
  const buyersGuide = buyerEnv ? `${buyerEnv}/buyers-guide${utms ? `?${utms}` : ""}` : null;
  return (
    <nav className="flex flex-wrap items-center gap-4">
      <Link href="/">Home</Link>
      <Link href="/how-it-works">How It Works</Link>
      <Link href="/services">Services</Link>
      <Link href="/rfp">RFP Desk</Link>
      <Link href="/concierge">Concierge</Link>
      <Link href="/case-studies">Case Studies</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href="/faq">FAQ</Link>
      <Link href="/contact">Contact</Link>
      {buyersGuide && (
        <a href={buyersGuide} target="_blank" rel="noopener" className="text-blue-600 underline">
          Buyer’s Guide
        </a>
      )}
    </nav>
  );
}
