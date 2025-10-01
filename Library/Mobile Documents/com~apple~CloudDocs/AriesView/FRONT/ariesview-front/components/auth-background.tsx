import React from 'react';

export default function AuthBackground() {
  return (
    <>
      {/* Professional gradient background for auth pages */}
      <div 
        className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full bg-gradient-to-b from-gray-50 to-white" 
        aria-hidden="true" 
      />
      
      {/* Subtle decorative elements */}
      <div 
        className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/2 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
          backgroundSize: '80% 80%',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div 
        className="pointer-events-none absolute left-0 bottom-0 -z-10 h-full w-1/2 opacity-10"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
          backgroundSize: '80% 80%',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </>
  );
} 