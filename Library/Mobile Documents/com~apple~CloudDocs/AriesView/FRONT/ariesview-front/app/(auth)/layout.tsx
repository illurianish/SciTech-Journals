"use client";

import "@/app/css/style.css";
import { Inter } from "next/font/google";
import "aos/dist/aos.css";
import AosProvider from "@/components/aos-provider";
import AuthBackground from '@/components/auth-background'
import '@/app/globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-inter flex flex-col min-h-screen bg-gray-50`}>
      <AuthBackground />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AriesView. All rights reserved.</p>
      </footer>
    </div>
  );
}
