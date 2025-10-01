"use client";

import { useEffect } from "react";
import Header from "@/components/ui/header";
import PageBackground from "@/components/page-background";

export default function PrivateEquityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.init({
        once: true,
        disable: "phone",
        duration: 500,
        easing: "ease-out-sine",
      });
    });
  }, []);

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