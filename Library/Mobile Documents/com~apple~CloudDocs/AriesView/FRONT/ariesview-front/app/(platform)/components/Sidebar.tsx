'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, ReactNode } from 'react'
import { useAuth } from '@/app/context/AuthContext'

// Add custom scrollbar styles
const scrollbarStyles = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #1F2937;
  }
  ::-webkit-scrollbar-thumb {
    background: #4B5563;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
`;

interface SidebarProps {
  currentPath?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onDashboardClick?: () => void;
  onToggleSidebar?: () => void;
  isCollapsed?: boolean;
}

// Define interfaces for navigation items
interface BaseItemProps {
  path: string;
}

interface NamedItem extends BaseItemProps {
  name: string;
  icon?: ReactNode;
}

interface TitledItem extends BaseItemProps {
  title: string;
  icon?: ReactNode;
}

type NavItem = NamedItem | TitledItem;

interface NavSection {
  section: string;
  color: string;
  path: string;
  icon: ReactNode;
  items: NavItem[];
}

// Helper function to get first name
const getFirstName = (displayName: string | null | undefined) => {
  if (!displayName) return '';
  return displayName.split(' ')[0]; // Return just the first name
};

export default function Sidebar({ 
  currentPath,
  onProfileClick, 
  onSettingsClick,
  onDashboardClick,
  onToggleSidebar,
  isCollapsed
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [systemExpanded, setSystemExpanded] = useState(false);
  const { user } = useAuth();
  
  // Use provided currentPath or the actual pathname
  const activePath = currentPath || pathname;
  
  // Initialize expanded sections based on active path
  const getInitialExpandedSections = () => {
    const sections = {
      home: false,
      properties: false,
      ariesviewdashboards: false,
      benchmarkcenter: false,
      systemsupport: false
    };
    
    if (activePath?.includes('/dashboard')) {
      sections.ariesviewdashboards = true;
    } else if (activePath?.includes('/properties')) {
      sections.properties = true;
    } else if (activePath?.includes('/benchmark')) {
      sections.benchmarkcenter = true;
    }
    
    return sections;
  };
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(getInitialExpandedSections);

  // Update expanded sections when path changes
  useEffect(() => {
    setExpandedSections(getInitialExpandedSections());
  }, [activePath]);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if a path is active
  const isActive = (path: string) => {
    return activePath === path || activePath?.startsWith(path + '/');
  };

  const handleSignOut = () => {
    router.push('/');
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/operations-dashboard/user-settings');
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      router.push('/operations-dashboard/user-settings');
    }
  };

  const handleDashboardClick = () => {
    if (onDashboardClick) {
      onDashboardClick();
    } else {
      router.push('/operations-dashboard');
    }
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  // Navigation data structure
  const navigation: NavSection[] = [
    {
      section: 'Home Page',
      color: '#64B5F6',
      path: '/operations-dashboard/home',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      items: []
    },
    {
      section: 'Asset Management',
      color: '#ffcccc',
      path: '/operations-dashboard/asset-management',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      items: [
        { name: 'Properties', path: '/operations-dashboard/properties/property-overview' },
        // { name: 'Financial Hub', path: '/operations-dashboard/properties/financial-hub' },
        { name: 'AriesView Dashboard', path: '/operations-dashboard/dashboards' }
      ]
    },
    {
      section: 'Acquisition Screening',
      color: '#FFD580',
      path: '/operations-dashboard/acquisition-screening',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      items: [
        { name: 'Deal Screen', path: '/operations-dashboard/acquisition-screening/deal-screen' }
      ]
    }
  ];

  // System links
  const systemLinks = [
    { 
      name: 'User Settings', 
      path: '/operations-dashboard/user-settings', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
    }
  ];

  return (
    <>
      <style jsx global>{scrollbarStyles}</style>
      <div className="fixed top-16 left-0 bg-[#0f172a] text-white w-64 flex flex-col bottom-0 z-30">
        {/* Scrollable content area with custom scrollbar styling */}
        <div 
          className="flex-grow overflow-y-auto overflow-x-hidden sidebar-scroll" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 #1F2937'
          }}
        >
          {/* Profile Button */}
          <div className="p-4 border-b border-gray-700">
            <button 
              onClick={handleProfileClick}
              className="flex items-center w-full p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
              suppressHydrationWarning
            >
              <div className="bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <span>{user?.displayName ? `${user.displayName.split(' ')[0]?.[0] || ''}${user.displayName.split(' ')[1]?.[0] || ''}` : 'U'}</span>
              </div>
              <div className="text-left">
                <div className="font-medium">
                  {user?.displayName ? getFirstName(user.displayName) : user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-400">{user?.email || 'No email'}</div>
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="p-4">
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase pb-2">
              MAIN NAVIGATION
            </p>
            
            <div className="space-y-2">
              {navigation.map((section) => (
                <div key={section.path || section.section} className="space-y-1">
                  <button
                    onClick={() => {
                      if (!section.items || section.items.length === 0) {
                        // Navigate directly to the page if there are no sub-items
                        router.push(section.path);
                      } else {
                        // Otherwise expand/collapse the section
                        const sectionName = section.section;
                        if (sectionName) {
                          toggleSection(sectionName.toLowerCase().replace(/\s+/g, ''));
                        }
                      }
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
                    style={{
                      backgroundColor: section.path && isActive(section.path) ? (section.color ? section.color + '22' : '#4B5563' + '22') : 'transparent',
                      borderLeft: section.path && isActive(section.path) ? `4px solid ${section.color || '#4B5563'}` : '4px solid transparent'
                    }}
                    suppressHydrationWarning
                  >
                    <div className="flex items-center">
                      {section.icon}
                      <span className="font-medium whitespace-nowrap">{section.section}</span>
                    </div>
                    
                    {(section.items && section.items.length > 0) && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 transition-transform duration-200 ${expandedSections[section.section.toLowerCase().replace(/\s+/g, '')] ? 'transform rotate-90' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Sub-items for the section if expanded */}
                  {section.items && section.items.length > 0 && expandedSections[section.section.toLowerCase().replace(/\s+/g, '')] && (
                    <div className="pl-6 space-y-1">
                      {section.items.map((item) => {
                        // Use type guards to safely access properties
                        const isNamedItem = (item: NavItem): item is NamedItem => 'name' in item;
                        const isTitledItem = (item: NavItem): item is TitledItem => 'title' in item;
                        
                        let itemLabel = '';
                        let itemIcon = null;
                        
                        if (isNamedItem(item)) {
                          itemLabel = item.name;
                          itemIcon = item.icon || null;
                        } else if (isTitledItem(item)) {
                          itemLabel = item.title;
                          itemIcon = item.icon || null;
                        }
                        
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`flex pl-3 pr-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                              isActive(item.path) 
                                ? 'bg-gray-700 text-white' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                          >
                            {itemIcon && (
                              <span className="mr-2">{itemIcon}</span>
                            )}
                            <span>{itemLabel}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* System & Support Heading with Toggle */}
          <div className="p-4 pt-2">
            <button 
              onClick={() => setSystemExpanded(!systemExpanded)}
              className="flex items-center justify-between w-full mb-2"
              aria-label="Toggle System & Support section"
              suppressHydrationWarning
            >
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                SYSTEM & SUPPORT
              </p>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${systemExpanded ? 'transform rotate-90' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* System & Support Links */}
            {systemExpanded && (
              <div className="space-y-1 mt-2">
                {systemLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      isActive(link.path) 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="p-4 pt-0">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors duration-200"
              suppressHydrationWarning
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 6a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 14.586V9z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Collapse button at bottom */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center w-full px-3 py-1.5 text-sm text-gray-400 rounded-md hover:bg-gray-800 hover:text-white transition-colors duration-200"
            aria-label="Toggle sidebar visibility"
            title="Toggle sidebar"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isCollapsed ? 'transform rotate-90' : 'transform -rotate-90'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15.707 10.707a1 1 0 01-1.414 0L10 6.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}