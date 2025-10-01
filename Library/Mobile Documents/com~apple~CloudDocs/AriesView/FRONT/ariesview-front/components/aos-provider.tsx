'use client';

import { useEffect, useState } from 'react';
// Remove the direct import
// import AOS from 'aos';

export default function AosProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Use a state to track if we're on the client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark that we're mounted on the client
    setIsMounted(true);

    // Use dynamic import for AOS to avoid SSR issues
    import('aos').then((AOS) => {
      AOS.init({
        once: true,
        disable: 'phone',
        duration: 600,
        easing: 'ease-out-sine',
      });
    });
  }, []);

  // Return children wrapped in a div with suppressHydrationWarning
  return <div suppressHydrationWarning>{children}</div>;
} 