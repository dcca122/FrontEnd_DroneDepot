import Script from "next/script";
interface Props { json: any }
export default function JsonLd({ json }: Props) {
  return (
    <Script
      type="application/ld+json"
      id={JSON.stringify(json).substring(0, 8)}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
