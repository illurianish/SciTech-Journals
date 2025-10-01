'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/Sidebar'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// Sample data for the charts
const quarterlyData = {
  labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
  datasets: [
    {
      label: 'Revenue',
      data: [856000, 872000, 891000, 915000, 933000],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
    {
      label: 'Operating Expenses',
      data: [412000, 419000, 427000, 435000, 441000],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
    },
    {
      label: 'NOI',
      data: [444000, 453000, 464000, 480000, 492000],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
    },
  ],
}

const noiTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly NOI 2023',
      data: [146000, 147500, 150500, 149000, 151000, 153000, 155000, 158000, 156000, 159000, 162000, 159000],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Monthly NOI 2024',
      data: [162000, 164000, 166000],
      fill: false,
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1,
    },
  ],
}

// Property details by category
const propertyDetails = [
  {
    id: 1,
    name: 'Main Campus',
    address: '231 Forest St, Wellesley, MA',
    sqft: 350000,
    occupancy: '100%',
    annualRevenue: '$4.2M',
    annualNOI: '$2.2M',
  },
  {
    id: 2,
    name: 'College Park',
    address: '100 College St, Babson Park, MA',
    sqft: 120000,
    occupancy: '98%',
    annualRevenue: '$1.3M',
    annualNOI: '$670K',
  },
  {
    id: 3,
    name: 'Innovation Center',
    address: '75 Innovation Way, Wellesley, MA',
    sqft: 85000,
    occupancy: '95%',
    annualRevenue: '$920K',
    annualNOI: '$470K',
  },
]

export default function BabsonNOIDashboard() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
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

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {showSidebar && (
        <Sidebar
          currentPath="/operations-dashboard/open-benchmarks/babson-noi"
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
          onDashboardClick={handleDashboardClick}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
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
                <h1 className="text-2xl font-semibold text-gray-900">Babson LLC NOI Dashboard</h1>
              </div>
              <div className="flex space-x-2">
                <select 
                  className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Select time period"
                >
                  <option>2024 - Q1</option>
                  <option>2023 - Q4</option>
                  <option>2023 - Q3</option>
                  <option>2023 - Q2</option>
                  <option>2023 - Q1</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setSelectedTab('overview')}
                    className={`${
                      selectedTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab('properties')}
                    className={`${
                      selectedTab === 'properties'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Properties
                  </button>
                  <button
                    onClick={() => setSelectedTab('financials')}
                    className={`${
                      selectedTab === 'financials'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Financial Analysis
                  </button>
                  <button
                    onClick={() => setSelectedTab('forecasts')}
                    className={`${
                      selectedTab === 'forecasts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Forecasts
                  </button>
                </nav>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Annual Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$6.42M</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    +2.8%
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">vs. previous year</p>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Operating Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">$3.08M</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    +1.9%
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">vs. previous year</p>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                    <p className="text-2xl font-bold text-gray-900">$3.34M</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    +3.7%
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">vs. previous year</p>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">NOI Margin</p>
                    <p className="text-2xl font-bold text-gray-900">52.0%</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    +0.5%
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">vs. previous year</p>
              </div>
            </div>

            {/* Main Content Based on Selected Tab */}
            {selectedTab === 'overview' && (
              <>
                {/* NOI Chart */}
                <div className="bg-white p-6 rounded-md shadow-sm mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quarterly Financial Performance</h2>
                  <div className="h-80">
                    <Bar 
                      data={quarterlyData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return '$' + value.toLocaleString();
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

                {/* Property Breakdown */}
                <div className="bg-white p-6 rounded-md shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Property Overview</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sq. Ft
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Occupancy
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Revenue
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual NOI
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {propertyDetails.map(property => (
                          <tr key={property.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {property.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {property.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {property.sqft.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {property.occupancy}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {property.annualRevenue}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {property.annualNOI}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {selectedTab === 'financials' && (
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">NOI Trend Analysis</h2>
                <div className="h-80">
                  <Line
                    data={noiTrendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: false,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString();
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Key Performance Insights</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• NOI growth consistently exceeding inflation rate</li>
                      <li>• Expense ratio maintained below 48% of revenue</li>
                      <li>• 3.7% year-over-year NOI growth</li>
                      <li>• Q1 2024 shows 2.5% increase over Q4 2023</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Revenue Drivers</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Student housing: 42% of revenue</li>
                      <li>• Academic facilities: 35% of revenue</li>
                      <li>• Retail spaces: 13% of revenue</li>
                      <li>• Administrative offices: 10% of revenue</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Expense Distribution</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Facility maintenance: 32%</li>
                      <li>• Utilities: 28%</li>
                      <li>• Administrative: 22%</li>
                      <li>• Security: 10%</li>
                      <li>• Other: 8%</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'properties' && (
              <div className="space-y-6">
                {propertyDetails.map(property => (
                  <div key={property.id} className="bg-white p-6 rounded-md shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{property.name}</h2>
                        <p className="text-sm text-gray-500">{property.address}</p>
                      </div>
                      <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                        {property.occupancy} Occupied
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Square Footage</p>
                        <p className="text-xl font-bold text-gray-900">{property.sqft.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                        <p className="text-xl font-bold text-gray-900">{property.annualRevenue}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Annual NOI</p>
                        <p className="text-xl font-bold text-gray-900">{property.annualNOI}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium text-gray-500">NOI per Sq. Ft</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${(parseFloat(property.annualNOI.replace(/[^0-9.-]+/g, '')) * 1000 / property.sqft).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'forecasts' && (
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">5-Year NOI Forecast</h2>
                <div className="h-80 mb-6">
                  <Line
                    data={{
                      labels: ['2023', '2024', '2025', '2026', '2027', '2028'],
                      datasets: [
                        {
                          label: 'Projected NOI',
                          data: [3.34, 3.48, 3.63, 3.79, 3.96, 4.14],
                          fill: false,
                          borderColor: 'rgb(75, 192, 192)',
                          tension: 0.1,
                        },
                        {
                          label: 'Conservative Estimate',
                          data: [3.34, 3.41, 3.51, 3.61, 3.72, 3.83],
                          fill: false,
                          borderColor: 'rgb(153, 102, 255)',
                          borderDash: [5, 5],
                          tension: 0.1,
                        },
                        {
                          label: 'Aggressive Estimate',
                          data: [3.34, 3.55, 3.79, 4.05, 4.31, 4.58],
                          fill: false,
                          borderColor: 'rgb(255, 159, 64)',
                          borderDash: [5, 5],
                          tension: 0.1,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: false,
                          ticks: {
                            callback: function(value) {
                              return '$' + value + 'M';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Forecast Assumptions</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Base case: 4.2% annual NOI growth</li>
                      <li>• Expected enrollment increase: 2% annually</li>
                      <li>• Planned facility improvements complete by Q2 2025</li>
                      <li>• Inflation rate stabilizing at 2.5% in 2024-2028</li>
                      <li>• Operating expense ratio maintained at current levels</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <h3 className="text-md font-medium text-gray-900 mb-2">Strategic Opportunities</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Energy efficiency initiatives could reduce utility expenses by 12%</li>
                      <li>• Innovation Center expansion potential in 2025</li>
                      <li>• New revenue streams from summer program expansion</li>
                      <li>• Optimization of retail spaces could increase revenue by 8%</li>
                      <li>• Digital infrastructure investments planned for 2024-2025</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 