"use client";

import { useState } from "react";
import { BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight, X, Download, Filter, RefreshCw } from "lucide-react";

interface Metric {
  name: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface PropertyData {
  name: string;
  type: string;
  metrics: {
    capRate: string;
    noi: string;
    irr: string;
    cashOnCash: string;
  };
}

interface BenchmarkData {
  id: number;
  name: string;
  type: string;
  properties: number;
  models: number;
  metrics: {
    [key: string]: string;
  };
  lastUpdated: string;
  status: string;
}

interface BenchmarkAnalysisProps {
  benchmark: BenchmarkData;
  onClose: () => void;
  properties?: PropertyData[];
}

export default function BenchmarkAnalysis({ benchmark, onClose, properties = [] }: BenchmarkAnalysisProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1y");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - would come from actual benchmark data in real implementation
  const keyMetrics: Metric[] = [
    { name: "Average Cap Rate", value: "5.4%", change: 0.3, trend: "up" },
    { name: "Median IRR", value: "12.8%", change: -0.5, trend: "down" },
    { name: "Average NOI", value: "$2.95M", change: 1.2, trend: "up" },
    { name: "Occupancy Rate", value: "94%", change: 0.8, trend: "up" },
    { name: "Expense Ratio", value: "42%", change: -0.4, trend: "up" },
    { name: "Debt Service Coverage", value: "1.6x", change: 0.1, trend: "up" }
  ];

  const chartData = {
    propertyTypes: [
      { name: "Office", value: 35 },
      { name: "Multifamily", value: 28 },
      { name: "Industrial", value: 22 },
      { name: "Retail", value: 12 },
      { name: "Mixed-Use", value: 3 }
    ],
    locationData: [
      { name: "Boston", value: 42 },
      { name: "Cambridge", value: 18 },
      { name: "Somerville", value: 15 },
      { name: "Newton", value: 10 },
      { name: "Other", value: 15 }
    ],
    performanceTrends: {
      capRate: [5.2, 5.3, 5.4, 5.4, 5.5, 5.3, 5.4, 5.5, 5.6, 5.4, 5.3, 5.4],
      irr: [12.2, 12.4, 12.3, 12.5, 12.6, 12.8, 12.7, 12.9, 12.8, 12.6, 12.5, 12.8]
    }
  };

  const renderTrend = (trend: string | undefined, change: number | undefined) => {
    if (!trend || change === undefined) return null;
    
    const color = trend === 'up' 
      ? change > 0 ? 'text-green-600' : 'text-red-600' 
      : change < 0 ? 'text-green-600' : 'text-red-600';
    
    const Icon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
    
    return (
      <div className={`flex items-center ${color}`}>
        <Icon className="h-4 w-4 mr-1" />
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">
            {benchmark.name}: Benchmark Analysis
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              aria-label="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button 
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              aria-label="Download analysis as PDF"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              aria-label="Close analysis"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex space-x-1 mb-2 md:mb-0">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  selectedTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('metrics')}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  selectedTab === 'metrics' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Metrics Detail
              </button>
              <button
                onClick={() => setSelectedTab('comparison')}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  selectedTab === 'comparison' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Market Comparison
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setSelectedPeriod('3m')}
                  className={`px-3 py-1 text-xs font-medium ${
                    selectedPeriod === '3m' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  3M
                </button>
                <button 
                  onClick={() => setSelectedPeriod('6m')}
                  className={`px-3 py-1 text-xs font-medium ${
                    selectedPeriod === '6m' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  6M
                </button>
                <button 
                  onClick={() => setSelectedPeriod('1y')}
                  className={`px-3 py-1 text-xs font-medium ${
                    selectedPeriod === '1y' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  1Y
                </button>
                <button 
                  onClick={() => setSelectedPeriod('all')}
                  className={`px-3 py-1 text-xs font-medium ${
                    selectedPeriod === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  All
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1 text-xs font-medium border border-gray-300 rounded-md bg-white flex items-center"
              >
                <Filter className="h-3 w-3 mr-1" />
                Filters
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-3 p-3 border border-gray-200 rounded-md bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="property-type-filter" className="block text-xs font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    id="property-type-filter"
                    className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="office">Office</option>
                    <option value="multifamily">Multifamily</option>
                    <option value="industrial">Industrial</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location-filter" className="block text-xs font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    id="location-filter"
                    className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Locations</option>
                    <option value="boston">Boston</option>
                    <option value="cambridge">Cambridge</option>
                    <option value="somerville">Somerville</option>
                    <option value="newton">Newton</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="metric-filter" className="block text-xs font-medium text-gray-700 mb-1">
                    Primary Metric
                  </label>
                  <select
                    id="metric-filter"
                    className="w-full text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cap-rate">Cap Rate</option>
                    <option value="irr">IRR</option>
                    <option value="noi">NOI</option>
                    <option value="cash-on-cash">Cash on Cash</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {selectedTab === 'overview' && (
            <div className="p-6">
              {/* Key Metrics */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Key Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">{metric.name}</div>
                      <div className="text-2xl font-semibold mb-1">{metric.value}</div>
                      {renderTrend(metric.trend, metric.change)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Property Type Distribution</h4>
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-blue-200 mx-auto mb-2" />
                      <div className="text-gray-500 text-sm">Property Type Breakdown</div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {chartData.propertyTypes.map((type, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="text-sm text-gray-600">{type.name}</div>
                            <div className="text-sm font-medium">{type.value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Geographic Distribution</h4>
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-green-200 mx-auto mb-2" />
                      <div className="text-gray-500 text-sm">Location Breakdown</div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {chartData.locationData.map((location, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="text-sm text-gray-600">{location.name}</div>
                            <div className="text-sm font-medium">{location.value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Trends */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Performance Trends</h4>
                <div className="relative h-64 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-purple-200 mx-auto mb-2" />
                    <div className="text-gray-500 text-sm">
                      Showing {selectedPeriod === '3m' ? '3 month' : selectedPeriod === '6m' ? '6 month' : selectedPeriod === '1y' ? '1 year' : 'all time'} trends
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Cap Rate Trend</h5>
                        <div className="flex items-center">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: '70%' }}></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">5.4%</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">IRR Trend</h5>
                        <div className="flex items-center">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600" style={{ width: '85%' }}></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">12.8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Properties Summary */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Top Performing Properties</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cap Rate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IRR
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NOI
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cash on Cash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.slice(0, 5).map((property, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {property.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.metrics.capRate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.metrics.irr}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.metrics.noi}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.metrics.cashOnCash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'metrics' && (
            <div className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Metrics View</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Detailed metrics analysis would be displayed here, including comprehensive financial 
                  analysis and performance breakdowns.
                </p>
              </div>
            </div>
          )}
          
          {selectedTab === 'comparison' && (
            <div className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Market Comparison View</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Market comparison analysis would be displayed here, showing how the benchmark 
                  performs against market averages and competitor properties.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="text-sm text-gray-500">
            Last updated: {benchmark.lastUpdated} • {benchmark.properties} properties
          </div>
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100"
            aria-label="Close analysis view"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 