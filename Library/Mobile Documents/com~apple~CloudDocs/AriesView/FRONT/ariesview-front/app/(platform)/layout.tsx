"use client";

import '@/app/globals.css'
import '@/app/css/style.css'
import { Inter } from "next/font/google";
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config';
import { useEffect } from 'react';


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();

  const handleSignOut = () => {
    // Navigate to the home page
    router.push('/');
  };

  useEffect(() => {
    auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        console.log("*********** Token refreshed ***********", token);
        localStorage.setItem("authToken", token);
      }
    });
  }, []);

  return (
    <div className={`${inter.variable} font-inter min-h-screen flex flex-col bg-gray-50`}>
      {/* Platform Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image
                  src="/ariesview-logo.svg"
                  alt="AriesView Logo"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  title="Sign Out"
                  suppressHydrationWarning
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <main className="flex-grow flex">
        {children}
      </main>
      
      {/* Platform Footer */}
      <footer className="bg-white border-t border-gray-200 py-3">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} AriesView. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 