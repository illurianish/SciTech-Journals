'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../components/Sidebar'

export default function OpenBenchmarks() {
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
  
  // Available benchmark dashboards
  const benchmarks = [
    {
      id: 'babson-noi',
      name: 'Babson LLC NOI Dashboard',
      description: 'Net Operating Income analysis dashboard for Babson College properties',
      lastUpdated: 'April 12, 2024',
      category: 'Educational'
    }
  ]
  
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {showSidebar && (
        <Sidebar 
          currentPath="/operations-dashboard/open-benchmarks"
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
                <h1 className="text-2xl font-semibold text-gray-900">Open Benchmarks</h1>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search benchmarks..."
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search benchmarks"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Available Benchmark Dashboards</h2>
              <p className="text-sm text-gray-500">Select a dashboard to view detailed analytics and insights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benchmarks.map(benchmark => (
                <Link 
                  key={benchmark.id} 
                  href={`/operations-dashboard/open-benchmarks/${benchmark.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{benchmark.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {benchmark.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{benchmark.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>Last updated: {benchmark.lastUpdated}</span>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Placeholder for adding new benchmarks */}
              <div className="block bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Add New Benchmark
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 