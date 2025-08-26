import CTA from "~/components/sections/cta";
import FAQ from "~/components/sections/faq";
import Features from "~/components/sections/features";
import Hero from "~/components/sections/hero";
import Pricing from "~/components/sections/pricing";
import Testimonials from "~/components/sections/testimonials";

export default async function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-muted/20 to-background overflow-x-hidden">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
