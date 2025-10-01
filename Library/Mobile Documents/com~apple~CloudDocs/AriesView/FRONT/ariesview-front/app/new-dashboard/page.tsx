'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NewDashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [selectedNavItem, setSelectedNavItem] = useState('quick-start')
  
  // Handler for back button
  const handleBackClick = () => {
    console.log('Back button clicked')
  }

  // Content sections
  const dashboardSections = [
    {
      id: 'optimize-performance',
      title: 'Optimize Performance',
      count: 1,
      subtitle: 'DATACENTERS REQUIRING OPTIMIZATION',
      color: 'blue',
      items: [
        {
          title: 'Workload Optimization',
          description: 'Run workload optimization to achieve consistent performance in your properties.',
          icon: '📊'
        },
        {
          title: 'Recommendations',
          description: 'View and take recommendations to improve overall portfolio performance.',
          icon: '💡'
        },
        {
          title: 'Optimization History',
          description: 'See completed optimization actions across your properties.',
          icon: '📝'
        }
      ]
    },
    {
      id: 'optimize-capacity',
      title: 'Optimize Capacity',
      count: 0,
      subtitle: 'TOTAL SAVINGS OPPORTUNITY',
      color: 'green',
      items: [
        {
          title: 'Assess Capacity',
          description: 'Determine if there is sufficient capacity in your investment properties.',
          icon: '📏'
        },
        {
          title: 'Reclaim',
          description: 'Reduce waste by reclaiming unused resources in your properties.',
          icon: '♻️'
        },
        {
          title: 'Plan',
          description: 'Use forecasts to plan for future projects and changes.',
          icon: '📅'
        },
        {
          title: 'Assess Cost',
          description: 'Analyze the costs of running your real estate portfolio.',
          icon: '💰'
        }
      ]
    },
    {
      id: 'troubleshoot',
      title: 'Troubleshoot',
      subtitle: 'ISSUES USING ALERTS, LOGS AND DASHBOARDS',
      color: 'orange',
      items: [
        {
          title: 'Alerts',
          description: 'Troubleshoot by reviewing active alerts in the system.',
          icon: '🔔'
        },
        {
          title: 'Logs',
          description: 'Troubleshoot by examining and analyzing logs.',
          icon: '📜'
        },
        {
          title: 'Troubleshoot',
          description: 'Troubleshoot by object type, using metrics to detect anomalies.',
          icon: '🔍'
        },
        {
          title: 'Virtual Machine',
          description: 'Examine virtual machine performance and issues.',
          icon: '💻'
        },
        {
          title: 'Host',
          description: 'Review host system performance and issues.',
          icon: '🖥️'
        },
        {
          title: 'Cluster',
          description: 'Analyze cluster performance and relationships.',
          icon: '🔄'
        },
        {
          title: 'Datastore',
          description: 'Examine datastore performance and capacity.',
          icon: '💾'
        },
        {
          title: 'vSAN',
          description: 'Analyze vSAN performance and health.',
          icon: '🗄️'
        }
      ]
    },
    {
      id: 'manage-configuration',
      title: 'Manage Configuration',
      count: 0,
      subtitle: 'IN COMPLIANCE',
      color: 'purple',
      items: [
        {
          title: 'vSphere Compliance',
          description: 'Assess and manage compliance requirements.',
          icon: '✅'
        },
        {
          title: 'Configuration',
          description: 'Manage and access configuration by object type.',
          icon: '⚙️'
        },
        {
          title: 'Virtual Machine',
          description: 'Configure and manage virtual machine settings.',
          icon: '💻'
        },
        {
          title: 'Host',
          description: 'Configure and manage host settings.',
          icon: '🖥️'
        },
        {
          title: 'Cluster',
          description: 'Configure and manage cluster settings.',
          icon: '🔄'
        },
        {
          title: 'Distributed Switch',
          description: 'Configure and manage distributed switch settings.',
          icon: '🔀'
        }
      ]
    }
  ]

  // Translated for AriesView real estate platform
  const ariesSections = [
    {
      id: 'roi-analysis',
      title: 'ROI Analysis',
      count: 3,
      subtitle: 'PROPERTIES REQUIRING OPTIMIZATION',
      color: 'blue',
      items: [
        {
          title: 'NOI Analysis',
          description: 'Analyze Net Operating Income based on industry averages.',
          icon: '📊'
        },
        {
          title: 'Industry Benchmarks',
          description: 'Compare your properties to industry benchmarks.',
          icon: '📈'
        },
        {
          title: 'Address Analysis',
          description: 'Just enter an address to analyze potential investments.',
          icon: '🏢'
        }
      ]
    },
    {
      id: 'lease-abstraction',
      title: 'Lease Management',
      count: 2,
      subtitle: 'LEASES REQUIRING ATTENTION',
      color: 'green',
      items: [
        {
          title: 'Lease Abstraction',
          description: 'Powerful technology to extract data from current leases.',
          icon: '📝'
        },
        {
          title: 'Model Updates',
          description: 'Automatically update your models with lease information.',
          icon: '🔄'
        },
        {
          title: 'Tenant Management',
          description: 'Track tenant information and lease status.',
          icon: '👥'
        }
      ]
    },
    {
      id: 'risk-analysis',
      title: 'Risk Analysis',
      subtitle: 'ADJUST VARIABLES FOR RISK ASSESSMENT',
      color: 'orange',
      items: [
        {
          title: 'Interest Rate Risk',
          description: 'Analyze how interest rate changes affect your returns.',
          icon: '📉'
        },
        {
          title: 'Vacancy Risk',
          description: 'Assess the impact of vacancy rates on your portfolio.',
          icon: '🏚️'
        },
        {
          title: 'Market Risk',
          description: 'Evaluate market-specific risks for your properties.',
          icon: '🌍'
        }
      ]
    },
    {
      id: 'post-deal',
      title: 'Post-Deal Management',
      count: 5,
      subtitle: 'PROPERTIES IN ACTIVE MANAGEMENT',
      color: 'purple',
      items: [
        {
          title: 'Expense Tracking',
          description: 'Track all expenses related to your properties.',
          icon: '💰'
        },
        {
          title: 'Industry Benchmarking',
          description: 'Compare your expenses with industry benchmarks.',
          icon: '⚖️'
        },
        {
          title: 'Investor Reports',
          description: 'Generate investor relation reports with real-time data.',
          icon: '📊'
        },
        {
          title: 'Performance Metrics',
          description: 'Track key performance indicators for your properties.',
          icon: '📈'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <Image 
                  src="/ariesview-logo.svg" 
                  width={28} 
                  height={28} 
                  alt="AriesView Logo" 
                />
              </div>
              <h1 className="text-xl font-medium">AriesView Operations Manager</h1>
            </div>
            
            {/* Main Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-1">
                <li>
                  <button 
                    className={`px-4 py-2 text-sm rounded-sm ${activeTab === 'home' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('home')}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    className={`px-4 py-2 text-sm rounded-sm ${activeTab === 'dashboards' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('dashboards')}
                  >
                    Dashboards
                  </button>
                </li>
                <li>
                  <button 
                    className={`px-4 py-2 text-sm rounded-sm ${activeTab === 'alerts' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('alerts')}
                  >
                    Alerts
                  </button>
                </li>
                <li>
                  <button 
                    className={`px-4 py-2 text-sm rounded-sm ${activeTab === 'environment' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('environment')}
                  >
                    Environment
                  </button>
                </li>
                <li>
                  <button 
                    className={`px-4 py-2 text-sm rounded-sm ${activeTab === 'administration' ? 'bg-gray-800' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('administration')}
                  >
                    Administration
                  </button>
                </li>
              </ul>
            </nav>
            
            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button className="text-gray-300 hover:text-white" aria-label="User Profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <div className="bg-gray-200 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-2">
            <button 
              onClick={handleBackClick}
              className="px-3 py-1 text-sm border border-gray-400 rounded flex items-center mr-4"
            >
              <span>BACK</span>
              <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button className="mr-2" aria-label="Navigate back">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-lg font-medium">Quick Start</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6">
        {/* Left Navigation */}
        <div className="flex">
          <div className="w-52 bg-white rounded shadow-sm mr-4">
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-medium text-sm">Quick Start</h3>
            </div>
            <ul className="py-2">
              <li className="py-1 px-3 text-sm font-medium hover:bg-gray-100 cursor-pointer">
                Operations Overview
              </li>
              <li className="py-1 px-3 text-sm font-medium bg-blue-50 text-blue-600 cursor-pointer">
                Optimize Performance
              </li>
              <li className="py-1 px-3 text-sm font-medium hover:bg-gray-100 cursor-pointer">
                Optimize Capacity
              </li>
              <li className="py-1 px-3 text-sm font-medium hover:bg-gray-100 cursor-pointer">
                Troubleshoot
              </li>
              <li className="py-1 px-3 text-sm font-medium hover:bg-gray-100 cursor-pointer">
                Application Monitoring
              </li>
              <li className="py-3 px-3 text-sm font-medium border-t border-gray-200">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Return to Classic Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Main Dashboard Cards */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ROI Analysis Card */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">ROI Analysis</h3>
                <div className="flex items-end mt-2">
                  <span className="text-4xl font-bold text-blue-600">3</span>
                  <div className="ml-4 text-xs text-gray-500">
                    PROPERTIES REQUIRING<br/>OPTIMIZATION
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-1 bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">📊</div>
                    <div>
                      <div className="font-medium text-sm text-blue-600">NOI Analysis</div>
                      <p className="text-xs text-gray-600 mt-1">Analyze Net Operating Income based on industry averages.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">📈</div>
                    <div>
                      <div className="font-medium text-sm text-blue-600">Industry Benchmarks</div>
                      <p className="text-xs text-gray-600 mt-1">Compare your properties to industry benchmarks.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">🏢</div>
                    <div>
                      <div className="font-medium text-sm text-blue-600">Address Analysis</div>
                      <p className="text-xs text-gray-600 mt-1">Just enter an address to analyze potential investments.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Lease Management Card */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Lease Management</h3>
                <div className="flex items-end mt-2">
                  <span className="text-4xl font-bold text-green-600">2</span>
                  <div className="ml-4 text-xs text-gray-500">
                    LEASES REQUIRING<br/>ATTENTION
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">📝</div>
                    <div>
                      <div className="font-medium text-sm text-green-600">Lease Abstraction</div>
                      <p className="text-xs text-gray-600 mt-1">Powerful technology to extract data from current leases.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">🔄</div>
                    <div>
                      <div className="font-medium text-sm text-green-600">Model Updates</div>
                      <p className="text-xs text-gray-600 mt-1">Automatically update your models with lease information.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">👥</div>
                    <div>
                      <div className="font-medium text-sm text-green-600">Tenant Management</div>
                      <p className="text-xs text-gray-600 mt-1">Track tenant information and lease status.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Risk Analysis Card */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Risk Analysis</h3>
                <div className="flex items-end mt-2">
                  <div className="text-xs text-gray-500">
                    ADJUST VARIABLES FOR<br/>RISK ASSESSMENT
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-1 bg-orange-500 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">📉</div>
                    <div>
                      <div className="font-medium text-sm text-orange-600">Interest Rate Risk</div>
                      <p className="text-xs text-gray-600 mt-1">Analyze how interest rate changes affect your returns.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">🏚️</div>
                    <div>
                      <div className="font-medium text-sm text-orange-600">Vacancy Risk</div>
                      <p className="text-xs text-gray-600 mt-1">Assess the impact of vacancy rates on your portfolio.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">🌍</div>
                    <div>
                      <div className="font-medium text-sm text-orange-600">Market Risk</div>
                      <p className="text-xs text-gray-600 mt-1">Evaluate market-specific risks for your properties.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Post-Deal Management Card */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Post-Deal Management</h3>
                <div className="flex items-end mt-2">
                  <span className="text-4xl font-bold text-purple-600">5</span>
                  <div className="ml-4 text-xs text-gray-500">
                    PROPERTIES IN<br/>ACTIVE MANAGEMENT
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-1 bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">💰</div>
                    <div>
                      <div className="font-medium text-sm text-purple-600">Expense Tracking</div>
                      <p className="text-xs text-gray-600 mt-1">Track all expenses related to your properties.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">⚖️</div>
                    <div>
                      <div className="font-medium text-sm text-purple-600">Industry Benchmarking</div>
                      <p className="text-xs text-gray-600 mt-1">Compare your expenses with industry benchmarks.</p>
                    </div>
                  </div>
                </li>
                <li className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5 text-lg">📊</div>
                    <div>
                      <div className="font-medium text-sm text-purple-600">Investor Reports</div>
                      <p className="text-xs text-gray-600 mt-1">Generate investor relation reports with real-time data.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* View More Button */}
        <div className="flex justify-center mt-6">
          <button className="px-4 py-1 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
            VIEW MORE +
          </button>
        </div>
      </div>
    </div>
  )
} 