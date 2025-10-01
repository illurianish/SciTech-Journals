export const metadata = {
  title: "AriesView - Real Estate Investment Analytics Platform",
  description: "Powerful analytics tools for real estate investors, asset managers, and property owners",
};

import Hero from "@/components/hero-home";
import LargeTestimonial from "@/components/large-testimonial";
import Cta from "@/components/cta";
import RealEstateSections from "@/components/real-estate-sections";

export default function Home() {
  return (
    <>
      <Hero />
      <RealEstateSections />
      <LargeTestimonial />
      <Cta />
    </>
  );
}
