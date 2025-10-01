'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, ChevronLeft, Filter, Download, 
  Sliders, Building, DollarSign, Calendar, ArrowUpDown
} from 'lucide-react'

export default function LeaseBenchmarkPage() {
  const [propertyType, setPropertyType] = useState('all')
  const [marketArea, setMarketArea] = useState('all')
  const [dateRange, setDateRange] = useState('last-year')
  
  // Sample benchmark data
  const benchmarkData = [
    { 
      id: 1, 
      property: "Riverfront Plaza", 
      type: "Office", 
      area: "Boston CBD", 
      leaseRate: 65, // per sq ft
      marketAverage: 58,
      leaseTermAvg: 36, // months
      marketTermAvg: 42,
      occupancyRate: 92,
      marketOccupancy: 87,
      tenantRenewal: 78,
      marketRenewal: 65
    },
    { 
      id: 2, 
      property: "Tech Center Building", 
      type: "Office", 
      area: "Cambridge", 
      leaseRate: 72,
      marketAverage: 70,
      leaseTermAvg: 48,
      marketTermAvg: 44,
      occupancyRate: 96,
      marketOccupancy: 94,
      tenantRenewal: 82,
      marketRenewal: 75
    },
    { 
      id: 3, 
      property: "Harbor View Apartments", 
      type: "Multifamily", 
      area: "Seaport", 
      leaseRate: 3200, // per unit
      marketAverage: 3400,
      leaseTermAvg: 12,
      marketTermAvg: 12,
      occupancyRate: 95,
      marketOccupancy: 93,
      tenantRenewal: 65,
      marketRenewal: 60
    },
    { 
      id: 4, 
      property: "Downtown Retail Center", 
      type: "Retail", 
      area: "Boston CBD", 
      leaseRate: 120,
      marketAverage: 110,
      leaseTermAvg: 60,
      marketTermAvg: 54,
      occupancyRate: 85,
      marketOccupancy: 82,
      tenantRenewal: 72,
      marketRenewal: 68
    },
    { 
      id: 5, 
      property: "Westside Industrial Park", 
      type: "Industrial", 
      area: "Waltham", 
      leaseRate: 18,
      marketAverage: 15,
      leaseTermAvg: 84,
      marketTermAvg: 72,
      occupancyRate: 100,
      marketOccupancy: 94,
      tenantRenewal: 90,
      marketRenewal: 80
    }
  ]

  // Filter benchmark data based on selected filters
  const filteredData = benchmarkData.filter(item => {
    if (propertyType !== 'all' && item.type !== propertyType) return false
    if (marketArea !== 'all' && item.area !== marketArea) return false
    return true
  })

  // Calculate portfolio averages
  const portfolioAverages = {
    leaseRate: filteredData.reduce((sum, item) => sum + item.leaseRate, 0) / filteredData.length,
    marketAverage: filteredData.reduce((sum, item) => sum + item.marketAverage, 0) / filteredData.length,
    leaseTermAvg: filteredData.reduce((sum, item) => sum + item.leaseTermAvg, 0) / filteredData.length,
    marketTermAvg: filteredData.reduce((sum, item) => sum + item.marketTermAvg, 0) / filteredData.length,
    occupancyRate: filteredData.reduce((sum, item) => sum + item.occupancyRate, 0) / filteredData.length,
    marketOccupancy: filteredData.reduce((sum, item) => sum + item.marketOccupancy, 0) / filteredData.length,
    tenantRenewal: filteredData.reduce((sum, item) => sum + item.tenantRenewal, 0) / filteredData.length,
    marketRenewal: filteredData.reduce((sum, item) => sum + item.marketRenewal, 0) / filteredData.length
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Lease Benchmark Analysis</h1>
            <p className="text-gray-600">Compare your portfolio's lease performance against market standards</p>
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
                <option value="Multifamily">Multifamily</option>
                <option value="Retail">Retail</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="market-area" className="block text-sm font-medium text-gray-700 mb-1">Market Area</label>
            <div className="relative">
              <select
                id="market-area"
                value={marketArea}
                onChange={(e) => setMarketArea(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Areas</option>
                <option value="Boston CBD">Boston CBD</option>
                <option value="Cambridge">Cambridge</option>
                <option value="Seaport">Seaport</option>
                <option value="Waltham">Waltham</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <DollarSign className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Avg. Lease Rate</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">${portfolioAverages.leaseRate.toFixed(2)}</p>
                  <p className="ml-2 text-sm text-gray-500">vs ${portfolioAverages.marketAverage.toFixed(2)} market</p>
                </div>
                <div className={`text-xs ${portfolioAverages.leaseRate > portfolioAverages.marketAverage ? 'text-green-600' : 'text-red-600'}`}>
                  {(((portfolioAverages.leaseRate - portfolioAverages.marketAverage) / portfolioAverages.marketAverage) * 100).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Calendar className="h-10 w-10 p-2 bg-purple-100 text-purple-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Avg. Lease Term</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">{portfolioAverages.leaseTermAvg.toFixed(1)} mo</p>
                  <p className="ml-2 text-sm text-gray-500">vs {portfolioAverages.marketTermAvg.toFixed(1)} mo market</p>
                </div>
                <div className={`text-xs ${portfolioAverages.leaseTermAvg > portfolioAverages.marketTermAvg ? 'text-green-600' : 'text-red-600'}`}>
                  {(((portfolioAverages.leaseTermAvg - portfolioAverages.marketTermAvg) / portfolioAverages.marketTermAvg) * 100).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Building className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Occupancy Rate</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">{portfolioAverages.occupancyRate.toFixed(1)}%</p>
                  <p className="ml-2 text-sm text-gray-500">vs {portfolioAverages.marketOccupancy.toFixed(1)}% market</p>
                </div>
                <div className={`text-xs ${portfolioAverages.occupancyRate > portfolioAverages.marketOccupancy ? 'text-green-600' : 'text-red-600'}`}>
                  {(portfolioAverages.occupancyRate - portfolioAverages.marketOccupancy).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <ArrowUpDown className="h-10 w-10 p-2 bg-orange-100 text-orange-600 rounded-lg mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tenant Renewal Rate</p>
                <div className="flex items-baseline">
                  <p className="text-xl font-bold">{portfolioAverages.tenantRenewal.toFixed(1)}%</p>
                  <p className="ml-2 text-sm text-gray-500">vs {portfolioAverages.marketRenewal.toFixed(1)}% market</p>
                </div>
                <div className={`text-xs ${portfolioAverages.tenantRenewal > portfolioAverages.marketRenewal ? 'text-green-600' : 'text-red-600'}`}>
                  {(portfolioAverages.tenantRenewal - portfolioAverages.marketRenewal).toFixed(1)}% vs market
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Lease Rate Comparison by Property</h2>
          <div className="h-64">
            {/* SVG Chart */}
            <svg className="w-full h-full" viewBox="0 0 800 250">
              {/* X and Y Axes */}
              <line x1="50" y1="220" x2="750" y2="220" stroke="#e5e7eb" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="220" stroke="#e5e7eb" strokeWidth="2" />
              
              {/* Y Axis Labels */}
              <text x="30" y="30" textAnchor="end" fontSize="12" fill="#6b7280">$120</text>
              <text x="30" y="80" textAnchor="end" fontSize="12" fill="#6b7280">$90</text>
              <text x="30" y="130" textAnchor="end" fontSize="12" fill="#6b7280">$60</text>
              <text x="30" y="180" textAnchor="end" fontSize="12" fill="#6b7280">$30</text>
              <text x="30" y="220" textAnchor="end" fontSize="12" fill="#6b7280">$0</text>
              
              {/* Horizontal Grid Lines */}
              <line x1="50" y1="30" x2="750" y2="30" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="80" x2="750" y2="80" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="130" x2="750" y2="130" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="50" y1="180" x2="750" y2="180" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
              
              {/* Bars for Properties and Market Averages */}
              {/* Riverfront Plaza */}
              <rect x="100" y="80" width="30" height="140" fill="#3b82f6" fillOpacity="0.8" />
              <rect x="135" y="100" width="30" height="120" fill="#9ca3af" fillOpacity="0.6" />
              
              {/* Tech Center */}
              <rect x="230" y="60" width="30" height="160" fill="#3b82f6" fillOpacity="0.8" />
              <rect x="265" y="65" width="30" height="155" fill="#9ca3af" fillOpacity="0.6" />
              
              {/* Downtown Retail */}
              <rect x="360" y="20" width="30" height="200" fill="#3b82f6" fillOpacity="0.8" />
              <rect x="395" y="30" width="30" height="190" fill="#9ca3af" fillOpacity="0.6" />
              
              {/* Westside Industrial */}
              <rect x="490" y="185" width="30" height="35" fill="#3b82f6" fillOpacity="0.8" />
              <rect x="525" y="190" width="30" height="30" fill="#9ca3af" fillOpacity="0.6" />
              
              {/* Harbor View */}
              <rect x="620" y="-" width="30" height="1" fill="#3b82f6" fillOpacity="0.8" />
              <rect x="655" y="-" width="30" height="1" fill="#9ca3af" fillOpacity="0.6" />
              
              {/* X Axis Labels */}
              <text x="117" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Riverfront</text>
              <text x="247" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Tech Center</text>
              <text x="377" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Downtown</text>
              <text x="507" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Westside</text>
              <text x="637" y="240" textAnchor="middle" fontSize="12" fill="#6b7280">Harbor View</text>
              
              {/* Legend */}
              <rect x="600" y="30" width="15" height="15" fill="#3b82f6" fillOpacity="0.8" />
              <text x="625" y="42" fontSize="12" fill="#6b7280">Your Properties</text>
              <rect x="600" y="55" width="15" height="15" fill="#9ca3af" fillOpacity="0.6" />
              <text x="625" y="67" fontSize="12" fill="#6b7280">Market Average</text>
            </svg>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Property-by-Property Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Area</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Rate</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Avg.</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Term</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal Rate</th>
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
                        property.type === 'Industrial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${property.leaseRate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${property.marketAverage.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${
                        property.leaseRate > property.marketAverage ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(((property.leaseRate - property.marketAverage) / property.marketAverage) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {property.leaseTermAvg} mo
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${
                        property.occupancyRate >= 90 ? 'text-green-600' : 
                        property.occupancyRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {property.occupancyRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${
                        property.tenantRenewal >= 75 ? 'text-green-600' : 
                        property.tenantRenewal >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {property.tenantRenewal}%
                      </span>
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