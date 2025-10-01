'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'

export default function BenchmarkCreator() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState('my-benchmarks')
  const router = useRouter();
  
  // Handle navigation from sidebar
  const handleProfileClick = () => {
    router.push('/operations-dashboard?view=profile');
  };

  const handleSettingsClick = () => {
    router.push('/operations-dashboard?view=settings');
  };

  const handleDashboardClick = () => {
    router.push('/operations-dashboard');
  };
  
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {showSidebar && (
        <Sidebar 
          currentPath="/operations-dashboard/benchmark-creator"
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
                <h1 className="text-2xl font-semibold text-gray-900">Benchmark Creator</h1>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('my-benchmarks')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'my-benchmarks' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  My Benchmarks
                </button>
                <button 
                  onClick={() => setActiveTab('create-new')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'create-new' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  Create New
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Active Benchmarks</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    +12%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">18</p>
                <p className="mt-1 text-sm text-gray-500">Updated benchmarks in use</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Properties Benchmarked</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    +24%
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">156</p>
                <p className="mt-1 text-sm text-gray-500">Across all portfolios</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Data Points</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    +8.5K
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">42.3K</p>
                <p className="mt-1 text-sm text-gray-500">Active comparison points</p>
              </div>
            </div>

            {activeTab === 'my-benchmarks' ? (
              <div className="bg-white rounded-md shadow">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Your Benchmarks</h2>
                  <div>
                    <input
                      type="text"
                      placeholder="Search benchmarks..."
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Benchmark Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Properties
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Babson NOI Benchmark</div>
                          <div className="text-xs text-gray-500">All Property Types</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Financial
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          156
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mar 24, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link href="/operations-dashboard/benchmark-center/babson-noi" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Lease Performance Benchmark</div>
                          <div className="text-xs text-gray-500">All Property Types</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Market
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          156
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mar 24, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link href="/operations-dashboard/custom-dashboards/lease-benchmark" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Operating Expense Benchmark</div>
                          <div className="text-xs text-gray-500">All Property Types</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Operational
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          156
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Mar 24, 2024
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link href="/operations-dashboard/custom-dashboards/opex-benchmark" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">East Coast Market Rents</div>
                          <div className="text-xs text-gray-500">Commercial Office</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Market
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          43
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Oct 12, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Retail Cap Rates</div>
                          <div className="text-xs text-gray-500">Retail</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Financial
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          28
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Oct 8, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">West Coast Industrial Metrics</div>
                          <div className="text-xs text-gray-500">Industrial</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            Operational
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          35
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Oct 5, 2023
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-md shadow">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Create New Benchmark</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Benchmark Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter benchmark name" />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" aria-label="Select property type">
                          <option>Office</option>
                          <option>Retail</option>
                          <option>Industrial</option>
                          <option>Multifamily</option>
                          <option>Hospitality</option>
                          <option>Mixed Use</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Benchmark Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" aria-label="Select benchmark type">
                          <option>Market (Rents, Occupancy)</option>
                          <option>Financial (Cap Rates, NOI)</option>
                          <option>Operational (Expenses, Utilities)</option>
                          <option>Custom</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Geographic Range</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" aria-label="Select geographic range">
                          <option>National</option>
                          <option>Regional</option>
                          <option>State</option>
                          <option>Metro Area</option>
                          <option>Custom</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Sources</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input id="internal-data" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                            <label htmlFor="internal-data" className="ml-2 block text-sm text-gray-700">Internal Portfolio Data</label>
                          </div>
                          <div className="flex items-center">
                            <input id="market-data" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                            <label htmlFor="market-data" className="ml-2 block text-sm text-gray-700">Market Research Data</label>
                          </div>
                          <div className="flex items-center">
                            <input id="third-party" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="third-party" className="ml-2 block text-sm text-gray-700">Third-Party Reports</label>
                          </div>
                          <div className="flex items-center">
                            <input id="custom-data" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="custom-data" className="ml-2 block text-sm text-gray-700">Custom Data Input</label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Metrics to Include</label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input id="rent-metrics" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                            <label htmlFor="rent-metrics" className="ml-2 block text-sm text-gray-700">Rental Rates ($/sq.ft)</label>
                          </div>
                          <div className="flex items-center">
                            <input id="occupancy" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                            <label htmlFor="occupancy" className="ml-2 block text-sm text-gray-700">Occupancy Rates (%)</label>
                          </div>
                          <div className="flex items-center">
                            <input id="expense-ratio" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="expense-ratio" className="ml-2 block text-sm text-gray-700">Expense Ratios</label>
                          </div>
                          <div className="flex items-center">
                            <input id="market-cycle" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="market-cycle" className="ml-2 block text-sm text-gray-700">Market Cycle Position</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Create Benchmark
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-white rounded-md shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Benchmark Performance</h2>
              </div>
              <div className="p-6 flex justify-center items-center">
                <div className="text-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-sm">
                    Select a benchmark to view performance metrics and visualizations.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    View Sample Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 