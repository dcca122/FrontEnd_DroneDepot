import ScrollCinemaList from "@/components/ScrollCinemaList";
import JsonLd from "@/components/JsonLd";

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
      <ScrollCinemaList />
    </main>
  );
}
