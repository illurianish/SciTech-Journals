"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/header";
import AosProvider from "@/components/aos-provider";
import ClientLayout from "@/components/client-layout";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Only check for dashboard pages for header
  const isDashboardPage = pathname?.includes('dashboard');
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardPage && <Header />}
      <main className={`flex-grow ${!isDashboardPage ? 'pt-24 md:pt-28' : ''}`}>
        <AosProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AosProvider>
      </main>
      {/* Completely remove footer from layout */}
    </div>
  );
} 