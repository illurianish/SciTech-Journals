'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import Image from 'next/image'

export default function OperationsDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close mobile sidebar when path changes
  useEffect(() => {
    setShowMobileSidebar(false);
  }, [pathname]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Generate breadcrumbs based on path
  const generateBreadcrumbs = () => {
    if (!pathname) return [];
    
    const segments = pathname.split('/').filter(Boolean);
    let path = '';
    
    return segments.map((segment, index) => {
      path += `/${segment}`;
      
      // Format the segment for display (replace hyphens with spaces, capitalize)
      const formattedName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        name: formattedName,
        path,
        isLast: index === segments.length - 1
      };
    });
  };
  
  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Fixed Sidebar - hidden on mobile, shown on desktop */}
      <div className={`hidden md:block ${sidebarCollapsed ? 'w-0' : 'w-64'} transition-all duration-300`}>
        {!sidebarCollapsed && (
          <Sidebar 
            currentPath={pathname} 
            onToggleSidebar={toggleSidebar}
            isCollapsed={sidebarCollapsed}
          />
        )}
      </div>
      
      {/* Floating toggle button - only visible when sidebar is collapsed */}
      {sidebarCollapsed && (
        <div className="hidden md:flex fixed left-0 top-20 bottom-0 items-center z-40">
          <button
            type="button"
            className="bg-[#0f172a] text-gray-300 hover:text-white p-3 rounded-r-md shadow-lg focus:outline-none transition-colors"
            onClick={toggleSidebar}
            aria-label="Show sidebar"
            title="Show Sidebar"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Mobile sidebar - shown when menu button is clicked */}
      {showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={() => setShowMobileSidebar(false)}></div>
          <div className="relative flex-1 flex flex-col w-64 max-w-xs bg-[#0f172a]">
            <Sidebar 
              currentPath={pathname}
              onToggleSidebar={toggleSidebar}
              isCollapsed={sidebarCollapsed}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 overflow-hidden w-full ${!sidebarCollapsed ? 'md:pl-4' : ''}`}>
        {/* Mobile menu button - only visible on mobile */}
        <div className="md:hidden bg-white py-2 px-4">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setShowMobileSidebar(true)}
            aria-label="Open main menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="py-4 px-2 max-w-full h-full">
            {/* Add title and description here for consistent spacing */}
            {pathname === '/operations-dashboard' && (
              <header className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
                <p className="text-gray-600">Comprehensive overview of your property portfolio</p>
              </header>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 