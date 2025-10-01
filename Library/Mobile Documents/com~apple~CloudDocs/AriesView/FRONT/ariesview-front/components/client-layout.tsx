"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardPage = pathname?.includes('dashboard');
  const isAuthPage = pathname?.includes('signin') || pathname?.includes('signup');
  const isPlatformPage = pathname?.startsWith('/operations-dashboard') || pathname?.startsWith('/alerts-dashboard');
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      {!isPlatformPage && <Header />}
      <main className="grow">
        {children}
      </main>
      {!isDashboardPage && !isAuthPage && <Footer />}
    </div>
  );
} 