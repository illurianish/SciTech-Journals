"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/ui/header";
import PageBackground from "@/components/page-background";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <>
      <Header />
      <main className="grow relative overflow-hidden">
        <PageBackground />
        {children}
      </main>
    </>
  );
} 