import HeroVideo from "@/components/HeroVideo";
import CTAButtons from "@/components/CTAButtons";
import SectionReel from "@/components/SectionReel";
import ValueProps from "@/components/ValueProps";

export default function Home() {
  return (
    <main>
      <section id="hero">
        <HeroVideo src="/video/hero.mp4" overlayClassName="bg-gradient-to-b from-black/70 to-black/20">
          <div className="px-4 text-white">
            <h1 className="text-4xl font-bold sm:text-6xl">Professional Drone Services Made Simple</h1>
            <p className="mt-4 text-lg sm:text-2xl">FAA-certified pilots. Transparent pricing. 48-hour delivery.</p>
            <CTAButtons
              primaryLabel="Get Started"
              primaryHref="/contact"
              secondaryLabel="Work with Concierge"
              secondaryHref="/concierge"
            />
            <a
              href="#reel"
              aria-label="Scroll to next section"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-3xl text-white motion-safe:animate-bounce"
            >
              ↓
            </a>
          </div>
        </HeroVideo>
      </section>

      <section id="reel">
        <SectionReel bgImage="/images/reel-cover-1.jpg" subheading="Real Estate • Construction • Marketing" />
      </section>

      <ValueProps
        items={[
          { icon: "/icons/pilot.svg", title: "FAA Certified Pilots" },
          { icon: "/icons/pricing.svg", title: "Transparent Pricing" },
          { icon: "/icons/coverage.svg", title: "SoCal Coverage" },
          { icon: "/icons/clock.svg", title: "48-Hour Delivery" },
        ]}
      />

      <section className="bg-brand-purple py-6 text-center text-white">
        <p className="mb-2 text-xl">Ready to fly?</p>
        <a
          href="/contact"
          className="rounded bg-white px-4 py-2 font-semibold text-brand-purple hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Request Access
        </a>
      </section>
    </main>
  );
}
