'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, ChevronLeft, Filter, Download, 
  Sliders, Building, DollarSign, PieChart
} from 'lucide-react'

export default function OpexBenchmarkPage() {
  const [propertyType, setPropertyType] = useState('all')
  const [expenseCategory, setExpenseCategory] = useState('all')
  const [dateRange, setDateRange] = useState('last-year')
  
  // Sample benchmark data
  const benchmarkData = [
    { 
      id: 1, 
      property: "Riverfront Plaza", 
      type: "Office", 
      area: "Boston CBD", 
      totalOpex: 14.50, // per sq ft
      marketAvgOpex: 16.25,
      expenses: {
        utilities: 3.85,
        maintenance: 2.75,
        cleaning: 2.20,
        security: 1.90,
        admin: 1.85,
        taxes: 1.95
      },
      marketExpenses: {
        utilities: 4.25,
        maintenance: 3.10,
        cleaning: 2.45,
        security: 2.15,
        admin: 2.20,
        taxes: 2.10
      }
    },
    { 
      id: 2, 
      property: "Tech Center Building", 
      type: "Office", 
      area: "Cambridge", 
      totalOpex: 15.75,
      marketAvgOpex: 15.50,
      expenses: {
        utilities: 4.20,
        maintenance: 3.15,
        cleaning: 2.35,
        security: 1.95,
        admin: 1.90,
        taxes: 2.20
      },
      marketExpenses: {
        utilities: 4.10,
        maintenance: 3.05,
        cleaning: 2.30,
        security: 1.85,
        admin: 2.05,
        taxes: 2.15
      }
    },
    { 
      id: 4, 
      property: "Downtown Retail Center", 
      type: "Retail", 
      area: "Boston CBD", 
      totalOpex: 22.30,
      marketAvgOpex: 24.15,
      expenses: {
        utilities: 5.65,
        maintenance: 4.85,
        cleaning: 3.45,
        security: 3.20,
        admin: 2.75,
        taxes: 2.40
      },
      marketExpenses: {
        utilities: 6.10,
        maintenance: 5.25,
        cleaning: 3.75,
        security: 3.45,
        admin: 3.10,
        taxes: 2.50
      }
    },
    { 
      id: 5, 
      property: "Westside Industrial Park", 
      type: "Industrial", 
      area: "Waltham", 
      totalOpex: 5.65,
      marketAvgOpex: 6.25,
      expenses: {
        utilities: 1.55,
        maintenance: 1.40,
        cleaning: 0.70,
        security: 0.65,
        admin: 0.45,
        taxes: 0.90
      },
      marketExpenses: {
        utilities: 1.70,
        maintenance: 1.65,
        cleaning: 0.75,
        security: 0.80,
        admin: 0.50,
        taxes: 0.85
      }
    }
  ]

  // Filter benchmark data based on selected filters
  const filteredData = benchmarkData.filter(item => {
    if (propertyType !== 'all' && item.type !== propertyType) return false
    return true
  })

  // Calculate portfolio averages
  const portfolioAverages = {
    totalOpex: filteredData.reduce((sum, item) => sum + item.totalOpex, 0) / filteredData.length,
    marketAvgOpex: filteredData.reduce((sum, item) => sum + item.marketAvgOpex, 0) / filteredData.length,
  }

  // Calculate expense category averages
  const calculateCategoryAverages = () => {
    const categories = ['utilities', 'maintenance', 'cleaning', 'security', 'admin', 'taxes']
    const result = {}
    
    categories.forEach(category => {
      const avg = filteredData.reduce((sum, item) => sum + item.expenses[category], 0) / filteredData.length
      const marketAvg = filteredData.reduce((sum, item) => sum + item.marketExpenses[category], 0) / filteredData.length
      result[category] = { avg, marketAvg }
    })
    
    return result
  }
  
  const categoryAverages = calculateCategoryAverages()

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 py-6">
        <div className="mb-6">
          <Link href="/operations-dashboard/custom-dashboards" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboards
          </Link>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OpEx Benchmark Analysis</h1>
            <p className="text-gray-600">Compare your portfolio's operational expenses against market standards</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Sliders className="h-4 w-4 mr-2" />
              Customize View
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="property-type" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <div className="relative">
              <select
                id="property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
            <div className="relative">
              <select
                id="expense-category"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
                <option value="security">Security</option>
                <option value="admin">Administration</option>
                <option value="taxes">Taxes & Insurance</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="relative">
              <select
                id="date-range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
                <option value="ytd">Year to Date</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto md:ml-auto self-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total OpEx (per sq ft)</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">${portfolioAverages.totalOpex.toFixed(2)}</p>
                  <p className="ml-2 text-sm text-gray-500">vs ${portfolioAverages.marketAvgOpex.toFixed(2)} market</p>
                </div>
                <div className={`text-xs ${portfolioAverages.totalOpex < portfolioAverages.marketAvgOpex ? 'text-green-600' : 'text-red-600'}`}>
                  {(((portfolioAverages.totalOpex - portfolioAverages.marketAvgOpex) / portfolioAverages.marketAvgOpex) * 100).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Building className="h-10 w-10 p-2 bg-purple-100 text-purple-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Utilities Expense</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">${categoryAverages.utilities.avg.toFixed(2)}</p>
                  <p className="ml-2 text-sm text-gray-500">vs ${categoryAverages.utilities.marketAvg.toFixed(2)} market</p>
                </div>
                <div className={`text-xs ${categoryAverages.utilities.avg < categoryAverages.utilities.marketAvg ? 'text-green-600' : 'text-red-600'}`}>
                  {(((categoryAverages.utilities.avg - categoryAverages.utilities.marketAvg) / categoryAverages.utilities.marketAvg) * 100).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <PieChart className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Maintenance Expense</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">${categoryAverages.maintenance.avg.toFixed(2)}</p>
                  <p className="ml-2 text-sm text-gray-500">vs ${categoryAverages.maintenance.marketAvg.toFixed(2)} market</p>
                </div>
                <div className={`text-xs ${categoryAverages.maintenance.avg < categoryAverages.maintenance.marketAvg ? 'text-green-600' : 'text-red-600'}`}>
                  {(((categoryAverages.maintenance.avg - categoryAverages.maintenance.marketAvg) / categoryAverages.maintenance.marketAvg) * 100).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">OpEx Breakdown by Property ($ per sq ft)</h2>
          <div className="h-64">
            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 800 250">
              {/* X and Y Axes */}
              <line x1="50" y1="220" x2="750" y2="220" stroke="#e5e7eb" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Y Axis Labels */}
              <text x="30" y="30" textAnchor="end" fontSize="12" fill="#6b7280">$25</text>
              <text x="30" y="80" textAnchor="end" fontSize="12" fill="#6b7280">$20</text>
              <text x="30" y="130" textAnchor="end" fontSize="12" fill="#6b7280">$15</text>
              <text x="30" y="180" textAnchor="end" fontSize="12" fill="#6b7280">$10</text>
              <text x="30" y="220" textAnchor="end" fontSize="12" fill="#6b7280">$5</text>
              
              {/* Horizontal Grid Lines */}
              <line x1="50" y1="30" x2="750" y2="30" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="80" x2="750" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="130" x2="750" y2="130" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="180" x2="750" y2="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* Stacked Bars for Riverfront Plaza */}
              <rect x="100" y="142" width="40" height="18" fill="#3b82f6" /> {/* utilities */}
              <rect x="100" y="160" width="40" height="17" fill="#8b5cf6" /> {/* maintenance */}
              <rect x="100" y="177" width="40" height="13" fill="#10b981" /> {/* cleaning */}
              <rect x="100" y="190" width="40" height="11" fill="#f59e0b" /> {/* security */}
              <rect x="100" y="201" width="40" height="11" fill="#ef4444" /> {/* admin */}
              <rect x="100" y="212" width="40" height="8" fill="#6b7280" /> {/* taxes */}
              
              {/* Market Average Line for Riverfront */}
              <line x1="100" y1="134" x2="140" y2="134" stroke="#000000" strokeWidth="2" />
              
              {/* Stacked Bars for Tech Center */}
              <rect x="200" y="135" width="40" height="21" fill="#3b82f6" /> {/* utilities */}
              <rect x="200" y="156" width="40" height="16" fill="#8b5cf6" /> {/* maintenance */}
              <rect x="200" y="172" width="40" height="12" fill="#10b981" /> {/* cleaning */}
              <rect x="200" y="184" width="40" height="10" fill="#f59e0b" /> {/* security */}
              <rect x="200" y="194" width="40" height="10" fill="#ef4444" /> {/* admin */}
              <rect x="200" y="204" width="40" height="16" fill="#6b7280" /> {/* taxes */}
              
              {/* Market Average Line for Tech Center */}
              <line x1="200" y1="137" x2="240" y2="137" stroke="#000000" strokeWidth="2" />
              
              {/* Stacked Bars for Retail */}
              <rect x="300" y="103" width="40" height="28" fill="#3b82f6" /> {/* utilities */}
              <rect x="300" y="131" width="40" height="24" fill="#8b5cf6" /> {/* maintenance */}
              <rect x="300" y="155" width="40" height="17" fill="#10b981" /> {/* cleaning */}
              <rect x="300" y="172" width="40" height="16" fill="#f59e0b" /> {/* security */}
              <rect x="300" y="188" width="40" height="14" fill="#ef4444" /> {/* admin */}
              <rect x="300" y="202" width="40" height="18" fill="#6b7280" /> {/* taxes */}
              
              {/* Market Average Line for Retail */}
              <line x1="300" y1="93" x2="340" y2="93" stroke="#000000" strokeWidth="2" />
              
              {/* Stacked Bars for Industrial */}
              <rect x="400" y="190" width="40" height="8" fill="#3b82f6" /> {/* utilities */}
              <rect x="400" y="198" width="40" height="7" fill="#8b5cf6" /> {/* maintenance */}
              <rect x="400" y="205" width="40" height="4" fill="#10b981" /> {/* cleaning */}
              <rect x="400" y="209" width="40" height="3" fill="#f59e0b" /> {/* security */}
              <rect x="400" y="212" width="40" height="2" fill="#ef4444" /> {/* admin */}
              <rect x="400" y="214" width="40" height="6" fill="#6b7280" /> {/* taxes */}
              
              {/* Market Average Line for Industrial */}
              <line x1="400" y1="187" x2="440" y2="187" stroke="#000000" strokeWidth="2" />
              
              {/* X Axis Labels */}
              <text x="120" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Riverfront</text>
              <text x="220" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Tech Center</text>
              <text x="320" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Retail Center</text>
              <text x="420" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Industrial</text>
              
              {/* Legend */}
              <rect x="550" y="30" width="12" height="12" fill="#3b82f6" />
              <text x="570" y="40" fontSize="12" fill="#6b7280">Utilities</text>
              
              <rect x="550" y="50" width="12" height="12" fill="#8b5cf6" />
              <text x="570" y="60" fontSize="12" fill="#6b7280">Maintenance</text>
              
              <rect x="550" y="70" width="12" height="12" fill="#10b981" />
              <text x="570" y="80" fontSize="12" fill="#6b7280">Cleaning</text>
              
              <rect x="550" y="90" width="12" height="12" fill="#f59e0b" />
              <text x="570" y="100" fontSize="12" fill="#6b7280">Security</text>
              
              <rect x="550" y="110" width="12" height="12" fill="#ef4444" />
              <text x="570" y="120" fontSize="12" fill="#6b7280">Administration</text>
              
              <rect x="550" y="130" width="12" height="12" fill="#6b7280" />
              <text x="570" y="140" fontSize="12" fill="#6b7280">Taxes & Insurance</text>
              
              <line x1="550" y1="155" x2="562" y2="155" stroke="#000000" strokeWidth="2" />
              <text x="570" y="160" fontSize="12" fill="#6b7280">Market Average</text>
            </svg>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Detailed Expense Analysis ($ per sq ft)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total OpEx</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Avg</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilities</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaning</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map(property => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.property}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.type === 'Office' ? 'bg-blue-100 text-blue-800' : 
                        property.type === 'Retail' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.totalOpex.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${property.marketAvgOpex.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${
                        property.totalOpex < property.marketAvgOpex ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(((property.totalOpex - property.marketAvgOpex) / property.marketAvgOpex) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.expenses.utilities.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.expenses.maintenance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.expenses.cleaning.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.expenses.security.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 