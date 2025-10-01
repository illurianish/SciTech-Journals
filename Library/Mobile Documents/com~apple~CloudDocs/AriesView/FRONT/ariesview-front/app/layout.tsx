import "./css/style.css";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutContent from "@/components/layout-content";
import { homeMetadata } from "./home-meta";
import type { Metadata } from "next";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import Providers from '@/components/Providers';

// Use Inter font from Google Fonts with variable support
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AriesView",
  description: "AriesView Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <title>{homeMetadata.title}</title>
        <meta name="description" content={homeMetadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Add preload for critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Add AOS CSS dynamically with link tag */}
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        
        {/* Add Font Awesome for icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body
        className={`${inter.variable} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased`}
        suppressHydrationWarning
      >
        {/* Google Analytics Tracking */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PPDL19MB6Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PPDL19MB6Z');
          `}
        </Script>
        
        <Toaster position="top-right" />
        
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
