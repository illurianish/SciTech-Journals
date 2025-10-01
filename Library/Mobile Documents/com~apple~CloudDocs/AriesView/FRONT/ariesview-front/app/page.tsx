"use client";

import Hero from "@/components/hero-home";
import Cta from "@/components/cta";
import RealEstateSections from "@/components/real-estate-sections";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export default function Home() {
  return (
    <div className="pt-6 md:pt-8">
      <Hero />
      <RealEstateSections />
      <Cta />
      {/* Custom home page footer wrapper - to prevent duplication */}
      <div id="unique-home-footer-wrapper" className="block">
        {/* Remove the second footer through CSS */}
        <style jsx global>{`
          footer:nth-of-type(2) {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  );
} 