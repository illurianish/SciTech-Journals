'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'

export default function Dashboards() {
  const [showSidebar, setShowSidebar] = useState(true)
  const router = useRouter()
  
  // Handle navigation from sidebar
  const handleProfileClick = () => {
    router.push('/operations-dashboard?view=profile')
  }

  const handleSettingsClick = () => {
    router.push('/operations-dashboard?view=settings')
  }

  const handleDashboardClick = () => {
    router.push('/operations-dashboard')
  }

  const dashboards = [
    {
      title: "Executive Dashboard",
      description: "A high-level view combining leasing, financials, and operational KPIs for strategic decisions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-[#0f172a]",
      path: "/operations-dashboard/dashboards/executive"
    },
    {
      title: "Net Cash Flow Dashboard",
      description: "Tracks income, expenses, debt, and distributions to monitor cash flow and investment performance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-[#0f172a]",
      path: "/operations-dashboard/dashboards/cash-flow"
    },
    {
      title: "Budget vs Actual with Drill-Down",
      description: "Allows deep analysis of variances across GL accounts to ensure budget discipline and financial control.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-[#0f172a]",
      path: "/operations-dashboard/dashboards/budget-analysis"
    },
    {
      title: "Property Operations Overview",
      description: "Combines leasing activity, service tickets, expenses, and occupancy to give a full operational snapshot per property.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "bg-[#0f172a]",
      path: "/operations-dashboard/benchmark-center/property-operations-overview"
    },
    {
      title: "Delinquency Analysis",
      description: "Focuses on collections, aging receivables, and bad debt—helps reduce income leakage and manage risk.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-[#0f172a]",
      path: "/operations-dashboard/dashboards/delinquency"
    }
  ]
  
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {showSidebar && (
        <Sidebar 
          currentPath="/operations-dashboard/dashboards"
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onDashboardClick={handleDashboardClick}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 bg-white shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Toggle sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">AriesView Dashboards</h1>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <Link
                  key={dashboard.title}
                  href={dashboard.path}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-lg ${dashboard.color} text-white mb-4`}>
                      {dashboard.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{dashboard.title}</h3>
                    <p className="text-gray-600">{dashboard.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-[#0f172a] bg-opacity-10 rounded-md flex items-center justify-center text-[#0f172a]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Executive Dashboard Updated</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-[#0f172a] bg-opacity-10 rounded-md flex items-center justify-center text-[#0f172a]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Cash Flow Report Generated</p>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Active Properties</p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">$2.4M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Occupancy Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">94%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NOI Growth</p>
                    <p className="text-2xl font-semibold text-[#0f172a]">+8.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 