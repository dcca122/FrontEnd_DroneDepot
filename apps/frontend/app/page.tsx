import ScrollCinema from "@/components/ScrollCinema";
import JsonLd from "@/components/JsonLd";

const sections = [
  {
    video: "/video/hero.mp4",
    poster: "/video/hero-poster.jpg", // TODO: replace with inspections poster
    headline: "Inspections",
    bullets: ["FAA pilots", "Detailed reporting"],
    cta: { label: "Learn More", href: "/services/inspections" },
  },
  {
    video: "/video/hero.mp4",
    poster: "/video/hero-poster.jpg", // TODO: replace with mapping poster
    headline: "Mapping",
    bullets: ["2D/3D outputs", "Fast turnaround"],
    cta: { label: "Explore Mapping", href: "/services/mapping" },
  },
  {
    video: "/video/hero.mp4",
    poster: "/video/hero-poster.jpg", // TODO: replace with FPV poster
    headline: "FPV",
    bullets: ["Dynamic footage", "Pro pilots"],
    cta: { label: "See FPV", href: "/services/fpv" },
  },
];

export default function Home() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Drone Depot",
    url: process.env.NEXT_PUBLIC_SITE_URL,
  };
  const web = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <main>
      <JsonLd json={org} />
      <JsonLd json={web} />
      {sections.map((s, i) => (
        <ScrollCinema key={i} {...s} />
      ))}
    </main>
  );
}
